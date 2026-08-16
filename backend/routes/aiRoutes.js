import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { uploadInvoiceFile } from "../utils/invoiceStorage.js";
import jwt from "jsonwebtoken";
import ChatMessage from "../models/ChatMessage.js";
import Invoice from "../models/Invoice.js";
import Customer from "../models/Customer.js";
import LedgerAccount from "../models/LedgerAccount.js";
import BookkeepingEntry from "../models/BookkeepingEntry.js";
import CashTransaction from "../models/CashTransaction.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const Tesseract = require("tesseract.js");
const pdfParse = require("pdf-parse");

const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

// Initialize Gemini AI lazily (after env is loaded by server.js)
let genAI = null;
const getGenAI = () => {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log("✅ Gemini AI initialized");
  }
  return genAI;
};

// OpenRouter fallback - uses OpenAI-compatible API
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions";
// Vision-capable models to try in order
const OPENROUTER_MODELS = [
  "openrouter/free",                      // Best free vision model (200K context, auto-routes to best available)
];

const callOpenRouter = async (prompt, base64Data, mimeType) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OpenRouter API key not configured");
  }

  console.log("🔄 Falling back to OpenRouter...");

  let lastError = null;

  for (const model of OPENROUTER_MODELS) {
    try {
      console.log(`🔷 Trying OpenRouter model: ${model}`);

      const response = await fetch(OPENROUTER_BASE_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5001",
          "X-Title": "Invoice OCR"
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${mimeType};base64,${base64Data}`
                  }
                }
              ]
            }
          ],
          max_tokens: 4096
        })
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.log(`⚠️ OpenRouter model ${model} failed: ${response.status}`);
        lastError = new Error(`OpenRouter API error ${response.status}: ${errorBody}`);
        continue;
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;

      if (!text) {
        console.log(`⚠️ OpenRouter model ${model}: No content in response`);
        lastError = new Error("No content in OpenRouter response");
        continue;
      }

      console.log(`✅ OpenRouter success with model: ${model}`);
      return text;
    } catch (error) {
      console.log(`⚠️ OpenRouter model ${model} error: ${error.message}`);
      lastError = error;
      continue;
    }
  }

  throw lastError || new Error("All OpenRouter models failed");
};

// Invoice OCR extraction prompt — outputs CSV directly
const INVOICE_EXTRACTION_PROMPT = `
You are an invoice-to-CSV converter.

Extract every visible labeled field and every visible table row from this invoice image and convert it into CSV format.

STRICT RULES:
1. Output ONLY raw CSV text. No markdown, no backticks, no explanations.
2. Do NOT invent, infer, or recalculate anything.
3. Extract ONLY what is visibly present in the image.
4. Preserve spelling, capitalization, and wording exactly as shown.
5. Remove currency symbols and thousand separators.
   Example: ₹1,500.50 → 1500.50
6. Preserve decimal precision exactly as shown.
7. If a value contains a comma, wrap it in double quotes.
8. If a field contains multiple lines (e.g., address), combine into one value separated by spaces.
9. If a visible label has no value, output the label with an empty value.

FORMAT — Three sections separated by one blank line:

PART 1 — Invoice Details
One row per field in this format:
label,value

Include all visible fields:
Invoice number, dates, vendor info, buyer info, GSTIN, phone, email, bank details, payment terms, etc.

PART 2 — Line Items Table
First row = column headers exactly as shown.
Then include every visible item row.

PART 3 — Totals
One row per total field in this format:
label,value

Include subtotal, discounts, tax lines, grand total, paid amount, balance, etc.

Now convert this invoice image to CSV:
`;

// Helper: clean AI response — strip markdown code blocks if present
const cleanCSVResponse = (text) => {
  let cleaned = text.trim();
  // Remove markdown code blocks (```csv ... ``` or ``` ... ```) — greedy to capture all content
  const codeBlockMatch = cleaned.match(/```(?:csv)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (codeBlockMatch) {
    cleaned = codeBlockMatch[1].trim();
  }
  // Also strip any leading/trailing backticks that aren't full code blocks
  cleaned = cleaned.replace(/^`+|`+$/g, '').trim();
  console.log("📝 Cleaned CSV length:", cleaned.length, "| First 200 chars:", cleaned.substring(0, 200));
  return cleaned;
};

// Helper: process invoice with Gemini (primary)
const processWithGemini = async (base64Data, mimeType) => {
  const ai = getGenAI();
  if (!ai) throw new Error("Gemini AI not initialized");

  const modelOptions = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash-lite",
  ];

  let lastError = null;

  for (const modelName of modelOptions) {
    try {
      console.log(`🔷 Trying model: ${modelName}`);
      const model = ai.getGenerativeModel({ model: modelName });

      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      };

      const result = await model.generateContent([INVOICE_EXTRACTION_PROMPT, imagePart]);
      const response = await result.response;
      console.log(`✅ Success with model: ${modelName}`);
      return response.text();
    } catch (error) {
      console.log(`⚠️ Model ${modelName} failed: ${error.message}`);
      lastError = error;
      continue;
    }
  }

  throw lastError || new Error("All Gemini models failed");
};

