const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetail,
  createProductReview,
  getAllReviews,
  deleteReview,
  getAdminProducts,
} = require("../controller/productController");
const {isAuthenticatedUser, authorizeRole} = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/admin/products").get(isAuthenticatedUser, authorizeRole("admin"), getAdminProducts);
router.route("/admin/products/new").post(isAuthenticatedUser,authorizeRole("admin"),createProduct);
router.route("/admin/products/:id")
  .put(isAuthenticatedUser,authorizeRole("admin"),updateProduct)
  .delete(isAuthenticatedUser,authorizeRole("admin"),deleteProduct);
router.route("/products/:id").get(getProductDetail);
router.route("/review").put(isAuthenticatedUser,createProductReview);
router.route("/reviews").get(getAllReviews).delete(isAuthenticatedUser,deleteReview);
module.exports = router;
