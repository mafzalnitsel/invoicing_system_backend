// seed.js
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import { loginToSAP } from "./loginToSAP.js";

configDotenv();

// ===== Import all models =====
import Customer from "../models/Customer.js";
import ContactPerson from "../models/ContactPerson.js";
import Branch from "../models/Branch.js";
import SalesEmployee from "../models/SalesEmployee.js";
import Owner from "../models/Owner.js";
import Item from "../models/Item.js";
import Tax from "../models/Tax.js";
import Warehouse from "../models/Warehouse.js";
import CostCentre from "../models/CostCentre.js";
import ChartOfAccount from "../models/ChartOfAccount.js";
import Invoice from "../models/Invoice.js";

// ===== API mapping =====
const collections = [
  {
    name: "Customer",
    model: Customer,
    endpoint: "/BusinessPartners",
    keyField: "CardCode",
  },
  {
    name: "ContactPerson",
    model: ContactPerson,
    endpoint: "/BusinessPartners",
    keyField: "InternalCode", // adjust based on your schema
  },
  {
    name: "Branch",
    model: Branch,
    endpoint: "/BusinessPlaces",
    keyField: "BPLId",
  },
  {
    name: "SalesEmployee",
    model: SalesEmployee,
    endpoint: "/SalesPersons",
    keyField: "SalesEmployeeCode",
  },
  {
    name: "Owner",
    model: Owner,
    endpoint: "/EmployeesInfo",
    keyField: "EmployeeID",
  },
  {
    name: "Item",
    model: Item,
    endpoint:
      "/Items?$select=ItemCode,ItemName,ItemWarehouseInfoCollection,SalesUnit,PurchaseUnit,InventoryUOM",
    keyField: "ItemCode",
  },
  {
    name: "Tax",
    model: Tax,
    endpoint: "/VatGroups",
    keyField: "Code",
  },
  {
    name: "Warehouse",
    model: Warehouse,
    endpoint: "/Warehouses",
    keyField: "WarehouseCode",
  },
  {
    name: "CostCentre",
    model: CostCentre,
    endpoint: "/ProfitCenters",
    keyField: "CenterCode",
  },
  {
    name: "ChartOfAccount",
    model: ChartOfAccount,
    endpoint: "/ChartOfAccounts",
    keyField: "Code",
  },
  // {
  //   name: "Invoice",
  //   model: Invoice,
  //   endpoint: "/Invoices",
  //   keyField: "DocEntry",
  // },
];

async function fetchFromSAP(sessionId, endpoint) {
  const res = await fetch(`${process.env.SAP_URI}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      Cookie: `B1SESSION=${sessionId}`,
    },
  });

  if (!res.ok) {
    throw new Error(
      `Fetch failed ${endpoint}: ${res.status} ${res.statusText}`
    );
  }

  const data = await res.json();
  return data.value || [];
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Logging into SAP...");
    const sessionId = await loginToSAP();
    console.log("SAP login successful.");

    for (const col of collections) {
      console.log(`Fetching ${col.name}...`);
      const data = await fetchFromSAP(sessionId, col.endpoint);
      console.log(`Fetched ${data.length} ${col.name} record(s).`);

      for (const record of data) {
        await col.model.findOneAndUpdate(
          { [col.keyField]: record[col.keyField] },
          record,
          { upsert: true, new: true }
        );
      }

      console.log(`${col.name} inserted/updated successfully.`);
    }

    console.log("All collections seeded successfully.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
