import User from "../models/user"

const getCurrentUser = async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId)
    if (!currentUser) return res.status(404).json({ message: "User not found" })
    res.json(currentUser)
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" })
  }
}

const createCurrentUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({ auth0Id: req.body.auth0Id })
    if (existingUser) return res.status(200).send()

    const newUser = new User(req.body)
    await newUser.save()

    res.status(201).json(newUser.toObject())
  } catch (error) {
    res.status(500).json({ message: "Error creating user" })
  }
}

const updateCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) return res.status(404).json({ message: "User not found" })

    Object.assign(user, req.body)

    await user.save()
    res.send(user)
  } catch (error) {
    res.status(500).json({ message: "Error updating user" })
  }
}

export default {
  getCurrentUser,
  createCurrentUser,
  updateCurrentUser
}