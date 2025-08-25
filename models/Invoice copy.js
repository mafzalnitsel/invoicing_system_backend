import { Schema, model } from "mongoose";

// SAP Boolean mapping helper
const sapBoolean = {
  type: Boolean,
  set: (v) => v === "tYES" || v === true,
  get: (v) => (v ? "tYES" : "tNO"),
};

// Invoice Line Schema (Item Details)
const InvoiceLineSchema = new Schema(
  {
    ItemCode: { type: String, required: true },
    ItemDescription: String,
    Quantity: Number,
    Price: Number,
    DiscountPercent: Number, 
    LineTotal: Number,
    WarehouseCode: String,
    TaxCode: String,
    AccountCode: String,
    CostingCode: String, // Dimension 1
    CostingCode2: String, // Dimension 2
    CostingCode3: String, // Dimension 3
    SalesPersonCode: Number,  
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
    DocType: String,
    DocDate: Date,
    DocDueDate: Date,
    CardCode: String,
    CardName: String,
    Address: String,
    NumAtCard: String,
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

    // SAP Document Status
    Canceled: sapBoolean,
    Printed: sapBoolean,
    DocStatus: String,

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
        TaxCode: String,
        AccountCode: String,
      },
    ],

    // Audit Fields
    CreatedBy: Number,
    UpdatedBy: Number,
  },
  { timestamps: true }
);

export default model("Invoice", InvoiceSchema);
