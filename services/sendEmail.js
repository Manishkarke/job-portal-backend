const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });
  const htmlContent = `
<!DOCTYPE html>
<html>
  <head>
    <title>Welcome to [Your Website]!</title>
    <style>
      body {
        font-family: "Arial", sans-serif;
        background-color: #f4f4f4;
        color: #333;
        margin: 20px;
      }

      p {
        margin-bottom: 15px;
        line-height: 1.5;
      }
      strong {
        color: #fb923c;
      }
      .footer {
        font-weight: 600;
      }
      .otp {
        text-align: center;
      }
      .otp strong {
        letter-spacing: 10px;
        font-size: 1.5rem;
      }

      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
    </style>
  </head>

  <body>
    <div class="container">
      <h3 class="greeting">Hi <strong>${options.userName}</strong>,</h3>

      <p>
        Welcome to Job-<strong>Portal</strong>! 🎉 To complete your registration, please use
        the following OTP (One-Time Password) for verification:
      </p>

      <p class="otp"><strong>${options.otp}</strong></p>

      <p>
        If you have any questions or need assistance, don't hesitate to contact
        us.
      </p>

      <p class="footer">Best regards,<br />Job-<strong>portal</strong></p>
    </div>
  </body>
</html>
  `;


  /* Main Content: We understand that forgetting passwords happens to the best of us. No worries! Just enter the email address associated with youryd we'll send you instructions to reset your password.

**Email Address:**
[_________]   [Submit]

**Note:**
- Make sure to check your spam folder if you don't receive the email within a few minutes.
- Still having trouble? Contact our support team at [support@example.com].
*/
  const mailOptions = {
    from: "Manish Karki <mk4345437@gmail.com>",
    to: options.email,
    subject: "Welcome to Job-Portal! Verify Your Account",
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