// Helper: parse raw invoice text to 3-part CSV format (Local Fallback)
const parseInvoiceTextToCSV = (text) => {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);
  
  let invoiceNumber = "";
  let invoiceDate = "";
  let dueDate = "";
  let gstin = "";
  let email = "";
  let phone = "";
  let vendorName = "";
  let customerName = "";
  
  let subtotal = "";
  let tax = "";
  let grandTotal = "";
  
  const lineItems = [];
  
  // Find GSTIN, Email, Phone
  const gstinRegex = /\b\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}\b/i;
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
  const phoneRegex = /(?:\+?\d{1,4}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check GSTIN
    if (!gstin && gstinRegex.test(line)) {
      gstin = line.match(gstinRegex)[0];
    }
    // Check Email
    if (!email && emailRegex.test(line)) {
      email = line.match(emailRegex)[0];
    }
    // Check Phone
    if (!phone && phoneRegex.test(line)) {
      phone = line.match(phoneRegex)[0];
    }
    
    // Check Invoice Number
    if (!invoiceNumber) {
      const invMatch = line.match(/(?:invoice|inv|bill|doc|document)(?:\s*number|\s*no|\s*#)?[:.\s\-#]+([A-Z0-9\-]+)/i);
      if (invMatch) {
        invoiceNumber = invMatch[1];
      }
    }
    
    // Check Invoice Date
    if (!invoiceDate) {
      const dateMatch = line.match(/(?:invoice\s*date|inv\s*date|date\s*of\s*issue|issue\s*date|date)[:.\s\-]+([0-9a-zA-Z\s\-\/\.,]+)/i);
      if (dateMatch && !line.toLowerCase().includes("due")) {
        invoiceDate = dateMatch[1].trim();
      }
    }
    
    // Check Due Date
    if (!dueDate) {
      const dueMatch = line.match(/(?:due\s*date|payment\s*due)[:.\s\-]+([0-9a-zA-Z\s\-\/\.,]+)/i);
      if (dueMatch) {
        dueDate = dueMatch[1].trim();
      }
    }
    
    // Check Customer Name / Bill To
    if (line.toLowerCase().includes("bill to") || line.toLowerCase().includes("invoice to") || line.toLowerCase().includes("customer") || line.toLowerCase().includes("client")) {
      if (i + 1 < lines.length) {
        customerName = lines[i + 1].replace(/[:\-]/g, "").trim();
      }
    }
    
    // Check Subtotal
    if (!subtotal) {
      const subMatch = line.match(/(?:sub\s*total|subtotal|net\s*amount)[:.\s\-]+(?:rs\.?|inr|usd|[\$₹€£])?\s*([\d,]+\.?\d*)/i);
      if (subMatch) {
        subtotal = subMatch[1].replace(/,/g, '');
      }
    }
    
    // Check Tax
    if (!tax) {
      const taxMatch = line.match(/(?:gst|tax|vat|cgst|sgst|igst)(?:\s*\d+%)?\s*[:.\s\-#]+(?:rs\.?|inr|usd|[\$₹€£])?\s*([\d,]+\.?\d*)/i);
      if (taxMatch) {
        tax = taxMatch[1].replace(/,/g, '');
      }
    }
    
    // Check Grand Total
    if (!grandTotal) {
      const totalMatch = line.match(/(?:grand\s*total|total|amount\s*due|payable\s*amount)[:.\s\-]+(?:rs\.?|inr|usd|[\$₹€£])?\s*([\d,]+\.?\d*)/i);
      if (totalMatch && !line.toLowerCase().includes("sub")) {
        grandTotal = totalMatch[1].replace(/,/g, '');
      }
    }
  }
  
  // Estimate Vendor Name
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    if (
      !line.toLowerCase().includes("invoice") &&
      !line.toLowerCase().includes("bill to") &&
      !line.toLowerCase().includes("date") &&
      !line.toLowerCase().includes("tax") &&
      !line.toLowerCase().includes("total") &&
      !gstinRegex.test(line) &&
      !emailRegex.test(line) &&
      line.length > 3
    ) {
      vendorName = line;
      break;
    }
  }
  
  // Find Line Items
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();
    
    // Skip headers and totals
    if (
      lowerLine.includes("invoice") || 
      lowerLine.includes("bill to") || 
      lowerLine.includes("date") || 
      lowerLine.includes("total") || 
      lowerLine.includes("subtotal") || 
      lowerLine.includes("gstin") || 
      lowerLine.includes("tax") ||
      lowerLine.includes("gst") ||
      lowerLine.includes("vat") ||
      lowerLine.includes("cgst") ||
      lowerLine.includes("sgst") ||
      lowerLine.includes("igst") ||
      lowerLine.includes("page") ||
      lowerLine.includes("phone") ||
      lowerLine.includes("email") ||
      lowerLine.includes("bank") ||
      lowerLine.includes("payment terms") ||
      lowerLine.includes("description") ||
      lowerLine.includes("quantity") ||
      lowerLine.includes("rate") ||
      lowerLine.includes("price") ||
      lowerLine.includes("amount")
    ) {
      continue;
    }
    
    // Pattern 1: Description Qty Price Total
    const itemMatch1 = line.match(/^(.+?)\s+(\d+)\s+([\d,]+\.?\d*)\s+([\d,]+\.?\d*)$/);
    if (itemMatch1) {
      lineItems.push({
        description: itemMatch1[1].trim(),
        qty: itemMatch1[2],
        price: itemMatch1[3].replace(/,/g, ''),
        total: itemMatch1[4].replace(/,/g, '')
      });
      continue;
    }
    
    // Pattern 2: Description Total
    const itemMatch2 = line.match(/^(.+?)\s+([\d,]+\.?\d*)$/);
    if (itemMatch2) {
      const desc = itemMatch2[1].trim();
      const val = itemMatch2[2].replace(/,/g, '');
      if (desc.length > 2 && isNaN(desc)) {
        lineItems.push({
          description: desc,
          qty: "1",
          price: val,
          total: val
        });
      }
    }
  }
  
  // Format CSV
  let csv = "PART 1 — Invoice Details\nlabel,value\n";
  csv += `Invoice Number,${invoiceNumber}\n`;
  csv += `Invoice Date,${invoiceDate}\n`;
  csv += `Due Date,${dueDate}\n`;
  csv += `Vendor Name,${vendorName}\n`;
  csv += `Customer Name,${customerName}\n`;
  csv += `GSTIN,${gstin}\n`;
  csv += `Phone,${phone}\n`;
  csv += `Email,${email}\n`;
  
  csv += "\nPART 2 — Line Items Table\nDescription,Quantity,Price,Total\n";
  if (lineItems.length > 0) {
    lineItems.forEach(item => {
      csv += `"${item.description}",${item.qty},${item.price},${item.total}\n`;
    });
  } else {
    csv += "No items found,1,0,0\n";
  }
  
  csv += "\nPART 3 — Totals\nlabel,value\n";
  csv += `Subtotal,${subtotal || grandTotal || "0"}\n`;
  csv += `Tax,${tax || "0"}\n`;
  csv += `Grand Total,${grandTotal || subtotal || "0"}\n`;
  
  return csv;
};

// Helper: process invoice with local Tesseract OCR
const processWithLocalOCR = async (base64Data) => {
  const imageBuffer = Buffer.from(base64Data, "base64");
  let worker = null;
  try {
    worker = await Tesseract.createWorker("eng", 1);
    const { data: { text } } = await worker.recognize(imageBuffer);
    console.log("📝 Tesseract raw text length:", text.length);
    return parseInvoiceTextToCSV(text);
  } finally {
    if (worker) {
      await worker.terminate();
    }
  }
};

// Helper: process invoice with local PDF text parser
const processLocalPDF = async (base64Data) => {
  const pdfBuffer = Buffer.from(base64Data, "base64");
  try {
    const data = await pdfParse(pdfBuffer);
    console.log("📝 pdf-parse text length:", data.text?.length || 0);
    return parseInvoiceTextToCSV(data.text || "");
  } catch (error) {
    console.error("❌ pdf-parse failed:", error.message);
    throw new Error("Failed to parse PDF text: " + error.message);
  }
};

// POST /api/ai/invoice-ocr
router.post("/invoice-ocr", async (req, res) => {
  try {
    const { image, mimeType = "image/jpeg" } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image data is required"
      });
    }

    const hasGemini = !!process.env.GEMINI_API_KEY;
    const hasOpenRouter = !!process.env.OPENROUTER_API_KEY;

    if (!hasGemini && !hasOpenRouter) {
      return res.status(500).json({
        success: false,
        message: "No AI provider configured. Add GEMINI_API_KEY or OPENROUTER_API_KEY to .env"
      });
    }

    console.log("🤖 Processing invoice...");
    console.log("📄 File type:", mimeType);

    // Remove data URL prefix if present (handles both images and PDFs)
    let base64Data = image;
    if (image.includes('base64,')) {
      base64Data = image.split('base64,')[1];
    }

    let text = null;
    let provider = null;
    let fallbackToLocal = false;

    // Try Gemini first (primary)
    if (hasGemini) {
      try {
        console.log("🔷 Trying Gemini AI...");
        text = await processWithGemini(base64Data, mimeType);
        provider = "gemini";
        console.log("✅ Gemini response received");
      } catch (geminiError) {
        console.warn("⚠️ Gemini failed:", geminiError.message);

        // If OpenRouter is available, fall back to it
        if (hasOpenRouter) {
          console.log("🔄 Gemini failed, trying OpenRouter fallback...");
        } else {
          fallbackToLocal = true;
        }
      }
    } else if (hasOpenRouter) {
      fallbackToLocal = false;
    } else {
      fallbackToLocal = true;
    }

    // Fallback to OpenRouter if Gemini failed or unavailable
    if (!text && hasOpenRouter) {
      try {
        console.log("🟠 Trying OpenRouter...");
        text = await callOpenRouter(INVOICE_EXTRACTION_PROMPT, base64Data, mimeType);
        provider = "openrouter";
        console.log("✅ OpenRouter response received");
      } catch (openRouterError) {
        console.error("❌ OpenRouter also failed:", openRouterError.message);
        fallbackToLocal = true;
      }
    }

    // Fallback to local Tesseract OCR / PDF parser if both AI providers failed
    if (!text && fallbackToLocal) {
      try {
        console.log(`🔄 AI providers failed. Falling back to local OCR (type: ${mimeType})...`);
        if (mimeType === "application/pdf" || mimeType.includes("pdf")) {
          text = await processLocalPDF(base64Data);
          provider = "local-pdf-parse";
        } else {
          text = await processWithLocalOCR(base64Data);
          provider = "local-tesseract";
        }
        console.log(`✅ Local extraction successful via ${provider}`);
      } catch (localOcrError) {
        console.error(`❌ Local extraction failed:`, localOcrError.message);
        throw new Error("All AI providers and local extraction failed to process the invoice");
      }
    }

    if (!text) {
      return res.status(500).json({
        success: false,
        message: "All AI providers failed to process the invoice"
      });
    }

    console.log(`📄 Raw ${provider} Response (${text.length} chars):`, text.substring(0, 800));

    // Clean up the CSV response (strip markdown code blocks if present)
    const csvText = cleanCSVResponse(text);

    console.log(`✅ Successfully extracted invoice CSV via ${provider}`);

    // Store the uploaded file in Supabase (auto-deletes after 5 hours)
    let storageInfo = null;
    try {
      storageInfo = await uploadInvoiceFile(image, mimeType, 'invoice');
      if (storageInfo) {
        console.log(`📁 File stored in Supabase: ${storageInfo.fileName} (expires: ${storageInfo.expiresAt})`);
      }
    } catch (storageError) {
      console.warn("⚠️ Failed to store file in Supabase:", storageError.message);
    }

    res.json({
      success: true,
      csv: csvText,
      message: `Invoice CSV extracted successfully via ${provider}`,
      provider: provider,
      storage: storageInfo
    });

  } catch (error) {
    console.error("❌ AI Processing Error:", error);

    if (error.message?.includes("API_KEY")) {
      return res.status(401).json({
        success: false,
        message: "Invalid API key. Please check your configuration."
      });
    }

    if (error.message?.includes("SAFETY")) {
      return res.status(400).json({
        success: false,
        message: "Image was flagged by safety filters. Please try a different image."
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to process invoice with AI",
      error: error.message
    });
  }
});

