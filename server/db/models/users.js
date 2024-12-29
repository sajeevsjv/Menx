const mongoose = require("mongoose");

const users = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    user_type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user_types"
    },
    address : [{
        type : Object,
     }],
    cart: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Products", 
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }
    ],
    wishlist: [
        {
           product : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Products"
           } 
        }
    ]
    
})

module.exports = mongoose.model("users", users);