const express = require("express");
const router = express.Router();
const {
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductWithPharmacies,
  checkProductAvailability

} = require("../controllers/product.Controller");

// Put specific routes before parameterized routes to avoid conflicts
router.get('/search', searchProducts);
router.get('/featured', searchProducts); // Use searchProducts with featured filter
router.get('/:id', getProductById);

// -------------------------- -------------------------------//
router.get("/:id/with-pharmacies", getProductWithPharmacies);
router.get("/:id/availability", checkProductAvailability);

//-------------------------- Admin ---------------------------//
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
