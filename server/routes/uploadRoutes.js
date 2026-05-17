const router = require("express").Router();
const path = require("path");
const multer = require("multer");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "-")),
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) return cb(new Error("Chỉ cho phép upload ảnh"));
    cb(null, true);
  },
});

router.post("/image", verifyToken, verifyAdmin, upload.single("image"), (req, res) => {
  res.json({ url: `/uploads/${req.file.filename}` });
});

module.exports = router;
