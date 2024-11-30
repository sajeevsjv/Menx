const mongoose = require('mongoose');

const products = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    category : {
        type : Array,
        required : true
    },
    images : {
        type : Array,
        required : true
    },
    price : {
      type: Number,
      required : true
    },
    offer_price : {
      type: Number,
      required : true
    },
    seller_name : {
      type : String,
      required : true
    },
    description :{
      type : String,
      required : true
    },
    images : {
      type : Array,
      required : true
    }
})

module.exports = mongoose.model("products",products);