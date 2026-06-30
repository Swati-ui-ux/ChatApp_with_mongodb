const jwt = require("jsonwebtoken")
const User = require("../models/user");
const bcrypt = require('bcrypt')
// Register User
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password,10)
    const user = await User.create({
      name,
      email,
      password:hashedPassword,
    });

    res.status(201).json({
      message: "User Registered Successfully",
      user,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Get All Users
const getUsers = async (req, res) => {
  try {

    const users = await User.find();

    res.status(200).json(users);

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
    });

  }
};

const login = async(req,res) => {
   try {
     const { email ,password} = req.body;
     if (!email) return res.status(404).json({ message: "email is require" })
     
     if (!password) return res.status(404).json({ message: "password is require" })
     const user = await User.findOne({ email })
     if(!user)return res.status(404).json({message:"user not found"})
     const isMatch = await bcrypt.compare(password, user.password)
     const token = jwt.sign({userId:user.id,email:user.email},process.env.SECRET_KEY,{expiresIn:'7d'})
     
     return res.status(200).json({message:"User login success",user,token})
     console.log(user)
   } catch (error) {
     console.log("Errorn in login",error.message)
      return res.status(500).json({message:"server error"})
   }
}

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
    _id: {
        $ne: req.user.id
    }
    }).select("-password").sort({ createAt: 1 })
    if (!users) return res.status(404).json({ message: "User not found" })
    res.status(200).json({message:"success",users})
  } catch (error) {
    res.status(500).json({message:"server error"})
    
  }
}
module.exports = {
  register,
  getUsers,
  login,
  getAllUsers,
};