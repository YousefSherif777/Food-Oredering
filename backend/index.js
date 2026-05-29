import express from "express"
import cors from "cors"
import "dotenv/config"
import mongoose from "mongoose"
import { v2 as cloudinary } from "cloudinary"

import myUserRoute from "./routes/MyUserRoute"
import myRestaurantRoute from "./routes/MyRestaurantRoute"
import restaurantRoute from "./routes/RestaurantRoute"
import orderRoute from "./routes/OrderRoute"

mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => console.log("Connected to database"))

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const app = express()

app.use(cors())

app.use("/api/order/checkout/webhook", express.raw({ type: "*/*" }))
app.use(express.json())

app.get("/health", (req, res) => {
  res.json({ message: "ok" })
})

app.use("/api/my/user", myUserRoute)
app.use("/api/my/restaurant", myRestaurantRoute)
app.use("/api/restaurant", restaurantRoute)
app.use("/api/order", orderRoute)

app.listen(7000, () => {
  console.log("server started on localhost:7000")
})