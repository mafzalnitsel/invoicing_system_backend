// seed.js
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import { loginToSAP } from "./loginToSAP.js";

configDotenv();

// ===== Import Models =====
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

// ===== Helper: Fetch from SAP =====
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

// ===== Generic Seeder =====
async function genericSeeder(sessionId, name, endpoint, uniqueField, Model) {
  const data = await fetchFromSAP(sessionId, endpoint);
  console.log(
    `Fetched from SAP: ${data.length} ${name}(s). Now seeding ${name} to MongoDB...`
  );

  for (const record of data) {
    await Model.findOneAndUpdate(
      { [uniqueField]: record[uniqueField] },
      record,
      {
        upsert: true,
        new: true,
      }
    );
    console.log(`${name} ${record[uniqueField]} inserted/updated.`);
  }
  console.log(`${name} inserted/updated successfully.`);
}

// ===== Special Seeder for Items (optimized) =====
async function seedItems(sessionId) {
  const batchSize = 1; // Fetch one at a time to avoid huge payload
  let skip = 0;
  let totalSeeded = 0;

  while (true) {
    const data = await fetchFromSAP(
      sessionId,
      `/Items?$skip=${skip}&$top=${batchSize}&$select=ItemCode,ItemName,ItemWarehouseInfoCollection,SalesUnit,PurchaseUnit,InventoryUOM`
    );

    if (!data.length) break;

    console.log(
      `Fetched from SAP: ${data.length} Item(s). Now seeding Items to MongoDB...`
    );

    for (const record of data) {
      await Item.findOneAndUpdate({ ItemCode: record.ItemCode }, record, {
        upsert: true,
        new: true,
      });
      console.log(`Item ${record.ItemCode} inserted/updated.`);
      totalSeeded++;
    }

    skip += batchSize;
  }

  console.log(`Total Items seeded: ${totalSeeded}`);
}

// ===== Seeder Functions =====
async function seedCustomers(sessionId) {
  await genericSeeder(
    sessionId,
    "Customer",
    "/BusinessPartners?$top=3",
    "CardCode",
    Customer
  );
}

async function seedContactPersons(sessionId) {
  const data = await fetchFromSAP(
    sessionId,
    "/BusinessPartners?$select=ContactEmployees&$top=3"
  );
  console.log(
    `Fetched from SAP: ${data.length} BusinessPartner(s). Now seeding Contact Persons to MongoDB...`
  );

  for (const bp of data) {
    if (bp.ContactEmployees) {
      for (const contact of bp.ContactEmployees) {
        await ContactPerson.findOneAndUpdate(
          { InternalCode: contact.InternalCode },
          contact,
          { upsert: true, new: true }
        );
        console.log(`Contact Person ${contact.InternalCode} inserted/updated.`);
      }
    }
  }
  console.log("Contact Persons inserted/updated successfully.");
}

async function seedBranches(sessionId) {
  await genericSeeder(
    sessionId,
    "Branch",
    "/BusinessPlaces?$top=3",
    "BPLID",
    Branch
  );
}

async function seedSalesEmployees(sessionId) {
  await genericSeeder(
    sessionId,
    "Sales Employee",
    "/SalesPersons?$top=3",
    "SalesEmployeeCode",
    SalesEmployee
  );
}

async function seedOwners(sessionId) {
  await genericSeeder(
    sessionId,
    "Owner",
    "/EmployeesInfo",
    "EmployeeID",
    Owner
  );
}

async function seedTaxes(sessionId) {
  await genericSeeder(sessionId, "Tax", "/VatGroups?$top=3", "Code", Tax);
}

async function seedWarehouses(sessionId) {
  await genericSeeder(
    sessionId,
    "Warehouse",
    "/Warehouses?$top=3",
    "WarehouseCode",
    Warehouse
  );
}

async function seedCostCentres(sessionId) {
  await genericSeeder(
    sessionId,
    "Cost Centre",
    "/ProfitCenters?$top=3",
    "CenterCode",
    CostCentre
  );
}

async function seedChartOfAccounts(sessionId) {
  await genericSeeder(
    sessionId,
    "Chart Of Account",
    "/ChartOfAccounts?$top=3",
    "Code",
    ChartOfAccount
  );
}

async function seedInvoices(sessionId) {
  await genericSeeder(
    sessionId,
    "Invoice",
    "/Invoices?$top=3",
    "DocEntry",
    Invoice
  );
}

// ===== Main Seeder =====
async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Logging into SAP...");
    const sessionId = await loginToSAP();
    console.log("SAP login successful.");

    // ===== Choose which collections to seed =====
    // await seedCustomers(sessionId);
    // await seedContactPersons(sessionId);
    // await seedBranches(sessionId);
    // await seedSalesEmployees(sessionId);
    // await seedOwners(sessionId);
    // await seedItems(sessionId); // Optimized item seeding
    // await seedTaxes(sessionId);
    // await seedWarehouses(sessionId);
    // await seedCostCentres(sessionId);
    // await seedChartOfAccounts(sessionId);
    // await seedInvoices(sessionId);

    console.log("All collections seeded successfully.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
