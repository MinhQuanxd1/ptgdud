const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  customerName: String,
  phone: String,
  address: String,

  items: Array,

  totalPrice: Number,

  status: {
    type: String,
    default: "Pending"
  }
},
{
  timestamps: true
}
);

module.exports = mongoose.model(
  "Order",
  orderSchema
);