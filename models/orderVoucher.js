const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    noVoucher: {
      type: String,
      required: true,
    },
    voucherId: {
      type: Number,
    },
    userId: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", Schema);
