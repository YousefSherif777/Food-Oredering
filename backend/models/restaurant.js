import mongoose from "mongoose"

const menuItemSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId()
  },
  name: String,
  price: Number
})

const restaurantSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  restaurantName: String,
  city: String,
  country: String,
  deliveryPrice: Number,
  estimatedDeliveryTime: Number,
  cuisines: [String],
  menuItems: [menuItemSchema],
  imageUrl: String,
  lastUpdated: Date
})

export default mongoose.model("Restaurant", restaurantSchema)