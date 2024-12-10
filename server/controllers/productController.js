const products = require("../db/models/products")
const mongoose = require("mongoose");
const { error_function, success_function } = require("../utils/response-handler");
const users = require("../db/models/users");
const categories = require("../db/models/categories");
const fileUpload = require("../utils/file-upload").fileUpload;
const sendEmail = require("../utils/send-email").sendEmail;
const orderPlaced = require("../utils/email-templates/orderPlaced").orderPlaced;



exports.loadCategories = async (req,res) => {
  const allcategories = await categories.find();
  if(categories){
    let response = success_function({
      statusCode: 200,
      data : allcategories
    });
    res.status(response.statusCode).send(response);
    return;
  }
  else{
    let response = error_function({
      statusCode: 400,
      message: 'failed to get categories',
    });
    res.status(response.statusCode).send(response);
    return;
  }
}

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
          return;
        }
        else {
          let response = error_function({
            statusCode: 400,
            message: "Failed to add product"
          })
          res.status(response.statusCode).send(response);
          return;
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
    let _id = req.params.id;
    let product = await products.findOne({_id})
    console.log("product :",product);
    if(product){
      let response = success_function({
        statusCode : 200,
        data : product
      })
      res.status(response.statusCode).send(response);
      return;
    }
  }
  catch(error){
    console.log("error :",error);
    let response = success_function({
      statusCode : 400,
      message : error.message ? error.message : error
    })
    res.status(response.statusCode).send(response);
    return;
  }
  }

exports.addToCart = async (req,res) =>{
  console.log("body :",req.body);
  let product_id  = new mongoose.Types.ObjectId(req.body.product_id);
  let user_id = new mongoose.Types.ObjectId(req.body.user_id);

  try{

    const user = await users.findOne({
      _id: user_id,
      cart: {
          $elemMatch: {
              product: product_id
          }
      }
  });
  

  if(user){
    let response = error_function({
      statusCode : 400,
      message : "Product already in cart"
    })
    res.status(response.statusCode).send(response);
    return;
  }

  let updateUser = await users.updateOne(
    { _id: user_id }, // Filter: Specifies which document to update
    {
        $push: { cart: { product: product_id } } // Adds the product with a quantity of 1
    }
);

  if(updateUser.modifiedCount > 0){
    let response = success_function({
      statusCode : 200,
      message : "Added to cart"
    })
    res.status(response.statusCode).send(response);
    return;
  }
  else{
    let response = error_function({
      statusCode : 400,
      message : "Failed to add"
    })
    res.status(response.statusCode).send(response);
    return;
  }
  }
  catch(error){
    let response = error_function({
      statusCode : 400,
      message : error.message ?  error.message : error
    })
    res.status(response.statusCode).send(response);
    return;
  }
} 

exports.deleteFromCart = async (req, res) => {
  const product_id = new mongoose.Types.ObjectId(req.params.id); // Ensure product_id is properly converted to ObjectId

  if (!product_id) {
    // If the product_id is invalid
    const response = error_function({
      statusCode: 400,
      message: "Invalid product ID"
    });
    return res.status(response.statusCode).send(response);
  }

  try {
    const updateCart = await users.updateOne(
      { 'cart.product': product_id }, // Find user with product in the cart
      { $pull: { cart: { product: product_id } } } // Remove product from cart
    );

    if (updateCart.modifiedCount > 0) {
      // Product removed successfully
      const response = success_function({
        statusCode: 200,
        message: "Product removed from cart"
      });
      return res.status(response.statusCode).send(response);
    } else {
      // No product found to remove
      let  response = error_function({
        statusCode: 400,
        message: "Product not found in cart"
      });
      return res.status(response.statusCode).send(response);
    }
  } catch (error) {
    // Handle any error that occurred during the update operation
    let  response = error_function({
      statusCode: 500,
      message: "Failed to remove the product due to server error"
    });
    return res.status(response.statusCode).send(response);
  }
};

exports.placeOrder = async (req, res) => {
  const cartItems = req.body; // cartItems is an array of { product_id, quantity }
  const userId = new mongoose.Types.ObjectId(req.params.id);

  try {
    // Prepare bulk operations
    const bulkOperations = cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item._id, stock: { $gte: item.quantity } },
        update: { $inc: { stock: -item.quantity } },
      },
    }));

    const result = await products.bulkWrite(bulkOperations);

    // Check if all updates were successful
    if (result.matchedCount === cartItems.length && result.modifiedCount === cartItems.length) {
      const updateCart = await users.updateOne(
        { _id: userId }, 
        { $set: { cart: [] } }
      );


      if (updateCart.modifiedCount < 1) {
        let response = error_function({
          statusCode: 400,
          message: "Failed to clear items from the cart.",
        });
        return res.status(response.statusCode).send(response);
      }

      // Attempt email sending
      try {
        const user = await users.findOne({ _id: userId });
        const user_name = user.name;
        const user_email = user.email;
        const content = await orderPlaced(user_name, cartItems);

        await sendEmail(user_email, "Order placed successfully", content);
      } catch (emailError) {
        console.error("Email sending failed:", emailError.message);
        let response = error_function({
          statusCode: 400,
          message: "Order placed, but failed to send confirmatiom mail.",
        });
        return res.status(response.statusCode).send(response);
      }

      // Success response
      let response = success_function({
        statusCode: 200,
        message: "Your order was placed successfully.",
      });
      return res.status(response.statusCode).send(response);
    } else {
      let response = error_function({
        statusCode: 400,
        message: "Some products could not be ordered due to insufficient stock.",
      });
      return res.status(response.statusCode).send(response);
    }
  } catch (error) {
    console.error("Error in placing the order:", error.message);
    let response = error_function({
      statusCode: 400,
      message: "An error occurred while placing the order.",
    });
    return res.status(response.statusCode).send(response);
  }
};


