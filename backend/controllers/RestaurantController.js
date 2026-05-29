import Restaurant from "../models/restaurant"

const getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId)
    if (!restaurant) return res.status(404).json({ message: "restaurant not found" })
    res.json(restaurant)
  } catch (error) {
    res.status(500).json({ message: "something went wrong" })
  }
}

const searchRestaurant = async (req, res) => {
  try {
    const city = req.params.city
    const searchQuery = req.query.searchQuery || ""
    const selectedCuisines = req.query.selectedCuisines || ""
    const sortOption = req.query.sortOption || "lastUpdated"
    const page = Number(req.query.page) || 1

    const query = { city: new RegExp(city, "i") }

    const cityCheck = await Restaurant.countDocuments(query)
    if (!cityCheck) {
      return res.json({
        data: [],
        pagination: { total: 0, page: 1, pages: 1 }
      })
    }

    if (selectedCuisines) {
      const cuisines = selectedCuisines.split(",").map((c) => new RegExp(c, "i"))
      query.cuisines = { $all: cuisines }
    }

    if (searchQuery) {
      const r = new RegExp(searchQuery, "i")
      query.$or = [
        { restaurantName: r },
        { cuisines: { $in: [r] } }
      ]
    }

    const limit = 10
    const skip = (page - 1) * limit

    const restaurants = await Restaurant.find(query)
      .sort({ [sortOption]: 1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const total = await Restaurant.countDocuments(query)

    res.json({
      data: restaurants,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" })
  }
}

export default {
  getRestaurant,
  searchRestaurant
}