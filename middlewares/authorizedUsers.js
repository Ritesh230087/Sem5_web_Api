// const jwt = require("jsonwebtoken");

// const authenticateUser = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "No token provided" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; 
//     next();
//   } catch (err) {
//     console.error("JWT verification error:", err.message);
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };

// module.exports = { authenticateUser };











const jwt = require("jsonwebtoken")
const User = require("../models/UserModels")

exports.authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization 
        if (!authHeader) {
            return res.status(403).json(
                { "success": false, "message": "Token required" }
            )
        }
        const token = authHeader.split(" ")[1]; 
        const decoded = jwt.verify(token, process.env.JWT_SECRET) 
        const userId = decoded._id 
        const user = await User.findOne({ _id: userId })
        if (!user) {
            return res.status(401).json(
                { "success": false, "message": "User not found" }
            )
        }
        req.user = user 
        next() 
    } catch (err) {
        return res.status(500).json(
            { "success": false, "message": "Authentication error" }
        )
    }
}

exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next()
    } else {
        return res.status(403).json(
            { "success": false, "message": "Access denied, not admin" }
        )
    }
}