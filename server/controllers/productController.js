const products = require("../db/models/products")
const orders = require("../db/models/orders")
const mongoose = require("mongoose");
const { error_function, success_function } = require("../utils/response-handler");
const users = require("../db/models/users");
const categories = require("../db/models/categories");
const fileUpload = require("../utils/file-upload").fileUpload;
const sendEmail = require("../utils/send-email").sendEmail;
const orderPlaced = require("../utils/email-templates/orderPlaced").orderPlaced;
const zeroStockNotification = require("../utils/email-templates/zeroStockNotification").zeroStockNotification;
const blockProduct = require("../utils/email-templates/productBlocked").productBlocked;



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


exports.updateProduct = async (req, res) => {
  const { name, description, price, mrp, stock, sizes, product_images, categories, seller } = req.body;
  const product_id = req.params.id;

  // Validate product ID
  if (!mongoose.Types.ObjectId.isValid(product_id)) {
    let response = error_function({
      statusCode: 400,
      message: "Invalid product ID.",
    });
    return res.status(response.statusCode).send(response);
  }

  try {
    // Fetch the existing product
    const existingProduct = await products.findById(product_id);
    if (!existingProduct) {
      let response = error_function({
        statusCode: 404,
        message: "Product not found.",
      });
      return res.status(response.statusCode).send(response);
    }

    // Prepare the update payload
    const updatePayload = {};

    if (name) updatePayload.name = name;
    if (description) updatePayload.description = description;
    if (sizes) updatePayload.sizes = sizes;
    if (price) updatePayload.price = price;
    if (mrp) updatePayload.mrp = mrp;
    if (stock) updatePayload.stock = stock;
    if (price) {
      if (price <= 0) {
        let response = error_function({
          statusCode: 400,
          message: "Price must be greater than zero.",
        });
        return res.status(response.statusCode).send(response);
      }
      updatePayload.price = price;
    }
    if (categories) updatePayload.categories = categories;
    if (seller) {
      if (!mongoose.Types.ObjectId.isValid(seller)) {
        let response = error_function({
          statusCode: 400,
          message: "Invalid seller ID.",
        });
        return res.status(response.statusCode).send(response);
      }
      updatePayload.seller = new mongoose.Types.ObjectId(seller);
    }

    // Handle product images
    const regExp = /^data:/;
    const uploadedImagePaths = [];
    if (product_images) {
      if (Array.isArray(product_images)) {
        for (const img of product_images) {
          if (regExp.test(img)) {
            const imgPath = await fileUpload(img, "products");
            uploadedImagePaths.push(imgPath);
          } else {
            uploadedImagePaths.push(img); // Existing image path
          }
        }
        updatePayload.product_images = uploadedImagePaths;
      } else {
        let response = error_function({
          statusCode: 400,
          message: "Invalid product_images format.",
        });
        return res.status(response.statusCode).send(response);
      }
    }

    // Update the product and check modified count
    const result = await products.updateOne({ _id: product_id }, updatePayload);

    // If no documents were modified
    if (result.modifiedCount === 0) {
      let response = error_function({
        statusCode: 400,
        message: "No changes were made to the product.",
      });
      return res.status(response.statusCode).send(response);
    }

    // Send success message
    let response = success_function({
      statusCode: 200,
      message: "Product updated successfully.",
    });
    return res.status(response.statusCode).send(response);
  } catch (error) {
    console.error("Error updating product:", error);
    let response = error_function({
      statusCode: 500,
      message: error.message || "Internal Server Error.",
    });
    return res.status(response.statusCode).send(response);
  }
};



