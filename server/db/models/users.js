const mongoose = require("mongoose");

const users = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
       type : String
    },
    user_type : {
        type : String
    }
})

module.exports = mongoose.model("users",users);