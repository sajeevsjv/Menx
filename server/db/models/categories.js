const mongoose = require('mongoose');
const categories = mongoose.Schema({
    category : {
        type : String,
        required : true
    }

})
module.exports = mongoose.model("categories",categories);