import { Schema, model } from "mongoose";

const CostCentreSchema = new Schema(
  {
    CenterCode: { type: String, required: true }, // e.g., "99"
    CenterName: { type: String, required: true }, // e.g., "Others"
    GroupCode: String, // e.g., "99"
    InWhichDimension: Number, // e.g., 1
    CostCenterType: String, // nullable in SAP
    EffectiveFrom: Date, // e.g., "2016-01-01T00:00:00Z"
    EffectiveTo: Date, // nullable in SAP
    Active: String, // "tYES" or "tNO"
    CenterOwner: String, // nullable in SAP
  },
  { timestamps: true }
);

export default model("CostCentre", CostCentreSchema);
