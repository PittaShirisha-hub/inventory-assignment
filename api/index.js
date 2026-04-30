const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// ✅ Root route (fixes "Cannot GET /")
app.get("/", (req, res) => {
  res.send("Inventory API is running 🚀");
});

// ================== MODELS ==================

// Supplier Schema
const supplierSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const Supplier = mongoose.model("Supplier", supplierSchema);

// Inventory Schema
const inventorySchema = new mongoose.Schema({
  supplier_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
  },
  quantity: Number,
  price: Number,
});

const Inventory = mongoose.model("Inventory", inventorySchema);

// ================== DB CONNECT ==================

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

// ================== API 1 ==================
// ➤ Add Supplier
app.post("/supplier", async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    await supplier.save();
    res.json(supplier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================== API 2 ==================
// ➤ Add Inventory
app.post("/inventory", async (req, res) => {
  try {
    const { supplier_id, quantity, price } = req.body;

    const supplier = await Supplier.findById(supplier_id);
    if (!supplier) {
      return res.status(400).json({ error: "Supplier not found" });
    }

    if (quantity < 0 || price <= 0) {
      return res.status(400).json({ error: "Invalid values" });
    }

    const item = new Inventory(req.body);
    await item.save();

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================== API 3 ==================
// ➤ Get all inventory
app.get("/inventory", async (req, res) => {
  try {
    const data = await Inventory.find().populate("supplier_id");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================== API 4 ==================
// ➤ Inventory Summary
app.get("/inventory-summary", async (req, res) => {
  try {
    const result = await Inventory.aggregate([
      {
        $group: {
          _id: "$supplier_id",
          totalValue: {
            $sum: { $multiply: ["$quantity", "$price"] }
          }
        }
      },
      { $sort: { totalValue: -1 } }
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Export for Vercel (IMPORTANT)
module.exports = app;