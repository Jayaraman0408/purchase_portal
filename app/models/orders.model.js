const mongoose = require("mongoose");
const Order = mongoose.model(
  "Order",
  new mongoose.Schema({
    order_no: String,
    customer_id: String,
    customer_name: String,
    customer_phone: Number,
    customer_address: String,
    ordered_products : Array,
    total_amount: Number,
    status: String
  },
  { timestamps: { createdAt: 'created_at', updateAt: 'updated_at' } })
);
module.exports = Order;