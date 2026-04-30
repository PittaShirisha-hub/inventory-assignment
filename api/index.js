const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ================== MIDDLEWARE ==================
app.use(express.json());
app.use(cors());

// ================== ROOT ROUTE ==================
app.get("/", (req, res) => {
  res.send("Inventory API is running 🚀");
});

// ================== DATABASE ==================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ DB Error:", err));

// ================== MODELS ==================

// Supplier Schema
const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
});

const Supplier = mongoose.model("Supplier", supplierSchema);

// Inventory Schema
const inventorySchema = new mongoose.Schema({
  supplier_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

const Inventory = mongoose.model("Inventory", inventorySchema);

// ================== API 1 ==================
// ➤ Add Supplier
app.post("/supplier", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and Email required" });
    }

    const supplier = new Supplier({ name, email });
    await supplier.save();

    res.status(201).json(supplier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================== API 2 ==================
// ➤ Add Inventory
app.post("/inventory", async (req, res) => {
  try {
    const { supplier_id, quantity, price } = req.body;

    // Validation
    if (!supplier_id || quantity == null || price == null) {
      return res.status(400).json({ error: "All fields required" });
    }

    if (quantity < 0 || price <= 0) {
      return res.status(400).json({ error: "Invalid values" });
    }

    const supplier = await Supplier.findById(supplier_id);
    if (!supplier) {
      return res.status(400).json({ error: "Supplier not found" });
    }

    const item = new Inventory({ supplier_id, quantity, price });
    await item.save();

    res.status(201).json(item);
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
      {
        $sort: { totalValue: -1 }
      }
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================== EXPORT ==================
module.exports = app;