exports.getAllProducts = async(req, res) => {
  try{
    const user_id = new mongoose.Types.ObjectId(req.params.id);
    let allProducts = await products.find({seller: { $ne: user_id }});

    if(products){
      let response = success_function({
        statusCode: 200,
        data : allProducts
      })
      return res.status(response.statusCode).send(response);
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
        const user_id = new mongoose.Types.ObjectId(req.params.id);
        
        // Fetch products excluding those with the matching seller field
        const recentProducts = await products.find({
            seller: { $ne: user_id } // Exclude products with seller matching user_id
        })
        .sort({ createdAt: -1 }) // Sort by newest first
        .limit(20); // Limit to 20 recent products

        let response = success_function({
            statusCode: 200,
            data: recentProducts
        });
        res.status(response.statusCode).send(response);
        return;
    } catch (error) {
        let response = error_function({
            statusCode: 400,
            message: error.message ? error.message : error
        });
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
  let quantity = req.body.quantity || 1;

  try{

    const user = await users.findOne({
      _id: user_id,
      cart: {
          $elemMatch: {
              product: product_id
          }
      }
  });
  
  const checkStock = await products.findOne({ _id: product_id, stock: { $gte: quantity } });{
    if (!checkStock) {
      let response = error_function({
        statusCode: 400,
        message: "Insufficient stock for the product."
      });
      return res.status(response.statusCode).send(response);
    }
  }
  
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
        $push: { cart: { product: product_id, quantity } } // Adds the product with a quantity of 1
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



exports.updateCart = async (req, res) => {
  console.log("body :", req.body);
  const product_id = new mongoose.Types.ObjectId(req.body.product_id);
  const user_id = new mongoose.Types.ObjectId(req.body.user_id);
  const quantity = parseInt(req.body.quantity, 10);

  // Check if the quantity is valid (greater than 1)
  if (quantity <= 1) {
    const response = error_function({
      statusCode: 400,
      message: "Please add more quantity",
    });
    return res.status(response.statusCode).send(response);
  }

  try {
    // Check if the product exists in the user's cart
    const user = await users.findOne({
      _id: user_id,
      "cart.product": product_id,
    });

    if (!user) {
      const response = error_function({
        statusCode: 400,
        message: "Product not found in cart.",
      });
      return res.status(response.statusCode).send(response);
    }

    // Check stock availability
    const checkStock = await products.findOne({ _id: product_id, stock: { $gte: quantity } });
    if (!checkStock) {
      const response = error_function({
        statusCode: 400,
        message: "Insufficient stock for the product.",
      });
      return res.status(response.statusCode).send(response);
    }

    // Replace the quantity of the existing product in the cart
    const updateUser = await users.updateOne(
      { _id: user_id, "cart.product": product_id },
      { $set: { "cart.$.quantity": quantity } } // Replaces the old quantity with the new one
    );

    if (updateUser.modifiedCount > 0) {
      const response = success_function({
        statusCode: 200,
        message: "Quantity updated successfully",
      });
      return res.status(response.statusCode).send(response);
    } else {
      const response = error_function({
        statusCode: 400,
        message: "Failed to update quantity",
      });
      return res.status(response.statusCode).send(response);
    }

  } catch (error) {
    const response = error_function({
      statusCode: 400,
      message: error.message || error,
    });
    return res.status(response.statusCode).send(response);
  }
};




exports.addToWishlist = async (req,res) =>{
  console.log("body :",req.body);
  let product_id  = new mongoose.Types.ObjectId(req.body.product_id);
  let user_id = new mongoose.Types.ObjectId(req.body.user_id);

  try{

    const user = await users.findOne({
      _id: user_id,
      wishlist: {
          $elemMatch: {
              product: product_id
          }
      }
  });
  

  if(user){
    let response = error_function({
      statusCode : 400,
      message : "Product already in whishlist"
    })
    res.status(response.statusCode).send(response);
    return;
  }

  let updateUser = await users.updateOne(
    { _id: user_id }, // Filter: Specifies which document to update
    {
        $push: { wishlist: { product: product_id } } 
    }
);

  if(updateUser.modifiedCount > 0){
    let response = success_function({
      statusCode : 200,
      message : "Added to wishlist"
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

exports.removeFromWishlist = async (req, res) => {
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
    const updateWishlist = await users.updateOne(
      { 'wishlist.product': product_id }, // Find user with product in the cart
      { $pull: { wishlist: { product: product_id } } } // Remove product from cart
    );

    if (updateWishlist.modifiedCount > 0) {
      // Product removed successfully
      const response = success_function({
        statusCode: 200,
        message: "Product removed from wishlist"
      });
      return res.status(response.statusCode).send(response);
    } else {
      // No product found to remove
      let  response = error_function({
        statusCode: 400,
        message: "Product not found in wishlist"
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
  const { productsInfo, totalAmount } = req.body;
  const userId = new mongoose.Types.ObjectId(req.params.id);
  const isFromCart = req.body.isFromCart;

  try {
      
    const orderItems = productsInfo.map((item) => ({
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
    const bulkOperations = productsInfo.map((item) => ({
      updateOne: {
        filter: { _id: item._id, stock: { $gte: item.quantity } },
        update: { $inc: { stock: -item.quantity } },
      },
    }));

    const result = await products.bulkWrite(bulkOperations);

  
    // Check if all updates were successful
    if (result.matchedCount === productsInfo.length && result.modifiedCount === productsInfo.length) {
      if(isFromCart){
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
    }

       // Check for zero stock products
       const zeroStockProducts = await products.find({ _id: { $in: productsInfo.map((item) => item._id) }, stock: 0 });

       if (zeroStockProducts.length > 0) {
         for (const product of zeroStockProducts) {
           try {
             const seller = await users.findById(product.seller);
             const emailContent = await zeroStockNotification(seller.name,product.name);
             await sendEmail(seller.email, "Product Stock Alert", emailContent);
             console.log(`Zero stock notification sent for product ${product.name}`);
           } catch (error) {
             console.error(`Failed to notify seller about zero stock for product ${product.name}:`, error.message);
           }
         }
       }  

      // Attempt email sending
      try {
        const user = await users.findOne({ _id: userId });
        const user_name = user.name;
        const user_email = user.email;
        const content = await orderPlaced(user_name, productsInfo);

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
    let myorders = await orders.find({userId : _id}).populate("items.productId").sort({ orderDate: -1 }); ;
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


  exports.myEarnings = async (req, res) => {
    try {
      const sellerId = new mongoose.Types.ObjectId(req.params.id);
  
      // Aggregate orders and get product details for each order item
      const earnings = await orders.aggregate([
        // Unwind the items array to process each item separately
        { $unwind: "$items" },
  
        // Match orders that contain items sold by the specified seller
        { $match: { "items.sellerId": sellerId } },
  
        // Perform a lookup to fetch product details for each item
        {
          $lookup: {
            from: "products", // Name of the products collection
            localField: "items.productId",
            foreignField: "_id",
            as: "productDetails"
          }
        },
  
        // Unwind the product details (assuming one match per product)
        { $unwind: "$productDetails" },
  
        // Perform another lookup to fetch buyer details (userId)
        {
          $lookup: {
            from: "users", // Name of the users collection
            localField: "userId", // The field in the orders collection that stores user ID
            foreignField: "_id", // The field in the users collection
            as: "buyerDetails"
          }
        },
  
        // Unwind the buyer details (assuming one match per user)
        { $unwind: "$buyerDetails" },
  
        // Populate the productId with the full product data
        {
          $addFields: {
            "items.productId": "$productDetails",
            "buyerId": "$buyerDetails" // Add the buyer details
          }
        },
  
        // Include relevant order and product fields
        {
          $project: {
            orderId: "$_id",
            productId: "$items.productId", // Populated productId
            quantitySold: "$items.quantity",
            price: "$items.price",
            subtotal: "$items.subtotal",
            orderDate: "$orderDate",
            buyerId: 1 // Include buyer details (user data)
          }
        },
  
        // Optional: Sort by order date or total earnings (you can adjust this part as needed)
        { $sort: { orderDate: -1 } }
      ]);
  
      // Check if earnings data exists
      if (earnings.length > 0) {
        let response = success_function({
          statusCode: 200,
          data: earnings
        });
        res.status(response.statusCode).send(response);
      } else {
        let response = error_function({
          statusCode: 404,
          message: "No earnings found for the specified seller"
        });
        res.status(response.statusCode).send(response);
      }
    } catch (error) {
      console.error("Error:", error);
      let response = error_function({
        statusCode: 500,
        message: error.message ? error.message : "An error occurred"
      });
      res.status(response.statusCode).send(response);
    }
  };
  
  
  
  

exports.toggleBlockProduct = async (req, res) => {
  try {
    const product_id = req.params.id;
    const reasonForBlock = req.body.reason; // Extract the reason for blocking from the request body

    // Step 1: Find the product by its ID
    const product = await products.findById(product_id);
    if (!product) {
      let response = {
        statusCode: 404,
        message: "Product not found.",
      };
      return res.status(response.statusCode).send(response);
    }

    // Step 2: Toggle the block status
    const newBlockStatus = !product.isBlocked; // Toggle the value of isBlocked

    // Step 3: Update the product's block status
    const updateProduct = await products.updateOne(
      { _id: product_id },
      { $set: { isBlocked: newBlockStatus } }
    );

    if (!updateProduct.modifiedCount) {
      let response = {
        statusCode: 400,
        message: "Failed to update the product's block status.",
      };
      return res.status(response.statusCode).send(response);
    }

    // Step 4: If the product is being blocked, send an email to the seller
    if (newBlockStatus) {
      const seller = await users.findById(product.seller); // Assuming you have a "users" collection for the sellers
      if (!seller) {
        let response = {
          statusCode: 404,
          message: "Seller not found.",
        };
        return res.status(response.statusCode).send(response);
      }

      // Step 5: Send an email to the seller if the product is blocked
      try {
        const seller_name = seller.name;
        const product_name = product.name;
        const user_email = seller.email; // Seller's email

        const content = await blockProduct(seller_name, product_name, reasonForBlock); // Call email template
        await sendEmail(user_email, "Your Product has been Blocked", content); // Send email

        let response = {
          statusCode: 200,
          message: "Product blocked successfully, seller notified.",
        };
        return res.status(response.statusCode).send(response);
      } catch (emailError) {
        console.error("Email sending failed:", emailError.message);
        let response = {
          statusCode: 200, // Still 200 as the product block operation succeeded
          message: "Product blocked, but failed to send notification email to the seller.",
        };
        return res.status(response.statusCode).send(response);
      }
    } else {
      // Step 6: If the product is being unblocked, no need to send an email
      let response = {
        statusCode: 200,
        message: "Product unblocked successfully.",
      };
      return res.status(response.statusCode).send(response);
    }

  } catch (error) {
    console.error("Error:", error.message);
    let response = {
      statusCode: 500,
      message: error.message || "Something went wrong.",
    };
    res.status(response.statusCode).send(response);
  }
};

exports.toggleBlockUser = async (req, res) => {
  try {
    const user_id = req.params.id;
    const reasonForBlock = req.body.reason; // Extract the reason for blocking from the request body

    const user = await users.findById(user_id);
    if (!user) {
      let response = {
        statusCode: 404,
        message: "User not found",
      };
      return res.status(response.statusCode).send(response);
    }
 
    // Step 2: Toggle the block status
    const newBlockStatus = !user.isBlocked; // Toggle the value of isBlocked

    // Step 3: Update the product's block status
    const updateUser = await users.updateOne(
      { _id: user_id },
      { $set: { isBlocked: newBlockStatus } }
    );

    if (!updateProduct.modifiedCount) {
      let response = {
        statusCode: 400,
        message: "Failed to update the product's block status.",
      };
      return res.status(response.statusCode).send(response);
    }

    // Step 4: If the product is being blocked, send an email to the seller
    if (newBlockStatus) {
      const seller = await users.findById(product.seller); // Assuming you have a "users" collection for the sellers
      if (!seller) {
        let response = {
          statusCode: 404,
          message: "Seller not found.",
        };
        return res.status(response.statusCode).send(response);
      }

      // Step 5: Send an email to the seller if the product is blocked
      try {
        const seller_name = seller.name;
        const product_name = product.name;
        const user_email = seller.email; // Seller's email

        const content = await blockProduct(seller_name, product_name, reasonForBlock); // Call email template
        await sendEmail(user_email, "Your Product has been Blocked", content); // Send email

        let response = {
          statusCode: 200,
          message: "Product blocked successfully, seller notified.",
        };
        return res.status(response.statusCode).send(response);
      } catch (emailError) {
        console.error("Email sending failed:", emailError.message);
        let response = {
          statusCode: 200, // Still 200 as the product block operation succeeded
          message: "Product blocked, but failed to send notification email to the seller.",
        };
        return res.status(response.statusCode).send(response);
      }
    } else {
      // Step 6: If the product is being unblocked, no need to send an email
      let response = {
        statusCode: 200,
        message: "Product unblocked successfully.",
      };
      return res.status(response.statusCode).send(response);
    }

  } catch (error) {
    console.error("Error:", error.message);
    let response = {
      statusCode: 500,
      message: error.message || "Something went wrong.",
    };
    res.status(response.statusCode).send(response);
  }
};





  