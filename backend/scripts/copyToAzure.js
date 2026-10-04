require("dotenv").config();
const { MongoClient } = require("mongodb");

const SOURCE_URI = process.env.ATLAS_URI;  // old Atlas database
const TARGET_URI = process.env.MONGO_URI;  // new Azure DocumentDB
const SOURCE_DB = process.env.ATLAS_DB || "test";
const TARGET_DB = "lavenderroute";

async function copy() {
  const source = new MongoClient(SOURCE_URI);
  const target = new MongoClient(TARGET_URI);
  await source.connect();
  await target.connect();

  const collections = await source.db(SOURCE_DB).listCollections().toArray();
  if (collections.length === 0) {
    console.log(`No collections found in "${SOURCE_DB}". Check ATLAS_DB.`);
  }

  for (const { name } of collections) {
    const docs = await source.db(SOURCE_DB).collection(name).find().toArray();
    if (docs.length > 0) {
      await target.db(TARGET_DB).collection(name).insertMany(docs);
    }
    console.log(`Copied ${docs.length} documents from ${name}`);
  }

  await source.close();
  await target.close();
  console.log("Done!");
}

copy().catch(err => { console.error(err); process.exit(1); });