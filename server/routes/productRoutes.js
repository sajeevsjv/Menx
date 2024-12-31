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
router.get("/getallproducts/:id",productController.getAllProducts);
router.get("/getsingleproduct/:id",productController.getSingleProduct);
router.post("/addtocart",setaccessControl("2,3"),productController.addToCart);
router.put("/updatecart",setaccessControl("2,3"),productController.updateCart);
router.post("/addtowishlist",setaccessControl("2,3"),productController.addToWishlist);
router.delete("/deletefromcart/:id",setaccessControl("2,3"),productController.deleteFromCart);
router.delete("/removefromwishlist/:id",setaccessControl("2,3"),productController.removeFromWishlist);
router.post("/placeorder/:id",setaccessControl("2,3"),productController.placeOrder);
router.get("/sellerproducts/:id",setaccessControl("3"),productController.sellerProducts);
router.get("/lowstockproducts/:id",setaccessControl("3"),productController.lowStockProducts);
router.get("/myorders/:id",setaccessControl("2,3"),productController.viewOrders);
router.get("/newproducts/:id",productController.getNewInProducts);
module.exports = router;