const products = require("../db/models/products")
const mongoose = require("mongoose");
const {error_function, success_function} = require("../utils/response-handler")

exports.addProduct = async (req,res) => {
    let body = req.body;
    let name = body.name;
    let description = body.description;
    let seller_name = body.seller_name;
    let price = body.price;
    let images = body.images;
    let category = body.category;

    if(!name || !description || !seller_name || !price || !images){
        const response = error_function({
            statusCode : 400,
            message : "all details of the product is required!"
        })
        res.status(response.statusCode).send(response);
        return;
    }

    const data = {
        name, 
        description,
        price,
        seller_name,
        category,
        images
    }

    let addProduct = await products.create(data);
    if(addProduct){
        let response = success_function({
            statusCode : 200,
            message : "product added succesfully"
        })
        res.status(response.statusCode).send(response);
    }
    else{
        let response = error_function({
            statusCode : 400,
            message : "Failed to add product"
        })
        res.status(response.statusCode).send(response);  
    }
        
}