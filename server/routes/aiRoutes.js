const express = require("express");

const router = express.Router();
const protect = require("../middleware/authMiddleware");
const aiController = require("../controllers/aiController");

router.post("/generate-email", protect, aiController.generateEmail);
router.get("/history", protect, aiController.getHistory);
router.get("/stats", protect, aiController.getStats);

module.exports = router;
