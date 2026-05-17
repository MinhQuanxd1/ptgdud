const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { verifyToken, verifyAdmin } = require("../middleware/auth");
const publicUser = (u) => ({ _id: u._id, name: u.name, email: u.email, isAdmin: u.isAdmin, createdAt: u.createdAt });

router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users.map(publicUser));
});

router.post("/", verifyToken, verifyAdmin, async (req, res) => {
  const hash = await bcrypt.hash(req.body.password || "123456", 10);
  const user = await User.create({ name: req.body.name, email: req.body.email, password: hash, isAdmin: !!req.body.isAdmin });
  res.status(201).json(publicUser(user));
});

router.put("/:id", verifyToken, verifyAdmin, async (req, res) => {
  const data = { name: req.body.name, email: req.body.email, isAdmin: !!req.body.isAdmin };
  if (req.body.password) data.password = await bcrypt.hash(req.body.password, 10);
  const user = await User.findByIdAndUpdate(req.params.id, data, { new: true });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(publicUser(user));
});

router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
