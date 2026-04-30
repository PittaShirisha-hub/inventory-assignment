const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Import models
const Supplier = require("./models/Supplier");
const Inventory = require("./models/Inventory");

// ✅ Connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/inventoryDB")
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

    // Check supplier exists
    const supplier = await Supplier.findById(supplier_id);
    if (!supplier) {
      return res.status(400).json({ error: "Supplier not found" });
    }

    // Validation
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
// ➤ Inventory Summary (Grouped by Supplier)
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


// ✅ Start Server
app.listen(3000, () => console.log("Server running on port 3000"));