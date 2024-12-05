const products = require("../db/models/products")
const mongoose = require("mongoose");
const { error_function, success_function } = require("../utils/response-handler");
const fileUpload = require("../utils/file-upload").fileUpload;

exports.addProduct = async (req, res) => {

  let body = req.body;
  console.log("body :", body);
  let name = body.name;
  let description = body.description;
  let seller_name = body.seller_name;
  let price = body.price;
  let product_images = body.product_images;
  let categories = body.categories;


  if (product_images && product_images.length > 0) {
    let regExp = /^data:/;

    // Use a separate array to store uploaded image paths
    let uploadedImagePaths = [];
    try {
      for (let base64 of product_images) {
        if (regExp.test(base64)) {
          // Await the fileUpload for each Base64 string
          let img_path = await fileUpload(base64, "products");
          console.log("img_path:", img_path);

          // Add the uploaded image path to the new array
          uploadedImagePaths.push(img_path);
        } else {
          // Handle invalid Base64 string
          let response = error_function({
            statusCode: 400,
            message: 'Invalid Base64 string',
          });
          res.status(response.statusCode).send(response);
          return;
        }

        // Set body.product_images to the array of uploaded paths
        body.product_images = uploadedImagePaths;

        let addProduct = await products.create(body);
        if (addProduct) {
          let response = success_function({
            statusCode: 200,
            message: "product added succesfully"
          })
          res.status(response.statusCode).send(response);
        }
        else {
          let response = error_function({
            statusCode: 400,
            message: "Failed to add product"
          })
          res.status(response.statusCode).send(response);
        }
      }

    }
    catch (error) {
      let response = error_function({
        statusCode: 400,
        message: error.message ? error.message : error
      })
      res.status(response.statusCode).send(response);
    }

  }
}

exports.getAllProducts = async(req, res) => {
  try{
    let allProducts = await products.find();

    if(products){
      let response = success_function({
        statusCode: 200,
        data : allProducts
      })
      res.status(response.statusCode).send(response);
    }
  }
  catch(error){
    let response = error_function({
      statusCode: 400,
      message: error.message ? error.message : error
    })
    res.status(response.statusCode).send(response);
  }
}

exports.getSingleProduct = async (req,res) =>{
  try{
    let id = body.id;
    let product = 
  }

}