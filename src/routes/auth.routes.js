const express = require("express")
const userModel = require("../model/user.model")
const jwt = require("jsonwebtoken")
const router = express.Router()

// REGISTER
router.post("/register", async (req, res) => {  
    const { username, password } = req.body 

    const user = await userModel.create({ username, password })

    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    })

    res.status(201).json({
        message: "User registered successfully",
        user
    })
})

// LOGIN
router.post("/login", async (req, res) => {  
    const { username, password } = req.body 

    const isUserExists = await userModel.findOne({ username })
    if (!isUserExists) {
        return res.status(401).json({
            message: "User account not found [Invalid Username]"
        })
    }

    if (isUserExists.password !== password) {
        return res.status(401).json({ message: "Invalid Password" })
    }

    const token = jwt.sign(
        { id: isUserExists._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    })

    res.status(200).json({
        message: "User Login Successfully"
    })
})

// GET USER
router.get("/user", async (req, res) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            message: "unauthorized access, token missing"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel
            .findOne({ _id: decoded.id })
            .select("-password -__v")

        res.status(200).json({
            message: "User fetched successfully",
            user
        })
    } catch {
        res.status(401).json({ message: "unauthorized access" })
    }
})

module.exports = router
