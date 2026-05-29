import { body, validationResult } from "express-validator"

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  next()
}

export const validateMyUserRequest = [
  body("name").notEmpty().isString(),
  body("addressLine1").notEmpty().isString(),
  body("city").notEmpty().isString(),
  body("country").notEmpty().isString(),
  handleValidationErrors
]

export const validateMyRestaurantRequest = [
  body("restaurantName").notEmpty(),
  body("city").notEmpty(),
  body("country").notEmpty(),
  body("deliveryPrice").isFloat({ min: 0 }),
  body("estimatedDeliveryTime").isInt({ min: 0 }),
  body("cuisines").isArray().notEmpty(),
  body("menuItems").isArray(),
  body("menuItems.*.name").notEmpty(),
  body("menuItems.*.price").isFloat({ min: 0 }),
  handleValidationErrors
]