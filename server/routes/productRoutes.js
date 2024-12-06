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
router.get("/getallproducts",setaccessControl("1,2,3"),productController.getAllProducts);
router.get("/getsingleproduct/:id",setaccessControl("1,2,3"),productController.getSingleProduct);
module.exports = router;