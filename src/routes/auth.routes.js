const express = require("express")
const userModel = require("../model/user.model")
const jwt = require("jsonwebtoken")
const router = express.Router()

// common cookie options
const cookieOptions = {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
}

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required"
            })
        }

        const user = await userModel.create({ username, password })

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.cookie("token", token, cookieOptions)

        res.status(201).json({
            message: "User registered successfully",
            user
        })
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
})


// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required"
            })
        }

        const user = await userModel.findOne({ username })
        if (!user) {
            return res.status(401).json({
                message: "User account not found"
            })
        }

        if (user.password !== password) {
            return res.status(401).json({
                message: "Invalid password"
            })
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.cookie("token", token, cookieOptions)

        res.status(200).json({
            message: "User login successfully"
        })
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
})


// GET USER
router.get("/user", async (req, res) => {
    try {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized access, token missing"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel
            .findOne({ _id: decoded.id })
            .select("-password -__v")

        res.status(200).json({
            message: "User fetched successfully",
            user
        })
    } catch (error) {
        res.status(401).json({
            message: "Unauthorized access"
        })
    }
})


// LOGOUT  ✅ (YAHAN ADD KIYA)
router.post("/logout", (req, res) => {
    res.clearCookie("token")

    res.status(200).json({
        message: "User logged out successfully"
    })
})

module.exports = router
