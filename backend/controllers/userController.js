const express = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

async function google (req, res, next) {
  const {email, name, googlePhotoUrl} = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ sub: user._id }, process.env.SECRET);
      const {password, ...rest} = user._doc;
      res.status(200).cookie("Authorization", token, {
        httpOnly: true,
      }).json(rest);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 8);
      const newUser = new User({
        username: name.toLowerCase().split(" ").join("") + Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign({ sub: newUser._id }, process.env.SECRET);
      const {password, ...rest} = newUser._doc;
      res.status(200).cookie("Authorization", token, {
        httpOnly: true,
      }).json(rest);
    }
}
catch (error) {
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

module.exports = {
  signup,
  login,
  google,
  logout,
  checkAuth,
};
