const products = require("../db/models/products")
const orders = require("../db/models/orders")
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
  const { name, description, price, product_images, categories, seller } = req.body;
  const body = req.body;
  

  // Validate required fields
  if (!name || !description || !seller || !price || !product_images || !categories) {
    return res.status(400).send({
      statusCode: 400,
      message: "Missing required fields.",
    });
  }

  try {
    const userId = new mongoose.Types.ObjectId(seller);
    body.seller = userId;


    // Validate and process product images
    const regExp = /^data:/;
    const uploadedImagePaths = [];

    if (Array.isArray(product_images)) {
      for (const base64 of product_images) {
        if (!regExp.test(base64)) {
          return res.status(400).send({
            statusCode: 400,
            message: "Invalid Base64 string.",
          });
        }
        const img_path = await fileUpload(base64, "products");
        uploadedImagePaths.push(img_path);
      }
    } else {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid or missing product_images field.",
      });
    }

    // Construct the product payload
   body.product_images = uploadedImagePaths;

    // Create the product
    const addProduct = await products.create(body);

    if (addProduct) {
      return res.status(200).send({
        statusCode: 200,
        message: "Product added successfully.",
      });
    } else {
      throw new Error("Failed to add product.");
    }
  } catch (error) {
    console.error("Error adding product:", error);
    return res.status(500).send({
      statusCode: 500,
      message: error.message || "Internal Server Error.",
    });
  }
};


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
    else{
      console.log("error :",error);
    let response = error_function({
      statusCode : 400,
      message : 'Failed to get the product!'
    })
    res.status(response.statusCode).send(response);
    return;
    }
  }
  catch(error){
    console.log("error :",error);
    let response = error_function({
      statusCode : 400,
      message : error.message ? error.message : error
    })
    res.status(response.statusCode).send(response);
    return;
  }
  }

exports.getNewInProducts = async (req, res) => {
    try {
        const recentProducts = await products.find({})
            .sort({ createdAt: -1 }) // Sort by newest first
            .limit(20); // Limit to 20 recent products
            let response = success_function({
              statusCode : 200,
              data : recentProducts
            })
            res.status(response.statusCode).send(response);
            return;
    } catch (error) { 
      let response = error_function({
        statusCode : 400,
        message : error.message ? error.message : error
      })
      res.status(response.statusCode).send(response);
      return;
    }
};


exports.sellerProducts = async (req,res) =>{
  let userId = new mongoose.Types.ObjectId(req.params.id);
  const sellerProducts = await products.find({seller : userId});
  console.log("sellerproducts :",sellerProducts);
  if(sellerProducts){
    let response = success_function({
      statusCode : 200,
      data : sellerProducts
    })
    res.status(response.statusCode).send(response);
    return;
  }
  else{
    let response = error_function({
      statusCode : 400,
      message : "failed get seller products"
    })
    res.status(response.statusCode).send(response);
    return;
  }
}

exports.lowStockProducts = async (req,res) =>{
  let userId = new mongoose.Types.ObjectId(req.params.id);
  const lowstockproducts = await products.find({seller : userId,stock: { $lt: 10 }});
  if(lowstockproducts){
    let response = success_function({
      statusCode : 200,
      data : lowstockproducts
    })
    res.status(response.statusCode).send(response);
    return;
  }
  else{
    let response = error_function({
      statusCode : 400,
      message : "failed get lowstock products"
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
  const { cartItems, totalAmount } = req.body;
  console.log("total ampunttttt : ",totalAmount);
  const userId = new mongoose.Types.ObjectId(req.params.id);

  try {
      
    const orderItems = cartItems.map((item) => ({
      productId: item._id,
      sellerId: item.seller,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.quantity * item.price,
      }));

      const order = {
        userId,
        totalAmount,
        items: orderItems
      }
    
      const savedOrder = await orders.create(order);
      console.log('Order Created:', savedOrder);
  if(savedOrder){

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
        message: "Order placed successfully.",
      });
      return res.status(response.statusCode).send(response);
    } else {
      let response = error_function({
        statusCode: 400,
        message: "Some products could not be ordered due to insufficient stock.",
      });
      return res.status(response.statusCode).send(response);
    }
  }
  else{
    let response = error_function({
      statusCode: 400,
      message: "Failed to place order!",
    });
    return res.status(response.statusCode).send(response);
  }

  } catch (error) {
    console.error("Error in placing the order:", error.message);
    let response = error_function({
      statusCode: 400,
      message: error.message ? error.message : error,
    });
    return res.status(response.statusCode).send(response);
  }
};

exports.viewOrders = async (req,res) =>{
  try{
    let _id = req.params.id
    let myorders = await orders.findOne({userId : _id}).populate("items.productId");
    if(myorders){
      let response = success_function({
        statusCode : 200,
        data : myorders
      })
      res.status(response.statusCode).send(response);
      return;
    }
    else{
      console.log("error :",error);
    let response = error_function({
      statusCode : 400,
      message : 'Failed to get orders'
    })
    res.status(response.statusCode).send(response);
    return;
    }
  }
  catch(error){
    console.log("error :",error);
    let response = error_function({
      statusCode : 400,
      message : error.message ? error.message : error
    })
    res.status(response.statusCode).send(response);
    return;
  }
  }

