exports.zeroStockNotification = function (sellerName, productName) {
    return new Promise(async (resolve, reject) => {
      try {
        const template = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Stock Alert</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
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
                background: #FF5722;
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
                background: #FF5722;
                text-decoration: none;
                border-radius: 5px;
              }
              .btn:hover {
                background: #E64A19;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="email-header">
                Stock Alert: ${productName}
              </div>
              <div class="email-body">
                <p>Dear ${sellerName},</p>
                <p>We noticed that your product <strong>${productName}</strong> has reached <strong>zero stock</strong>.</p>
                <p>Please update the stock availability to ensure uninterrupted sales and customer satisfaction.</p>
                <a href="[Product Management Link]" class="btn">Update Stock</a>
                <p>If you need assistance, feel free to contact our support team.</p>
              </div>
              <div class="email-footer">
                &copy; 2024 Menx.com . All rights reserved. <br>
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
  