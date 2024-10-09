const jwt = require("jsonwebtoken");

const verifyJWT = async (req, res, next) => {

  const authHeader = req.headers["authorization"];
  
  if (!authHeader) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ msg: "Token not provided, authorization denied" });
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = verifyJWT;
