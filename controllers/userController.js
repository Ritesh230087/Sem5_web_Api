const User = require("../models/UserModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid"); 

// Register user
exports.registerUser = async (req, res) => {
    const { email, firstName, lastName, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Missing fields",
        });
    }

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User exists",
            });
        }

        const hashedPas = await bcrypt.hash(password, 10);

        const newUser = new User({
            userId: uuidv4(),
            email,
            firstName,
            lastName,
            password: hashedPas,
        });

        await newUser.save();

        return res.status(201).json({
            success: true,
            message: "User Registered",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// Login user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Missing field",
        });
    }

    try {
        const getUser = await User.findOne({ email });

        if (!getUser) {
            return res.status(403).json({
                success: false,
                message: "User not found",
            });
        }

        const passwordCheck = await bcrypt.compare(password, getUser.password);

        if (!passwordCheck) {
            return res.status(403).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const payload = {
            _id: getUser._id,
            userId: getUser.userId, 
            email: getUser.email,
            firstName: getUser.firstName,
            lastName: getUser.lastName,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            data: getUser,
            token: token,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
