const User = require("../models/User");
const { success, error } = require("../utils/responseWraper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const signupController = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.send(success(403, "All fields are required"));
    }

    if (password !== confirmPassword) {
      return res.send(error(403, "Passwords do not match"));
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const olduser = await User.findOne({ email });
    if (olduser) {
      return res.status(403).json("User is Already Registered");
    }

    const newUser = await User.create({
      email,
      password: hashPassword,
      confirmPassword: hashPassword,
    });

    await newUser.save();
    return res.send(success(201, { newUser }));
  } catch (error) {
    console.log(error);
    // return res.status(500).json("server error");
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.send(success(403, "All fields are required"));
    }
    const olduser = await User.findOne({ email }).select("+password");
    if (!olduser) {
      return res.send(error(403, "User is not registered"));
    }
    const matchedpassord = await bcrypt.compare(password, olduser.password);

    if (!matchedpassord) {
      return res.send(error(401, "Incorrect Password"));
    }

    const accesstoken = generateaccessToken({ _id: olduser._id });
    const refreshtoken = generaterefreshtoken({ _id: olduser._id });

    res.cookie("jwt", refreshtoken, {
      httpOnly: true,
      secure: true,
    });
    return res.send(success(201, { accesstoken }));
  } catch (error) {
    console.log(error);
    // return res.status(500).json("server error");
  }
};

// internal Functions

const generateaccessToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: "30s",
    });
    return token;
  } catch (e) {
    console.log(e);
  }
};

const generaterefreshtoken = (data) => {
  try {
    const token = jwt.sign(data, process.env.REFRESH_TOKEN_KEY, {
      expiresIn: "1y",
    });
    return token;
  } catch (e) {
    console.log(e);
  }
};
module.exports = {
  signupController,
  loginController,
};