// POST /api/ai/extract-text - Simple text extraction from image
router.post("/extract-text", async (req, res) => {
  try {
    const { image, mimeType = "image/jpeg" } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image data is required"
      });
    }

    const hasGemini = !!process.env.GEMINI_API_KEY;
    const hasOpenRouter = !!process.env.OPENROUTER_API_KEY;

    const base64Image = image.includes('base64,') ? image.split('base64,')[1] : image;
    const extractPrompt = "Extract all text from this image. Return only the text content, preserving the layout as much as possible.";

    let text = null;
    let fallbackToLocal = false;

    // Try Gemini first with multiple model fallbacks
    if (hasGemini) {
      const modelOptions = [
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-2.5-flash-lite",
        "gemini-2.0-flash-lite",
      ];

      for (const modelName of modelOptions) {
        try {
          const ai = getGenAI();
          if (ai) {
            console.log(`🔷 Trying text extraction with: ${modelName}`);
            const model = ai.getGenerativeModel({ model: modelName });
            const result = await model.generateContent([
              extractPrompt,
              { inlineData: { data: base64Image, mimeType } }
            ]);
            text = (await result.response).text();
            console.log(`✅ Text extraction success with: ${modelName}`);
            break;
          }
        } catch (geminiError) {
          console.warn(`⚠️ ${modelName} failed:`, geminiError.message);
          continue;
        }
      }

      if (!text) {
        if (hasOpenRouter) {
          console.log("🔄 Gemini failed, trying OpenRouter fallback...");
        } else {
          fallbackToLocal = true;
        }
      }
    } else if (hasOpenRouter) {
      fallbackToLocal = false;
    } else {
      fallbackToLocal = true;
    }

    // Fallback to OpenRouter
    if (!text && hasOpenRouter) {
      try {
        console.log("🟠 Trying OpenRouter for text extraction...");
        text = await callOpenRouter(extractPrompt, base64Image, mimeType);
        console.log("✅ OpenRouter text extraction success");
      } catch (openRouterError) {
        console.error("❌ OpenRouter text extraction failed:", openRouterError.message);
        fallbackToLocal = true;
      }
    }

    // Fallback to local Tesseract OCR / PDF parser
    if (!text && fallbackToLocal) {
      try {
        console.log(`🔄 AI providers failed for text extraction. Running local processing (type: ${mimeType})...`);
        if (mimeType === "application/pdf" || mimeType.includes("pdf")) {
          const pdfBuffer = Buffer.from(base64Image, "base64");
          const pdfData = await pdfParse(pdfBuffer);
          text = pdfData.text;
        } else {
          const imageBuffer = Buffer.from(base64Image, "base64");
          const worker = await Tesseract.createWorker("eng", 1);
          const { data: { text: localText } } = await worker.recognize(imageBuffer);
          await worker.terminate();
          text = localText;
        }
        console.log("✅ Local OCR text extraction successful");
      } catch (localOcrError) {
        console.error("❌ Local OCR text extraction also failed:", localOcrError.message);
        throw new Error("All AI providers and local OCR failed to extract text from the image");
      }
    }

    if (!text) {
      return res.status(500).json({
        success: false,
        message: "Failed to extract text from image"
      });
    }

    res.json({
      success: true,
      text: text,
      message: "Text extracted successfully"
    });

  } catch (error) {
    console.error("Text extraction error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to extract text",
      error: error.message
    });
  }
});

