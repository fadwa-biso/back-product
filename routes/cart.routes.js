const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const cartController = require("../controllers/cart.Controller");
console.log("cartController:", cartController);

// Cart routes (temporarily without auth for testing)
router.post("/", auth, cartController.addToCart);
router.post("/add", auth, cartController.addToCart); // إضافة endpoint إضافي
router.get("/", auth, cartController.getCart);
router.put("/:productId", auth, cartController.updateCartItem);
router.delete("/:productId", auth, cartController.removeFromCart);
router.delete("/", auth, cartController.clearCart);
// Checkout and create order (with payment logic)
router.post("/checkout", auth, cartController.checkout);

// Added by Safwat: Routes for pharmacy selection and payment methods
router.post("/set-pharmacy", auth, cartController.setPharmacyInCart);
router.get("/payment-methods", auth, cartController.getAvailablePaymentMethods);

module.exports = router;
