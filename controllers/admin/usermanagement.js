const User = require("../../models/UserModels")
const bcrypt = require("bcrypt")

exports.createUser = async (req, res) => {
    const { userId, email, firstName, lastName, password } = req.body
    // validation
    if (!firstName ||!lastName || !email || !password) {
        return res.status(400).json(
            {
                "success": false,
                "message": "Missing fields"
            }
        )
    }
    // db logic in try/catch
    try {
        const existingUser = await User.findOne(
            {
                $or: [{ "email": email }]
            }
        )
        if (existingUser) {
            return res.status(400).json(
                {
                    "success": false,
                    "message": "User exists"
                }
            )
        }
        const hasedPas = await bcrypt.hash(
            password, 10
        )
        const newUser = new User({
            email,
            firstName,
            lastName,
            password: hasedPas
        })
        await newUser.save()
        return res.status(201).json(
            {
                "success": true,
                "message": "User Registered"
            }
        )
    } catch (err) {
        return res.status(500).json(
            { "success": false, "message": "Server error" }
        )
    }
}

