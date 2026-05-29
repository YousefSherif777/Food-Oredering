import { auth } from "express-oauth2-jwt-bearer"
import jwt from "jsonwebtoken"
import User from "../models/user"

export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: "RS256"
})

export const jwtParse = async (req, res, next) => {
  const header = req.headers.authorization
  if (!header || !header.startsWith("Bearer ")) return res.sendStatus(401)

  try {
    const token = header.split(" ")[1]
    const decoded = jwt.decode(token)
    const user = await User.findOne({ auth0Id: decoded.sub })

    if (!user) return res.sendStatus(401)

    req.auth0Id = decoded.sub
    req.userId = user._id.toString()

    next()
  } catch (error) {
    res.sendStatus(401)
  }
}