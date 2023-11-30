const User = require("../models/User");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const authGuard = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // Check if header has a token
  if (!token)
    return res.status(401).json({ errors: ["Acesso negado!"] });

  // Check if token is valid
  try {
    const verified = jwt.verify(token, jwtSecret);

    // Set token expiration to 24 hours (1 days)
    const expiresIn = 24 * 60 * 60; // 24 hours in seconds

    const user = await User.findById(verified.id).select("-password");

    // Generate new token with updated expiration time
    const newToken = jwt.sign({ id: user.id }, jwtSecret, { expiresIn });

    // Send new token in response
    res.setHeader("Authorization", `Bearer ${newToken}`);

    req.user = user;
    next();
  } catch (err) {
    res.status(400).json({ errors: ["O Token é inválido!"] });
  }
};

module.exports = authGuard;