// GET /api/ai/chat-history
router.get("/chat-history", verifyToken, async (req, res) => {
  try {
    const history = await ChatMessage.find({ userId: req.user.id }).sort({ timestamp: 1 });
    res.json({
      success: true,
      history: history.map(msg => ({
        id: msg._id,
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
      }))
    });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ success: false, message: "Failed to load chat history" });
  }
});

// POST /api/ai/chat-message
router.post("/chat-message", verifyToken, async (req, res) => {
  try {
    const { role, content } = req.body;
    if (!role || !content) {
      return res.status(400).json({ success: false, message: "Role and content are required" });
    }

    const newMessage = new ChatMessage({
      userId: req.user.id,
      role,
      content,
    });
    await newMessage.save();

    res.status(201).json({
      success: true,
      message: {
        id: newMessage._id,
        role: newMessage.role,
        content: newMessage.content,
        timestamp: newMessage.timestamp
      }
    });
  } catch (error) {
    console.error("Error saving chat message:", error);
    res.status(500).json({ success: false, message: "Failed to save chat message" });
  }
});

// DELETE /api/ai/chat-history - Clear chat
router.delete("/chat-history", verifyToken, async (req, res) => {
  try {
    await ChatMessage.deleteMany({ userId: req.user.id });
    res.json({
      success: true,
      message: "Chat history cleared successfully"
    });
  } catch (error) {
    console.error("Error clearing chat history:", error);
    res.status(500).json({ success: false, message: "Failed to clear chat history" });
  }
});

