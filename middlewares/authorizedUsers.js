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
        const decoded = jwt.verify(token, process.env.SECRET) 
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

// exports.isAdmin = (req, res, next) => {
//     if (req.user && req.user.role === 'admin') {
//         next()
//     } else {
//         return res.status(403).json(
//             { "success": false, "message": "Access denied, not admin" }
//         )
//     }
// }
