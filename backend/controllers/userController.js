const express = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { errorHandler } = require("../utils/error");
async function signup(req, res) {
  try {
    //get data from request body
    const { username, email, password } = req.body;

    //hash password
    const hashedPassword = bcrypt.hashSync(password, 8);

    //create user with data
    await User.create({ username, email, password: hashedPassword });

    //respond
    res.json({ message: "OK" });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
}

async function login(req, res) {
  try {
    //get the email and password
    const { email, password } = req.body;

    //find user with requested email
    const user = await User.findOne({ email });
    if (!user) return res.sendStatus(401);

    //compare the hashed password with the entered password
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) return res.sendStatus(401);

    //create jwt token
    const exp = Date.now() + 1000 * 60 * 60 * 24 * 30;
    const token = jwt.sign({ sub: user._id, exp }, process.env.SECRET);

    //set cookie
    res.cookie("Authorization", token, {
      expires: new Date(exp),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    //send it
    res.json(user);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
}

async function google(req, res, next) {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ sub: user._id }, process.env.SECRET);
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("Authorization", token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 8);
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign({ sub: newUser._id }, process.env.SECRET);
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("Authorization", token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
}

function logout(req, res) {
  try {
    res.clearCookie("Authorization");
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
}

function checkAuth(req, res) {
  try {
    res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(400);
  }
}
const updateUser = async (req, res, next) => {
  if (
    req.body.username == undefined ||
    req.body.username == null ||
    req.body.username == ""
  ) {
    return next(errorHandler(400, "Username is required"));
  } else if (
    req.body.email == undefined ||
    req.body.email == null ||
    req.body.email == ""
  ) {
    return next(errorHandler(400, "Email is required"));
  }

  if (req.user.id !== req.params._id) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, "Password must be at least 6 characters"));
    }
    req.body.password = bcrypt.hashSync(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username.length < 5 || req.body.username.length > 20) {
      return next(
        errorHandler(400, "Username must be between 5 and 20 characters")
      );
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(
        errorHandler(400, "Username must contain only lowercase letters")
      );
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "Username must contain only letters and numbers")
      );
    }
    console.log("User ID from token:", req.user?._id);
  }
  try {
    console.log("User ID from token:", req.user?._id);
    console.log(req.body);

    const updateUser = await User.findByIdAndUpdate(
      req.params._id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updateUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  google,
  logout,
  checkAuth,
  updateUser,
};
