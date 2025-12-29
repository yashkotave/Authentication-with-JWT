const express =     require("express")
const userModel = require("../model/user.model")
const jwt =       require("jsonwebtoken")
const router = express.Router()


router.post("/register", async (req, res) => {  
    const { username, password } = req.body 

    // 1️⃣ Create user first
    const user = await userModel.create({ username, password })

    // 2️⃣ Then generate token
    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.status(201).json({
        message: "User registered successfully",
        user,
        token
    })
})


router.post("/login", async (req, res) => {  
    const {username, password} = req.body 

    const isUserExists = await userModel.findOne({username})
    if(!isUserExists){
        return res.status(401).json({message: "User account not found [Invalid Username]"})
}
    const isPasswordValid = isUserExists.password === password

    if(!isPasswordValid){
        return res.status(401).json({message: "Invalid Password"})
    }

    res.status(200).json({message: "User Login Successfully"})
}       
) 


router.get("/user", async (req, res) => {
    const token = req.body.token

    if(!token){
        return res.status(401).json({message: "unauthorized access, token missing"})
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        res.send(decoded)
    }catch(err){
        res.status(401).json({message: "unauthorized access"})
    }
})
module.exports = router 