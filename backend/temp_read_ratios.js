import mongoose from "mongoose";

const PRO_MONGO_URI = "mongodb+srv://devsynth01_db_user:UcgRRYzXdhNUX7LH@cluster0.eil2puq.mongodb.net/Financialautomation?retryWrites=true&w=majority";

async function run() {
  await mongoose.connect(PRO_MONGO_URI);
  console.log("Connected to MongoDB!");
  
  const collections = ["invoices", "purchaseinvoices", "payrolls", "financialratios", "balancesheets", "profitlosses"];
  
  for (const collName of collections) {
    const count = await mongoose.connection.db.collection(collName).countDocuments();
    console.log(`Collection '${collName}' count: ${count}`);
    if (count > 0) {
      const samples = await mongoose.connection.db.collection(collName).find().limit(2).toArray();
      console.log(`Sample from '${collName}':`, JSON.stringify(samples, null, 2));
    }
  }

  await mongoose.disconnect();
}

run().catch(console.error);
