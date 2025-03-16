const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { createRazorpayOrder, verifyRazorpayPayment } = require("../middleware/payment");


router.post("/create-order", createRazorpayOrder);
router.post("/register", verifyRazorpayPayment, userController.register);

// Route for scanning QR/barcode
router.post("/scan", userController.scan);

module.exports = router;
