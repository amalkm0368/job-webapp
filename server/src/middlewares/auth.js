import jwt from "jsonwebtoken"

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]

  try {
    if (!token) return res.status(401).json({ msg: "No token, access denied" })
    const decode = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decode
    next()
  } catch (error) {
    return res.status(401).json({ msg: "Token invalid" })
  }
}

export const isCompany = async (req, res, next) => {
  if (req.user.role !== "company")
    return res.status(403).json({ msg: "Access denied: company only" })
  next()
}
export const isUser = async (req, res, next) => {
  if (req.user.role  !== "user")
    return res.status(403).json({ msg: "Access denied: user only" })
  next()
}
