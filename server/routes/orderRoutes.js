const router = require("express").Router();

const Order = require("../models/Order");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

/* CREATE ORDER - logged in user */
router.post("/", verifyToken, async (req, res) => {
  const { customerName, phone, address, items, totalPrice } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ message: "Giỏ hàng trống" });
  }

  if (!customerName || !phone || !address) {
    return res.status(400).json({ message: "Vui lòng nhập đủ thông tin nhận hàng" });
  }

  const newOrder = await Order.create({
    user: req.user.id,
    customerName,
    phone,
    address,
    items,
    totalPrice,
    status: "Pending",
  });

  res.status(201).json(newOrder);
});

/* GET MY ORDERS - user */
router.get("/my", verifyToken, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
});

/* GET ALL ORDERS - Admin */
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

/* UPDATE STATUS - Admin */
router.put("/:id", verifyToken, verifyAdmin, async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
});

module.exports = router;
