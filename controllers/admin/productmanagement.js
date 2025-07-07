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

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("categoryId", "name")
      .populate("ribbonId", "name color");
    return res.status(200).json({ success: true, data: products });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("categoryId", "name")
      .populate("ribbonId", "name color");

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, data: product });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.updateProduct = async (req, res) => {
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

    const updateData = {
      name,
      description,
      price,
      originalPrice,
      quantity,
      youSave: originalPrice - price,
      discountPercent: Math.round(((originalPrice - price) / originalPrice) * 100),
      categoryId,
      ribbonId: ribbonId || null
    };

    if (req.file) {
      updateData.filepath = req.file.path;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const result = await Product.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, message: "Product deleted successfully" });

  } catch (err) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
