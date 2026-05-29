import express from "express"
import { param } from "express-validator"
import RestaurantController from "../controllers/RestaurantController"

const router = express.Router()

router.get(
  "/:restaurantId",
  param("restaurantId").notEmpty(),
  RestaurantController.getRestaurant
)

router.get(
  "/search/:city",
  param("city").notEmpty(),
  RestaurantController.searchRestaurant
)

export default router