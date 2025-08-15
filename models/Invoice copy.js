import { Schema, model, Types } from "mongoose";

// Reusable SAP Boolean mapper (tYES / tNO ↔ true / false)
const sapBoolean = {
  type: Boolean,
  set: (v) => v === "tYES" || v === true,
  get: (v) => (v ? "tYES" : "tNO"),
};

// Document Line Schema (items inside the invoice)
const InvoiceLineSchema = new Schema(
  {
    ItemCode: { type: String, required: true },
    ItemDescription: String,
    Quantity: Number,
    Price: Number,
    DiscountPercent: Number,
    LineTotal: Number,
    WarehouseCode: { type: String, ref: "Warehouse" },
    TaxCode: { type: String, ref: "Tax" },
    AccountCode: { type: String, ref: "ChartOfAccount" },
    CostingCode: { type: String, ref: "CostCentre" }, // Dimension 1
    CostingCode2: { type: String, ref: "CostCentre" }, // Dimension 2
    CostingCode3: { type: String, ref: "CostCentre" }, // Dimension 3
    SalesPersonCode: { type: Number, ref: "SalesEmployee" },
    BaseEntry: Number,
    BaseLine: Number,
    BaseType: Number,
  },
  { _id: false }
);

// Invoice Schema
const InvoiceSchema = new Schema(
  {
    DocEntry: { type: Number, required: true, unique: true },
    DocNum: Number,
    DocType: String, // "dDocument_Items"
    DocDate: Date,
    DocDueDate: Date,
    CardCode: String, // BP Code
    CardName: String, // BP Name
    Address: String,
    NumAtCard: String, // Customer Ref #
    VatPercent: Number,
    VatSum: Number,
    VatSumSys: Number,
    VatSumFC: Number,
    DocTotal: Number,
    DocTotalSys: Number,
    DocTotalFC: Number,
    PaidToDate: Number,
    PaidToDateSys: Number,
    PaidToDateFC: Number,
    Comments: String,

    // References
    Branch: { type: Types.ObjectId, ref: "Branch" },
    SalesPerson: { type: Types.ObjectId, ref: "SalesEmployee" },
    ContactPerson: { type: Types.ObjectId, ref: "ContactPerson" },
    Warehouse: { type: Types.ObjectId, ref: "Warehouse" },
    CostCentre: { type: Types.ObjectId, ref: "CostCentre" },
    Tax: { type: Types.ObjectId, ref: "Tax" },

    // Document Status
    Canceled: sapBoolean,
    Printed: sapBoolean,
    DocStatus: String, // "O" (Open) or "C" (Closed)

    // Currency & Rates
    DocCurrency: String,
    DocRate: Number,
    DocTotalGross: Number,

    // Lines
    DocumentLines: [InvoiceLineSchema],

    // Additional Expenses
    DocumentAdditionalExpenses: [
      {
        ExpenseCode: Number,
        LineTotal: Number,
        TaxCode: { type: String, ref: "Tax" },
        AccountCode: { type: String, ref: "ChartOfAccount" },
      },
    ],

    // Audit Fields
    CreatedBy: Number,
    UpdatedBy: Number,
  },
  { timestamps: true }
);

export default model("Invoice", InvoiceSchema);
