const mongoose = require('mongoose');

const products = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    categories : {
        type : Array,
        required : true
    },
    mrp :{
      type : Number,
      required : true
    },
    price : {
      type: Number,
      required : true
    },
    colors: {
      type : Array,
      required : true
    },
    seller_name : {
      type : String,
    },
    description :{
      type : String,
      required : true
    },
    product_images : {
      type : Array,
      required : true
    },
    product_count :{
      type : Number,
      required : true
    }
})

module.exports = mongoose.model("products",products);