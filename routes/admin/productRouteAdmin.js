const express = require("express");
const router = express.Router();
const productController = require("../../controllers/admin/productmanagement");
const upload = require("../../middlewares/fileupload");

router.post(
  "/create",
  upload.single("image"),
  productController.createProduct
);

router.get("/", productController.getAllProducts);

router.get("/:id", productController.getProductById);

router.put(
  "/:id",
  upload.single("image"),
  productController.updateProduct
);

router.delete("/:id", productController.deleteProduct);

module.exports = router;
