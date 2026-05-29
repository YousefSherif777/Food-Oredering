import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  deliveryDetails: {
    email: String,
    name: String,
    addressLine1: String,
    city: String
  },
  cartItems: [
    {
      menuItemId: String,
      quantity: Number,
      name: String
    }
  ],
  totalAmount: Number,
  status: {
    type: String,
    enum: ["placed", "paid", "inProgress", "outForDelivery", "delivered"]
  },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model("Order", orderSchema)