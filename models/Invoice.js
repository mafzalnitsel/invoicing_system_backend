import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Items inside request_body
const ItemSchema = new Schema(
  {
    hsCode: String,
    productDescription: String,
    rate: String,
    uoM: String,
    quantity: Number,
    totalValues: Number,
    valueSalesExcludingST: Number,
    fixedNotifiedValueOrRetailPrice: Number,
    salesTaxApplicable: Number,
    salesTaxWithheldAtSource: Number,
    extraTax: Number,
    furtherTax: Number,
    sroScheduleNo: String,
    fedPayable: Number,
    discount: Number,
    saleType: String,
    sroItemSerialNo: String,
  },
  { _id: false }
);

// Response nested schemas
const InvoiceStatusSchema = new Schema(
  {
    itemSNo: String,
    statusCode: String,
    status: String,
    invoiceNo: String,
    errorCode: String,
    error: String,
  },
  { _id: false }
);

const ValidationResponseSchema = new Schema(
  {
    statusCode: String,
    status: String,
    error: String,
    invoiceStatuses: [InvoiceStatusSchema],
  },
  { _id: false }
);

const ResponseBodySchema = new Schema(
  {
    invoiceNumber: String,
    dated: Date,
    validationResponse: ValidationResponseSchema,
  },
  { _id: false }
);

// Request body schema
const RequestBodySchema = new Schema(
  {
    invoiceType: String,
    invoiceDate: Date,
    sellerNTNCNIC: String,
    sellerBusinessName: String,
    sellerProvince: String,
    sellerAddress: String,
    buyerNTNCNIC: String,
    buyerBusinessName: String,
    buyerProvince: String,
    buyerAddress: String,
    buyerRegistrationType: String,
    invoiceRefNo: String,
    scenarioId: String,
    items: [ItemSchema],
  },
  { _id: false }
);

// Main Invoice Schema
const InvoiceSchema = new Schema(
  {
    request_body: RequestBodySchema,
    response_body: ResponseBodySchema,
  },
  { timestamps: true }
);

export default model("Invoice", InvoiceSchema);
