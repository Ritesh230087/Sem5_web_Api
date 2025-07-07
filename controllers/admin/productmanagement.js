const Product = require("../../models/ProductModel");

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      quantity,
      categoryId,
      ribbonId
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required"
      });
    }

    const filepath = req.file.path;
    const youSave = originalPrice - price;
    const discountPercent = Math.round((youSave / originalPrice) * 100);

    const product = new Product({
      name,
      description,
      price,
      originalPrice,
      discountPercent,
      youSave,
      quantity,
      filepath,
      categoryId,
      ribbonId: ribbonId || null
    });

    await product.save();

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product
    });

  } catch (err) {
    console.error("Product create error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
