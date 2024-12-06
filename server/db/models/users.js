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
    cart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products"
        }
    ]

})

module.exports = mongoose.model("users", users);