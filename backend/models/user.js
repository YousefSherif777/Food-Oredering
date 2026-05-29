import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  auth0Id: String,
  email: String,
  name: String,
  addressLine1: String,
  city: String,
  country: String
})

export default mongoose.model("User", userSchema)