// POST /api/ai/cfo-chat
router.post("/cfo-chat", verifyToken, async (req, res) => {
  try {
    const { history } = req.body;
    const userId = req.user.id;

    if (!history || !Array.isArray(history)) {
      return res.status(400).json({ success: false, message: "History array is required" });
    }

    // 1. Gather all tenant metrics from DB
    const [invoices, customers, ledgerAccounts, bookkeepingEntries, cashflowEntries] = await Promise.all([
      Invoice.find({ userId, isDeleted: false }),
      Customer.find({ userId }),
      LedgerAccount.find({ userId }),
      BookkeepingEntry.find({ userId }),
      CashTransaction.find({ userId })
    ]);

    // Summarize the data for Gemini context
    const invoiceCount = invoices.length;
    const invoiceTotal = invoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
    const invoicePaid = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
    const invoiceUnpaid = invoices.filter(inv => inv.status !== 'paid' && inv.status !== 'cancelled').reduce((sum, inv) => sum + (inv.balanceDue || 0), 0);
    const overdueInvoices = invoices.filter(inv => inv.status === 'overdue');

    const customerCount = customers.length;
    
    // Ledger accounts balances
    const ledgerBalances = ledgerAccounts.map(acc => `- ${acc.name} (${acc.code}): ₹${acc.balance.toLocaleString("en-IN")}`).join("\n");

    const bkIncome = bookkeepingEntries.filter(e => e.type === "income" || e.type === "Income").reduce((sum, e) => sum + (e.amount || 0), 0);
    const bkExpense = bookkeepingEntries.filter(e => e.type === "expense" || e.type === "Expenses").reduce((sum, e) => sum + (e.amount || 0), 0);
    const netProfit = bkIncome - bkExpense;

    const cfInflow = cashflowEntries.filter(t => t.type === 'inflow').reduce((sum, t) => sum + (t.amount || 0), 0);
    const cfOutflow = cashflowEntries.filter(t => t.type === 'outflow').reduce((sum, t) => sum + (t.amount || 0), 0);
    const netCashFlow = cfInflow - cfOutflow;

    const systemPrompt = `You are the AI CFO / Financial Assistant for "FinSmart" - a professional books & accounting SaaS clone of Zoho Books.
Your tone should be highly professional, concise, clear, financial, and actionable.
You will answer the user's questions strictly based on the company's live financial data provided in the context below.
Do not make up figures. Do not output raw JSON or code.
If data is missing for a calculation, explain it simply.
Keep answers short and directly to the point. Focus on key metrics like revenue, cash balance, profits, overdue invoices, and financial ratios.

=== LIVE FINANCIAL DATA CONTEXT ===
- Registered Customers: ${customerCount}
- Bookkeeping Income (Live Ledger): ₹${bkIncome.toLocaleString("en-IN")}
- Bookkeeping Expenses (Live Ledger): ₹${bkExpense.toLocaleString("en-IN")}
- Net Profit: ₹${netProfit.toLocaleString("en-IN")}
- Total Invoices Generated: ${invoiceCount} (Total Value: ₹${invoiceTotal.toLocaleString("en-IN")})
- Paid Invoices Value: ₹${invoicePaid.toLocaleString("en-IN")}
- Outstanding Receivables: ₹${invoiceUnpaid.toLocaleString("en-IN")}
- Overdue Invoices Count: ${overdueInvoices.length}
- Actual Cash Inflow (Receipts): ₹${cfInflow.toLocaleString("en-IN")}
- Actual Cash Outflow (Payments/Expenses): ₹${cfOutflow.toLocaleString("en-IN")}
- Net Cash Flow: ₹${netCashFlow.toLocaleString("en-IN")}

=== CHART OF ACCOUNTS BALANCES ===
${ledgerBalances || "No ledger balances registered."}
`;

    // Process history into Gemini message format
    const contents = [];
    contents.push({ role: "user", parts: [{ text: systemPrompt }] });
    contents.push({ role: "model", parts: [{ text: "Acknowledged. I will act as the AI CFO and answer strictly based on the provided live financial data." }] });

    // Append conversation history
    const recentHistory = history.slice(-10); // Keep last 10 messages for context
    recentHistory.forEach(msg => {
      contents.push({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      });
    });

    const ai = getGenAI();
    let replyText = "";

    if (ai) {
      const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent({ contents });
      const response = await result.response;
      replyText = response.text().trim();
    } else {
      // Fallback local rules if Gemini key is missing
      const userMessage = history[history.length - 1]?.content?.toLowerCase() || "";
      if (userMessage.includes("revenue") || userMessage.includes("income") || userMessage.includes("sales")) {
        replyText = `Your total revenue is ₹${bkIncome.toLocaleString("en-IN")} based on bookkeeping records. You have ${invoiceCount} invoices totaling ₹${invoiceTotal.toLocaleString("en-IN")}.`;
      } else if (userMessage.includes("expense") || userMessage.includes("spend") || userMessage.includes("cost")) {
        replyText = `Your total expenses are ₹${bkExpense.toLocaleString("en-IN")}. Net profit is ₹${netProfit.toLocaleString("en-IN")}.`;
      } else if (userMessage.includes("cash") || userMessage.includes("balance") || userMessage.includes("inflow")) {
        replyText = `Net cash flow is ₹${netCashFlow.toLocaleString("en-IN")} (Inflow: ₹${cfInflow.toLocaleString("en-IN")}, Outflow: ₹${cfOutflow.toLocaleString("en-IN")}).`;
      } else {
        replyText = `Live Dashboard Analysis: Revenue ₹${bkIncome.toLocaleString("en-IN")}, Expenses ₹${bkExpense.toLocaleString("en-IN")}, Outstanding: ₹${invoiceUnpaid.toLocaleString("en-IN")}. Let me know if you have questions.`;
      }
    }

    res.json({
      success: true,
      reply: replyText
    });

  } catch (error) {
    console.error("❌ AI CFO Chat Error:", error);
    res.status(500).json({ success: false, message: "AI CFO could not process the chat message", error: error.message });
  }
});

export default router;
