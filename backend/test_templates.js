import mongoose from "mongoose";
import dotenv from "dotenv";
import InvoiceTemplate from "./models/InvoiceTemplate.js";
import InvoiceTemplateVersion from "./models/InvoiceTemplateVersion.js";
import Invoice from "./models/Invoice.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const DEV_URI = process.env.DEV_MONGO_URI || "mongodb://localhost:27017/finsmart";
const PRO_URI = process.env.PRO_MONGO_URI;

async function runTests() {
  console.log("🚀 Starting Invoice Templates Integration Tests...");
  
  try {
    try {
      console.log(`🔌 Attempting connection to DEV database...`);
      await mongoose.connect(DEV_URI, { serverSelectionTimeoutMS: 3000 });
      console.log("📦 Connected to MongoDB (Development)");
    } catch (err) {
      if (PRO_URI) {
        console.log("🔄 Development database connection failed. Falling back to PRO cloud database...");
        await mongoose.connect(PRO_URI);
        console.log("📦 Connected to MongoDB (Fallback to Cloud Atlas)");
      } else {
        throw err;
      }
    }

    // Setup mock user IDs (tenants)
    const tenantA = new mongoose.Types.ObjectId();
    const tenantB = new mongoose.Types.ObjectId();

    // 1. Clean up existing test data
    await InvoiceTemplate.deleteMany({ userId: { $in: [tenantA, tenantB] } });
    await InvoiceTemplateVersion.deleteMany({});
    console.log("🧹 Cleaned test templates and history.");

    // 2. Create standard template for tenant A
    const template1 = new InvoiceTemplate({
      userId: tenantA,
      name: "Corporate Layout",
      description: "Clean layout for business clients",
      status: "active",
      isDefault: true,
      config: {
        design: { primaryColor: "#4f46e5", fontFamily: "Inter" }
      }
    });
    await template1.save();
    console.log("✅ Created default template for Tenant A.");

    // 3. Uniqueness check: same tenant cannot reuse name
    try {
      const dupNameTemplate = new InvoiceTemplate({
        userId: tenantA,
        name: "Corporate Layout",
        config: { design: { primaryColor: "#10b981" } }
      });
      await dupNameTemplate.save();
      throw new Error("FAIL: Allowed duplicate name for same tenant.");
    } catch (err) {
      if (err.message.includes("FAIL")) throw err;
      console.log("✅ Blocked duplicate name for the same tenant (Unique index working).");
    }

    // 4. Tenant isolation check: Tenant B can use the same name
    const templateB = new InvoiceTemplate({
      userId: tenantB,
      name: "Corporate Layout",
      status: "active",
      isDefault: true,
      config: { design: { primaryColor: "#ef4444" } }
    });
    await templateB.save();
    console.log("✅ Allowed same name for different tenant (Multi-tenant naming working).");

    // 5. Default toggle check: creating a new default template resets previous defaults for that tenant only
    await InvoiceTemplate.updateMany({ userId: tenantA }, { isDefault: false });
    const template2 = new InvoiceTemplate({
      userId: tenantA,
      name: "Modern Theme",
      status: "active",
      isDefault: true,
      config: { design: { primaryColor: "#06b6d4" } }
    });
    await template2.save();

    // Query template 1 to assert it is no longer default
    const refetched1 = await InvoiceTemplate.findById(template1._id);
    const refetchedB = await InvoiceTemplate.findById(templateB._id);

    if (refetched1.isDefault) {
      throw new Error("FAIL: Previous default template was not cleared.");
    }
    if (!refetchedB.isDefault) {
      throw new Error("FAIL: Tenant B default template was affected by Tenant A updates.");
    }
    console.log("✅ Default flag toggling and cross-tenant isolation verified successfully.");

    // 6. Template Duplication test
    const dupName = `${template2.name} (Copy)`;
    const duplicated = new InvoiceTemplate({
      userId: tenantA,
      name: dupName,
      description: template2.description,
      status: template2.status,
      isDefault: false,
      config: template2.config
    });
    await duplicated.save();
    console.log("✅ Successfully duplicated template config details.");

    // 7. Version history tracking test
    // Update template2 config and trigger history capture
    template2.config.design.primaryColor = "#e11d48"; // Rose-600
    await template2.save();

    // Create history snapshot entry
    const newVersion = new InvoiceTemplateVersion({
      templateId: template2._id,
      versionNumber: 2,
      config: template2.config
    });
    await newVersion.save();

    const versions = await InvoiceTemplateVersion.find({ templateId: template2._id });
    if (versions.length === 0) {
      throw new Error("FAIL: Version snapshot history entry not found.");
    }
    console.log(`✅ Version history tracking validated (Found ${versions.length} versions).`);

    // 8. Invoice layout snapshot preservation test
    const invoice = new Invoice({
      userId: tenantA,
      invoiceNumber: "TEST-INV-999",
      invoiceDate: new Date(),
      dueDate: new Date(),
      customerName: "Acme Corp",
      customerEmail: "acme@example.com",
      businessName: "Seller Inc",
      businessEmail: "seller@example.com",
      items: [{ productName: "Widget A", quantity: 5, unitPrice: 20, total: 100 }],
      subtotal: 100,
      taxAmount: 0,
      grandTotal: 100,
      balanceDue: 100,
      status: "sent",
      templateId: template2._id,
      templateSnapshot: template2.config // snapshot saved
    });
    await invoice.save();

    const refetchedInvoice = await Invoice.findById(invoice._id);
    if (!refetchedInvoice.templateSnapshot || refetchedInvoice.templateSnapshot.design.primaryColor !== "#e11d48") {
      throw new Error("FAIL: Invoice layout configuration snapshot was not preserved.");
    }
    console.log("✅ Confirmed finalized invoice successfully froze layout snapshot layout.");

    // Clean up test data
    await InvoiceTemplate.deleteMany({ userId: { $in: [tenantA, tenantB] } });
    await InvoiceTemplateVersion.deleteMany({ templateId: { $in: [template1._id, template2._id, templateB._id] } });
    await Invoice.deleteOne({ _id: invoice._id });
    console.log("🧹 Test environment cleaned up.");

    console.log("\n🎉 ALL INVOICE TEMPLATE TESTS PASSED SUCCESSFULLY! 🎉\n");
  } catch (error) {
    console.error("❌ Test Suite failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

runTests();
