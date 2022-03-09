const mongoose = require("mongoose");
const Product = mongoose.model(
  "Product",
  new mongoose.Schema({
    product_ean: String,
    product_name: String,
    qty: Number,
    cost_perunit: Number,
    selling_price: Number,
    mrp : Number,
    total_cost: Number
  },
  { timestamps: { createdAt: 'created_at', updateAt: 'updated_at' } })
);
module.exports = Product;