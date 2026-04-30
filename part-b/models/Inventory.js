const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema({
  supplier_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true
  },
  product_name: { type: String, required: true },
  quantity: { type: Number, min: 0, required: true },
  price: { type: Number, min: 1, required: true }
});

module.exports = mongoose.model("Inventory", InventorySchema);