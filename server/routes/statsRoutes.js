const router = require("express").Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

function safeNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function formatDate(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
  return date.toISOString().slice(0, 10);
}

async function buildStats() {
  const [orders, products, users] = await Promise.all([
    Order.find().sort({ createdAt: -1 }).lean(),
    Product.find().lean(),
    User.find().lean(),
  ]);

  const completedOrders = orders.filter((order) => order.status === "Completed");
  const paidLikeOrders = orders.filter((order) => order.status !== "Cancelled");
  const totalRevenue = paidLikeOrders.reduce((sum, order) => sum + safeNumber(order.totalPrice), 0);
  const completedRevenue = completedOrders.reduce((sum, order) => sum + safeNumber(order.totalPrice), 0);
  const cancelledRevenue = orders
    .filter((order) => order.status === "Cancelled")
    .reduce((sum, order) => sum + safeNumber(order.totalPrice), 0);

  const byStatus = {
    Pending: 0,
    Processing: 0,
    Shipping: 0,
    Completed: 0,
    Cancelled: 0,
  };

  orders.forEach((order) => {
    const status = order.status || "Pending";
    byStatus[status] = (byStatus[status] || 0) + 1;
  });

  const revenueByDateObj = {};
  const ordersByDateObj = {};
  orders.forEach((order) => {
    const date = formatDate(order.createdAt);
    ordersByDateObj[date] = (ordersByDateObj[date] || 0) + 1;
    if (order.status !== "Cancelled") {
      revenueByDateObj[date] = (revenueByDateObj[date] || 0) + safeNumber(order.totalPrice);
    }
  });

  const ordersByDate = Object.keys(ordersByDateObj)
    .sort()
    .slice(-7)
    .map((date) => ({ date, count: ordersByDateObj[date], revenue: revenueByDateObj[date] || 0 }));

  const productSales = {};
  orders.forEach((order) => {
    if (order.status === "Cancelled") return;
    (order.items || []).forEach((item) => {
      const name = item.name || "Sản phẩm không tên";
      const qty = safeNumber(item.qty || item.quantity || 1);
      const price = safeNumber(item.price);
      if (!productSales[name]) productSales[name] = { name, qty: 0, revenue: 0 };
      productSales[name].qty += qty;
      productSales[name].revenue += price * qty;
    });
  });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.qty - a.qty || b.revenue - a.revenue)
    .slice(0, 5);

  const today = new Date().toISOString().slice(0, 10);
  const todayOrders = orders.filter((order) => formatDate(order.createdAt) === today);
  const todayRevenue = todayOrders
    .filter((order) => order.status !== "Cancelled")
    .reduce((sum, order) => sum + safeNumber(order.totalPrice), 0);

  return {
    totalRevenue,
    completedRevenue,
    cancelledRevenue,
    totalOrders: orders.length,
    todayOrders: todayOrders.length,
    todayRevenue,
    pendingOrders: byStatus.Pending || 0,
    processingOrders: byStatus.Processing || 0,
    shippingOrders: byStatus.Shipping || 0,
    completedOrders: byStatus.Completed || 0,
    cancelledOrders: byStatus.Cancelled || 0,
    totalProducts: products.length,
    totalUsers: users.length,
    averageOrderValue: paidLikeOrders.length ? Math.round(totalRevenue / paidLikeOrders.length) : 0,
    byStatus,
    ordersByDate,
    topProducts,
    latestOrders: orders.slice(0, 8),
  };
}

router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const stats = await buildStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Không tải được thống kê", error: error.message });
  }
});

module.exports = router;
