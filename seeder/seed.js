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

// ===== Seeding Functions =====
async function seedCustomers(sessionId) {
  const data = await fetchFromSAP(sessionId, "/BusinessPartners?$top=3");
  for (const record of data) {
    // Here you can transform record before saving
    await Customer.findOneAndUpdate({ CardCode: record.CardCode }, record, {
      upsert: true,
      new: true,
    });
  }
  console.log("Customers inserted/updated successfully.");
}

async function seedContactPersons(sessionId) {
  const data = await fetchFromSAP(
    sessionId,
    "/BusinessPartners?$select=ContactEmployees&$top=3"
  );
  // Map ContactEmployees if necessary
  for (const bp of data) {
    if (bp.ContactEmployees) {
      for (const contact of bp.ContactEmployees) {
        await ContactPerson.findOneAndUpdate(
          { InternalCode: contact.InternalCode },
          contact,
          { upsert: true, new: true }
        );
      }
    }
  }
  console.log("Contact Persons inserted/updated successfully.");
}

async function seedBranches(sessionId) {
  const data = await fetchFromSAP(sessionId, "/BusinessPlaces?$top=3");
  for (const record of data) {
    await Branch.findOneAndUpdate({ BPLID: record.BPLID }, record, {
      upsert: true,
      new: true,
    });
  }
  console.log("Branches inserted/updated successfully.");
}

async function seedSalesEmployees(sessionId) {
  const data = await fetchFromSAP(sessionId, "/SalesPersons?$top=3");
  for (const record of data) {
    await SalesEmployee.findOneAndUpdate(
      { SalesEmployeeCode: record.SalesEmployeeCode },
      record,
      { upsert: true, new: true }
    );
  }
  console.log("Sales Employees inserted/updated successfully.");
}

async function seedOwners(sessionId) {
  const data = await fetchFromSAP(sessionId, "/EmployeesInfo?$top=3");
  for (const record of data) {
    await Owner.findOneAndUpdate({ EmployeeID: record.EmployeeID }, record, {
      upsert: true,
      new: true,
    });
  }
  console.log("Owners inserted/updated successfully.");
}

async function seedItems(sessionId) {
  const data = await fetchFromSAP(
    sessionId,
    "/Items?$top=3&$select=ItemCode,ItemName,ItemWarehouseInfoCollection,SalesUnit,PurchaseUnit,InventoryUOM"
  );
  for (const record of data) {
    await Item.findOneAndUpdate({ ItemCode: record.ItemCode }, record, {
      upsert: true,
      new: true,
    });
  }
  console.log("Items inserted/updated successfully.");
}

async function seedTaxes(sessionId) {
  const data = await fetchFromSAP(sessionId, "/VatGroups?$top=3");
  for (const record of data) {
    await Tax.findOneAndUpdate({ Code: record.Code }, record, {
      upsert: true,
      new: true,
    });
  }
  console.log("Taxes inserted/updated successfully.");
}

async function seedWarehouses(sessionId) {
  const data = await fetchFromSAP(sessionId, "/Warehouses?$top=3");
  for (const record of data) {
    await Warehouse.findOneAndUpdate(
      { WarehouseCode: record.WarehouseCode },
      record,
      { upsert: true, new: true }
    );
  }
  console.log("Warehouses inserted/updated successfully.");
}

async function seedCostCentres(sessionId) {
  const data = await fetchFromSAP(sessionId, "/ProfitCenters?$top=3");
  for (const record of data) {
    await CostCentre.findOneAndUpdate(
      { CenterCode: record.CenterCode },
      record,
      { upsert: true, new: true }
    );
  }
  console.log("Cost Centres inserted/updated successfully.");
}

async function seedChartOfAccounts(sessionId) {
  const data = await fetchFromSAP(sessionId, "/ChartOfAccounts?$top=3");
  for (const record of data) {
    await ChartOfAccount.findOneAndUpdate({ Code: record.Code }, record, {
      upsert: true,
      new: true,
    });
  }
  console.log("Chart of Accounts inserted/updated successfully.");
}

async function seedInvoices(sessionId) {
  const data = await fetchFromSAP(sessionId, "/Invoices?$top=3");
  for (const record of data) {
    await Invoice.findOneAndUpdate({ DocEntry: record.DocEntry }, record, {
      upsert: true,
      new: true,
    });
  }
  console.log("Invoices inserted/updated successfully.");
}

// ===== Main Seeder =====
async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Logging into SAP...");
    const sessionId = await loginToSAP();
    console.log("SAP login successful.");

    // await seedCustomers(sessionId);
    await seedContactPersons(sessionId);
    // await seedBranches(sessionId);
    // await seedSalesEmployees(sessionId);
    // await seedOwners(sessionId);
    // await seedItems(sessionId);
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
