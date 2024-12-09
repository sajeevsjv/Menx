exports.orderPlaced = function (name, emails, otp) {
    return new Promise(async (resolve, reject) => {
        try {
            let template = `
           <!DOCTYPE html>
<html>
<head>
  <title>Order Confirmation</title>
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
      background: #4CAF50;
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
    .order-details {
      margin: 20px 0;
      border-collapse: collapse;
      width: 100%;
    }
    .order-details th,
    .order-details td {
      border: 1px solid #ddd;
      padding: 8px;
    }
    .order-details th {
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
      background: #4CAF50;
      text-decoration: none;
      border-radius: 5px;
    }
    .btn:hover {
      background: #45a049;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      Thank You for Your Order!
    </div>
    <div class="email-body">
      <p>Hi [Customer Name],</p>
      <p>We’re excited to let you know that your order has been placed successfully!</p>
      <h3>Order Summary</h3>
      <table class="order-details">
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Product 1</td>
            <td>2</td>
            <td>$50.00</td>
          </tr>
          <tr>
            <td>Product 2</td>
            <td>1</td>
            <td>$30.00</td>
          </tr>
          <tr>
            <th colspan="2">Total</th>
            <th>$80.00</th>
          </tr>
        </tbody>
      </table>
      <p>We’ll notify you once your order has been shipped.</p>
      <a href="[Tracking Link]" class="btn">Track Your Order</a>
      <p>If you have any questions, feel free to contact our support team.</p>
    </div>
    <div class="email-footer">
      &copy; 2024 [Your Company Name]. All rights reserved. <br>
      <a href="[Support Link]">Support</a> | <a href="[Privacy Policy Link]">Privacy Policy</a>
    </div>
  </div>
</body>
</html>
 `;
            resolve(template);
        }
        catch (error) {
            //console.log(error);
            reject(error);
        }
    })
};