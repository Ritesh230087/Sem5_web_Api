const mongoose = require("mongoose");

const RibbonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    color: {
      type: String, 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ribbon", RibbonSchema);
