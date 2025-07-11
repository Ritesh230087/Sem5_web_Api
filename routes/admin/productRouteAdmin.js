const express = require("express");
const router = express.Router();
const productController = require("../../controllers/admin/productmanagement");
const upload = require("../../middlewares/fileupload");

router.post(
  "/create",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "extraImages", maxCount: 10 }
  ]),
  productController.createProduct
);

router.get("/featured", productController.getFeaturedProducts);

router.get("/", productController.getAllProducts);

router.get("/:id", productController.getProductById);

router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "extraImages", maxCount: 10 }
  ]),
  productController.updateProduct
);

router.delete("/:id", productController.deleteProduct);

module.exports = router;
