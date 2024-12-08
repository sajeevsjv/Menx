const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const accessControl = require("../utils/access-control").accessControl;

function setaccessControl(access_types){
    return (req,res,next) =>{
        accessControl( access_types, req, res, next);
    }
}

router.post("/signup",userController.signup);
router.get("/getallusers",setaccessControl("1"),userController.getAllUsers);
router.get("/getsingleuser/:id",setaccessControl("1,2,3"),userController.getSingleUser)

module.exports = router;