const User = require('../models/userModel.js');
const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken.js');
const Config = require("../config/config");

//@desc     Auth User & Get Token
//@route    POST api/users/login
//@access   Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    return res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      photo: user.photo,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or Password');
  }
});

//@desc     REGISTER User & Get Token
//@route    POST api/users/register
//@access   Public
exports.register = asyncHandler(async (req, res) => {
  const { fullName, email, password, phoneNumber } = req.body;
  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error('User already Exist');
  }

  const user = await User.create({ fullName, email,phoneNumber, password });
//code verification
client.
verify.services(Config.serviceID)
.verifications
.create({
  to: `${req.body.phoneNumber}`,
  channel:`${req.body.channel}`,
})
.then((data) => {
 res.status(200).send(data);
 }) 
  if (user) {
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      photo: user.photo,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid User Data');
  }
});

//@desc     Get all Users
//@route    GET api/users
//@access   Private/Admin
exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

//@desc     Update User Profile
//@route    PUT api/users/profile/:id
//@access   Private
exports.updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.fullName = req.body.fullName || user.fullName;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    return res.json({
      _id: updatedUser._id,
      fullName: updatedUser.name,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      photo: updatedUser.photo,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not Found');
  }
});
exports.Verif=async(req,res) =>{
  client.
  verify.services(Config.serviceID)
    .verificationChecks
    .create({
    to: `${req.body.phoneNumber}`,
    code:`${req.body.code}`
  })
  .then((data) => {
    if(data.status==="approved"){
      res.status(200).send({
        message: "code verified ",
        data,
      });
    }else{
      res.status(400).send({
        message:"not verified",
        data,
      });
    }
  }); 
};
