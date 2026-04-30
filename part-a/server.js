const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

const data = require("./data.json");

app.get("/search", (req, res) => {
  let { q, category, minPrice, maxPrice } = req.query;
  let results = data;

  if (q) {
    results = results.filter(item =>
      item.name.toLowerCase().includes(q.toLowerCase())
    );
  }

  if (category) {
    results = results.filter(item =>
      item.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (minPrice) {
    results = results.filter(item => item.price >= Number(minPrice));
  }

  if (maxPrice) {
    results = results.filter(item => item.price <= Number(maxPrice));
  }

  res.json(results);
});

app.listen(3000, () => console.log("Server running"));