const mongoose = require('mongoose');

const products = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    category : {
        type : String,
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
    }
})

module.exports = mongoose.model("products",products);