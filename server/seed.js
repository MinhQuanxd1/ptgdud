const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");
const bcrypt = require("bcryptjs");

function readJson(fileName) {
  const filePath = path.join(__dirname, "seed", fileName);
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf-8").trim();
  if (!raw) return [];
  return JSON.parse(raw);
}

function normalizeMongoExport(value) {
  if (Array.isArray(value)) {
    return value.map(normalizeMongoExport);
  }

  if (value && typeof value === "object") {
    if (Object.keys(value).length === 1 && value.$oid) {
      return new mongoose.Types.ObjectId(value.$oid);
    }

    if (Object.keys(value).length === 1 && value.$date) {
      return new Date(value.$date);
    }

    const normalized = {};
    for (const [key, childValue] of Object.entries(value)) {
      normalized[key] = normalizeMongoExport(childValue);
    }
    return normalized;
  }

  return value;
}

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shopdb";
    await mongoose.connect(mongoUri);

    const users = normalizeMongoExport(readJson("users.json"));
    const products = normalizeMongoExport(readJson("products.json"));
    const orders = normalizeMongoExport(readJson("orders.json"));

    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({})
    ]);

    if (users.length) await User.insertMany(users);
    if (products.length) await Product.insertMany(products);
    if (orders.length) await Order.insertMany(orders);

    const demoPassword = await bcrypt.hash("123456", 10);
    await User.updateOne(
      { email: "admin@test.com" },
      { name: "Admin Demo", email: "admin@test.com", password: demoPassword, isAdmin: true },
      { upsert: true }
    );
    await User.updateOne(
      { email: "user@test.com" },
      { name: "User Demo", email: "user@test.com", password: demoPassword, isAdmin: false },
      { upsert: true }
    );

    console.log("Seed thành công!");
    console.log(`Users: ${users.length} + 2 demo accounts`);
    console.log(`Products: ${products.length}`);
    console.log(`Orders: ${orders.length}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seed lỗi:", error);
    process.exit(1);
  }
}

seed();
