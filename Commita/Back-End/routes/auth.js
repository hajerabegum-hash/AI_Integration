import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import express from "express";
import User from "../models/User.js";

const router = express.Router();
const secret = process.env.JWT_SECRET || "dev-secret";

router.post("/signup", async (req, res) => {
  try {
    const { email, username, password } = req.body || {};
    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();
    const normalizedUsername = String(username || "").trim();
    const normalizedPassword = String(password || "").trim();

    if (!normalizedEmail || !normalizedUsername || !normalizedPassword) {
      return res
        .status(400)
        .json({ msg: "Email, username, and password are required" });
    }

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    });

    if (existingUser) {
      return res.status(409).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(normalizedPassword, 10);
    const user = await User.create({
      email: normalizedEmail,
      username: normalizedUsername,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username },
      secret,
      { expiresIn: "7d" },
    );

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("signup error:", error);
    return res.status(500).json({ msg: "Failed to create account" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();
    const normalizedPassword = String(password || "").trim();

    if (!normalizedEmail || !normalizedPassword) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(
      normalizedPassword,
      user.password,
    );

    if (!isValidPassword) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username },
      secret,
      { expiresIn: "7d" },
    );

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("signin error:", error);
    return res.status(500).json({ msg: "Failed to sign in" });
  }
});

export default router;
