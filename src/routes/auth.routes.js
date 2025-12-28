const express =     require("express")
const userModel = require("../model/user.model")

const router = express.Router()


router.post("/register", async (req, res) => {  
    const {username, password} = req.body 

    const user = await userModel.create({username, password})
    res.status(201).json({message: "User registered successfully", user})
}       
)

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

module.exports = router