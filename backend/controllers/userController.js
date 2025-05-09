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
    const userr = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    //respond
    res.status(201).json({
      message: "Account created successfully",
      user: userr,
    });
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
    const token = jwt.sign(
      { sub: user._id, exp, isAdmin: user.isAdmin },
      process.env.SECRET
    );

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
      const token = jwt.sign(
        { sub: user._id, isAdmin: user.isAdmin },
        process.env.SECRET
      );
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
      const token = jwt.sign(
        { sub: newUser._id, isAdmin: newUser.isAdmin },
        process.env.SECRET
      );
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
    res.status(200).json({ message: "Logged out" });
  } catch (error) {
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
  const { username, email, profilePicture, password } = req.body;

  if (!username?.trim()) {
    return next(errorHandler(400, "Username is required"));
  }
  if (!email?.trim()) {
    return next(errorHandler(400, "Email is required"));
  }

  if (req.user.id.toString() !== req.params._id.toString()) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }

  if (password && password.length < 6) {
    return next(errorHandler(400, "Password must be at least 6 characters"));
  }

  if (username.length < 5 || username.length > 20) {
    return next(
      errorHandler(400, "Username must be between 5 and 20 characters")
    );
  }

  if (username !== username.toLowerCase()) {
    return next(
      errorHandler(400, "Username must contain only lowercase letters")
    );
  }

  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    return next(
      errorHandler(400, "Username must contain only letters and numbers")
    );
  }

  try {
    const updatedFields = {
      username,
      email,
    };

    if (profilePicture) updatedFields.profilePicture = profilePicture;
    if (password) updatedFields.password = bcrypt.hashSync(password, 10);

    const updatedUser = await User.findByIdAndUpdate(
      req.params._id,
      { $set: updatedFields },
      { new: true }
    );

    const { password: _, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params._id) {
    return next(errorHandler(403, "You are not allowed to delete this user"));
  }
  try {
    const deletedUser = await User.findByIdAndDelete(req.params._id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User has been deleted", user: deletedUser });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to get all users"));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { password, ...rest } = user._doc;
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
  deleteUser,
  getUsers,
  getUser,
};
