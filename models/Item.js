import { Schema, model } from "mongoose";

const ItemWarehouseInfoSchema = new Schema(
  {
    MinimalStock: Number,
    MaximalStock: Number,
    WarehouseCode: String,
    InStock: Number,
    Committed: Number,
    Ordered: Number,
    ItemCode: String,
  },
  { _id: false } // No separate _id for subdocs
);

const ItemSchema = new Schema(
  {
    ItemCode: { type: String, required: true },
    ItemName: { type: String, required: true },
    SalesUnit: String,
    PurchaseUnit: String,
    InventoryUOM: String,

    // Warehouse info array
    ItemWarehouseInfoCollection: [ItemWarehouseInfoSchema],
  },
  { timestamps: true }
);

export default model("Item", ItemSchema);
