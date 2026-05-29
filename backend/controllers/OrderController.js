import Stripe from "stripe"
import Restaurant from "../models/restaurant"
import Order from "../models/order"

const STRIPE = new Stripe(process.env.STRIPE_API_KEY)
const FRONTEND_URL = process.env.FRONTEND_URL
const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_WEBHOOK_SECRET

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate("restaurant")
      .populate("user")

    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: "something went wrong" })
  }
}

const stripeWebhookHandler = async (req, res) => {
  try {
    const sig = req.headers["stripe-signature"]

    const event = STRIPE.webhooks.constructEvent(
      req.body,
      sig,
      STRIPE_ENDPOINT_SECRET
    )

    if (event.type === "checkout.session.completed") {
      const order = await Order.findById(event.data.object.metadata.orderId)
      if (order) {
        order.totalAmount = event.data.object.amount_total
        order.status = "paid"
        await order.save()
      }
    }

    res.status(200).send()
  } catch (error) {
    res.status(400).send()
  }
}

const createCheckoutSession = async (req, res) => {
  try {
    const { cartItems, deliveryDetails, restaurantId } = req.body

    const restaurant = await Restaurant.findById(restaurantId)
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" })

    const order = new Order({
      restaurant,
      user: req.userId,
      status: "placed",
      deliveryDetails,
      cartItems,
      createdAt: new Date()
    })

    const line_items = cartItems.map((item) => {
      const menuItem = restaurant.menuItems.find(
        (m) => m._id.toString() === item.menuItemId
      )

      if (!menuItem) throw new Error("Menu item not found")

      return {
        price_data: {
          currency: "gbp",
          unit_amount: menuItem.price,
          product_data: { name: menuItem.name }
        },
        quantity: Number(item.quantity)
      }
    })

    const session = await STRIPE.checkout.sessions.create({
      line_items,
      mode: "payment",
      metadata: {
        orderId: order._id.toString(),
        restaurantId: restaurant._id.toString()
      },
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: "Delivery",
            type: "fixed_amount",
            fixed_amount: {
              amount: restaurant.deliveryPrice,
              currency: "gbp"
            }
          }
        }
      ],
      success_url: `${FRONTEND_URL}/order-status?success=true`,
      cancel_url: `${FRONTEND_URL}/detail/${restaurantId}?cancelled=true`
    })

    await order.save()

    res.json({ url: session.url })
  } catch (error) {
    res.status(500).json({ message: "error" })
  }
}

export default {
  getMyOrders,
  createCheckoutSession,
  stripeWebhookHandler
}