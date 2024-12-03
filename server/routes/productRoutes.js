const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController")
const accessControl = require("../utils/access-control").accessControl

function setaccessControl(access_types){
    return (req,res,next) =>{
        accessControl( access_types, req, res, next);
    }
}

router.post("/addproduct",setaccessControl("3"),productController.addProduct);
router.get("/getallproducts",setaccessControl("1,3"),productController.getAllProducts);
module.exports = router;