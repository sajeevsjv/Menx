const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController")
const accessControl = require("../utils/access-control").accessControl

function setaccessControl(access_types){
    return (req,res,next) =>{
        accessControl( access_types, req, res, next);
    }
}

router.get("/categories",setaccessControl("1,2,3"),productController.loadCategories)
router.post("/addproduct",setaccessControl("3"),productController.addProduct);
router.get("/getallproducts",setaccessControl("1,2,3"),productController.getAllProducts);
router.get("/getsingleproduct/:id",setaccessControl("1,2,3"),productController.getSingleProduct);
router.post("/addtocart",setaccessControl("2,3"),productController.addToCart);
router.delete("/deletefromcart/:id",setaccessControl("2,3"),productController.deleteFromCart);
router.post("/placeorder/:id",setaccessControl("2,3"),productController.placeOrder);
module.exports = router;