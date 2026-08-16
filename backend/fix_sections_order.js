import mongoose from "mongoose";
import dotenv from "dotenv";
import InvoiceTemplate from "./models/InvoiceTemplate.js";

dotenv.config();

async function run() {
  const uri = process.env.DEV_MODE === "true" ? process.env.DEV_MONGO_URI : process.env.PRO_MONGO_URI;
  console.log("Connecting to Database:", uri ? uri.split("@").slice(-1)[0] : "undefined");

  try {
    await mongoose.connect(uri);
    console.log("Connected!\n");

    const templates = await InvoiceTemplate.find({});
    console.log(`Found ${templates.length} templates.`);

    let fixed = 0;
    for (const t of templates) {
      const order = t.config?.sectionsOrder || [];
      if (!order.includes("terms")) {
        // Insert "terms" after "notes"
        const notesIdx = order.indexOf("notes");
        if (notesIdx !== -1) {
          order.splice(notesIdx + 1, 0, "terms");
        } else {
          // fallback: insert before "signature"
          const sigIdx = order.indexOf("signature");
          order.splice(sigIdx !== -1 ? sigIdx : order.length, 0, "terms");
        }

        t.config.sectionsOrder = order;
        t.markModified("config");
        await t.save();
        console.log(`  Fixed: "${t.name}" → ${order.join(", ")}`);
        fixed++;
      }
    }

    console.log(`\nFixed ${fixed} templates. ✅`);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

run();
