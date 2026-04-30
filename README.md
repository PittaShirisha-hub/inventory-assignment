📦 Inventory Assignment (Part A + Part B)
📌 Overview

This project is developed as part of a Full Stack Developer assignment.
It consists of two parts:

Part A: Inventory Search API + UI
Part B: Inventory Database + Backend APIs
🔷 Part A: Inventory Search API + UI
🚀 Features
Search products by name (partial & case-insensitive)
Filter by category
Filter by price range (min & max)
Combine multiple filters
Show all products if no filters applied
Display “No results found” when no matches
⚙️ API Endpoint
GET /search
Query Parameters
Parameter	Description
q	Product name (partial match)
category	Filter by category
minPrice	Minimum price
maxPrice	Maximum price
🧠 Search Logic
Used .filter() on dataset
Case-insensitive search:
item.name.toLowerCase().includes(q.toLowerCase())
Applied filters conditionally
Returned full dataset if no filters provided
💾 Data Source
Static JSON file (data.json) with 10–15 products
🎨 Frontend
HTML, CSS, JavaScript
Search input box
Category dropdown
Price range inputs
Results displayed in list/table
“No results found” message
⚠️ Edge Cases Handled
Empty query → returns all products
Invalid price range → handled properly
No results → shows message
⚡ Performance Improvement

For large datasets:

Replace in-memory filtering with database queries and indexing.

🔷 Part B: Inventory Database + APIs
🚀 Features
Add suppliers
Add inventory items linked to suppliers
Fetch inventory with supplier details
Group inventory by supplier
Calculate total inventory value
Sort suppliers by total value
🗄️ Database Schema
Suppliers
{
  "_id": "ObjectId",
  "name": "String",
  "city": "String"
}
Inventory
{
  "_id": "ObjectId",
  "supplier_id": "ObjectId (ref: Supplier)",
  "product_name": "String",
  "quantity": "Number",
  "price": "Number"
}
🔗 Relationship
One Supplier → Many Inventory Items
⚙️ APIs
1. Add Supplier

POST /supplier

{
  "name": "ABC Traders",
  "city": "Hyderabad"
}
2. Add Inventory

POST /inventory

{
  "supplier_id": "SUPPLIER_ID",
  "product_name": "Laptop",
  "quantity": 10,
  "price": 50000
}
3. Get Inventory

GET /inventory

Uses .populate() to include supplier details
4. Inventory Summary (Required Query)

GET /inventory-summary

🧠 Query Explanation

Used MongoDB aggregation:

$group → group by supplier
$multiply → quantity × price
$sum → total value
$sort → descending order
✅ Validations
Supplier must exist before adding inventory
Quantity ≥ 0
Price > 0
🧠 Why MongoDB?
Flexible schema
Easy relationship handling using ObjectId
Powerful aggregation support
⚡ Optimization Suggestion

Add index on supplier_id to improve query performance.

🏁 How to Run the Project
▶️ Part A
cd part-a
npm install
node server.js

Open:

http://localhost:4000
▶️ Part B
cd part-b
npm install
node server.js

Test APIs using Postman or Thunder Client:

POST /supplier
POST /inventory
GET /inventory
GET /inventory-summary
📌 Tech Stack
Node.js
Express.js
MongoDB
HTML, CSS, JavaScript
🎯 Conclusion
Part A demonstrates search functionality and UI design
Part B demonstrates backend development, database design, and aggregation# inventory-assignment
