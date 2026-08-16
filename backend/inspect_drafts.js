import mongoose from "mongoose";
import dotenv from "dotenv";
import Invoice from "./models/Invoice.js";

dotenv.config();

async function run() {
  const uri = process.env.DEV_MODE === "true" ? process.env.DEV_MONGO_URI : process.env.PRO_MONGO_URI;
  console.log("Connecting to Database:", uri ? uri.split("@").slice(-1)[0] : "undefined");
  
  try {
    await mongoose.connect(uri);
    console.log("Connected successfully!\n");

    const latest = await Invoice.findOne().sort({ createdAt: -1 });
    if (!latest) {
      console.log("No invoices found.");
    } else {
      console.log("Latest Invoice Details:");
      console.log(`- ID: ${latest._id}`);
      console.log(`- Invoice No: ${latest.invoiceNumber}`);
      console.log(`- Status: ${latest.status}`);
      console.log(`- Notes: "${latest.notes}"`);
      console.log(`- Terms & Conditions: "${latest.termsAndConditions}"`);
    }

  } catch (err) {
    console.error("Database error:", err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
