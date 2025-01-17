const mongoose = require('mongoose');

const Products = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    categories: {
      type: [String],
      required: true,
    },
    mrp: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    isBlocked :{
      type : Boolean,
      default : false
    },
    colors: {
      type: [String],
      required: true,
    },
    seller_name: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    product_images: {
      type: [String],
      required: true,
    },
    stock : { 
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    seller : {
      type : mongoose.Schema.Types.ObjectId,
      ref  : "users"

    },
  },
  { timestamps: true } 
);

module.exports = mongoose.model("Products", Products);
