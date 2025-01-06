exports.productBlocked = function (sellerName, product, reason) {
    return new Promise(async (resolve, reject) => {
      try {
        // Create the email template
        let template = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Product Blocked Notification</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f9f9f9;
              }
              .email-container {
                max-width: 600px;
                margin: 20px auto;
                background: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              }
              .email-header {
                background: #ff4d4d;
                color: white;
                padding: 20px;
                text-align: center;
                font-size: 24px;
              }
              .email-body {
                padding: 20px;
                line-height: 1.6;
                color: #333333;
              }
              .product-details {
                margin: 20px 0;
                border-collapse: collapse;
                width: 100%;
              }
              .product-details th,
              .product-details td {
                border: 1px solid #ddd;
                padding: 8px;
              }
              .product-details th {
                background-color: #f4f4f4;
                text-align: left;
              }
              .email-footer {
                background: #f4f4f4;
                padding: 10px 20px;
                text-align: center;
                color: #888888;
                font-size: 14px;
              }
              .btn {
                display: inline-block;
                padding: 10px 20px;
                margin-top: 20px;
                color: white;
                background: #ff4d4d;
                text-decoration: none;
                border-radius: 5px;
              }
              .btn:hover {
                background: #e43d3d;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="email-header">
                Product Blocked Notification
              </div>
              <div class="email-body">
                <p>Dear ${sellerName},</p>
                <p>We regret to inform you that one of your products has been blocked on our platform due to the following reason:</p>
                <blockquote style="background: #f9f9f9; padding: 10px; border-left: 4px solid #ff4d4d;">
                  ${reason}
                </blockquote>
                <h3>Product Details</h3>
                <table class="product-details">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Price</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>${product.name}</td>
                      <td>₹${product.price}</td>
                      <td>Blocked</td>
                    </tr>
                  </tbody>
                </table>
                <p>If you believe this action was taken in error or require further clarification, please contact our support team.</p>
                <a href="[Support Link]" class="btn">Contact Support</a>
              </div>
              <div class="email-footer">
                &copy; 2024 Menx.com. All rights reserved. <br>
                <a href="[Support Link]">Support</a> | <a href="[Privacy Policy Link]">Privacy Policy</a>
              </div>
            </div>
          </body>
          </html>
        `;
  
        resolve(template);
      } catch (error) {
        reject(error);
      }
    });
  };
  