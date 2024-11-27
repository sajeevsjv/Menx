exports.otpVerification = function (name,emails, otp) {
  return new Promise(async (resolve, reject) => {
    try {
      let template = `
           <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>OTP Verification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border: 1px solid #dddddd;
                border-radius: 8px;
                overflow: hidden;
            }
            .email-header {
                background-color: #007bff;
                color: #ffffff;
                text-align: center;
                padding: 20px;
            }
            .email-header h1 {
                margin: 0;
                font-size: 24px;
            }
            .email-body {
                padding: 30px;
            }
            .email-body h2 {
                color: #333333;
                font-size: 20px;
            }
            .email-body p {
                color: #555555;
                line-height: 1.6;
            }
            .otp-code {
                display: block;
                background-color: #f0f0f0;
                padding: 15px;
                text-align: center;
                font-size: 24px;
                color: #333333;
                font-weight: bold;
                letter-spacing: 4px;
                margin: 20px 0;
                border-radius: 4px;
            }
            .email-footer {
                text-align: center;
                padding: 20px;
                background-color: #f4f4f4;
                font-size: 12px;
                color: #888888;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <!-- Email Header -->
            <div class="email-header">
                <h1>OTP Verification</h1>
            </div>

            <!-- Email Body -->
            <div class="email-body">
                <h2>Hello, ${name}</h2>
                <p>We have received a request to verify the account associated with this email: <strong>${emails}</strong></p>
                <p>To complete your verification, please use the One-Time Password (OTP) below:</p>

                <!-- OTP Code -->
                <span class="otp-code">${otp}</span>

                <p>This OTP is valid for the next 10 minutes. Please do not share this code with anyone for your security.</p>
                <p>If you did not request this, please ignore this email or contact our support team immediately.</p>
            </div>

            <!-- Email Footer -->
            <div class="email-footer">
                <p>&copy; All rights reserved.</p>
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