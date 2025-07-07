const User = require("../../models/UserModels");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid"); 

exports.createUser = async (req, res) => {
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

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json({
            success: true,
            message: "All users",
            data: users,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

exports.getOneUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findOne({ _id: id });
        return res.status(200).json({
            success: true,
            message: "One user fetched",
            data: user,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

exports.updateOne = async (req, res) => {
    const { firstName, lastName } = req.body;
    const _id = req.params.id;

    try {
        await User.updateOne(
            { _id },
            {
                $set: {
                    firstName,
                    lastName,
                },
            }
        );
        return res.status(200).json({
            success: true,
            message: "User updated",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

exports.deleteOne = async (req, res) => {
    const _id = req.params.id;
    try {
        await User.deleteOne({ _id });
        return res.status(200).json({
            success: true,
            message: "User Deleted",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
