import { Schema, model } from "mongoose";

const SalesEmployeeSchema = new Schema(
  {
    SalesEmployeeCode: { type: Number, required: true },
    SalesEmployeeName: { type: String, required: true },
    Remarks: String,
    CommissionForSalesEmployee: Number,
    CommissionGroup: Number,
    Locked: String,
    EmployeeID: String,
    Active: String,
    Telephone: String,
    Mobile: String,
    Fax: String,
    Email: String
  },
  { timestamps: true }
);

export default model("SalesEmployee", SalesEmployeeSchema);
