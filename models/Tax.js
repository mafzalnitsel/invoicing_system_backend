import { Schema, model } from "mongoose";

const VatGroupsLineSchema = new Schema(
  {
    Effectivefrom: Date,
    Rate: Number,
    EqualizationTax: Number,
    DatevCode: String,
  },
  { _id: false }
);

const TaxSchema = new Schema(
  {
    Code: { type: String, required: true },
    Name: { type: String, required: true },
    Category: String,
    TaxAccount: String,
    EU: String,
    TriangularDeal: String,
    AcquisitionReverse: String,
    NonDeduct: Number,
    AcquisitionTax: String,
    GoodsShipment: String,
    NonDeductAcc: String,
    DeferredTaxAcc: String,
    Correction: String,
    VatCorrection: String,
    EqualizationTaxAccount: String,
    ServiceSupply: String,
    Inactive: String,
    TaxTypeBlackList: String,
    Report349Code: String,
    VATInRevenueAccount: String,
    DownPaymentTaxOffsetAccount: String,
    CashDiscountAccount: String,
    VATDeductibleAccount: String,
    TaxRegion: String,
    AcquisitionReverseCorrespondingTaxCode: String,
    EBooksVatCategory: String,

    VatGroups_Lines: [VatGroupsLineSchema],
  },
  { timestamps: true }
);

export default model("Tax", TaxSchema);
