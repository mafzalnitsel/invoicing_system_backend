// seedItems.js
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
import mongoose from "mongoose";
import Item from "../models/Item.js";
import { loginToSAP } from "./loginToSAP.js";
import { configDotenv } from "dotenv";
configDotenv();

const SAP_URI = process.env.SAP_URI;

async function fetchItemsFromSAP(sessionId) {
  const res = await fetch(
    `${SAP_URI}/Items?$select=ItemCode,ItemName,ItemWarehouseInfoCollection,SalesUnit,PurchaseUnit,InventoryUOM`,
    {
      headers: {
        "Content-Type": "application/json",
        Cookie: `B1SESSION=${sessionId}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`SAP Items fetch failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.value || [];
}

async function seed() {
  try {
    // 1. Connect Mongo
    await mongoose.connect(process.env.MONGO_URI);

    // 2. Login to SAP
    console.log("Logging into SAP...");
    const sessionId = await loginToSAP();
    console.log("SAP login successful.");

    // 3. Fetch items
    console.log("Fetching items from SAP...");
    const items = await fetchItemsFromSAP(sessionId);
    console.log(`Fetched ${items.length} item(s) from SAP.`);

    // 4. Insert into Mongo
    for (const item of items) {
      await Item.findOneAndUpdate({ ItemCode: item.ItemCode }, item, {
        upsert: true,
        new: true,
      });
    }

    console.log("Items inserted/updated successfully.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
