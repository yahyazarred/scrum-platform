// ============================================================
// What is this file?
//   provided with the gmail address that will send the email and the email content
//   this file sends an email with a html/css interface containing the verification code
// ============================================================
const nodemailer = require("nodemailer");

//Setup transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, //Gmail address
    pass: process.env.EMAIL_PASS, //Gmail app password
  },
});

const sendVerificationEmail = async (to, code) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: "Your Verification Code",
      html: `
      <!DOCTYPE html>
<html>
<head>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background-color:#0a0f16;font-family:'Montserrat',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg, #1a2540 0%, #1e2a45 100%);border-radius:20px;padding:50px 40px;text-align:center;box-shadow:0 8px 32px rgba(0,0,0,0.6);border:1px solid rgba(77,184,232,0.2);">
          
          <!-- Icon -->
            <tr>
              <td align="center">
                <div style="width:80px;height:80px;background:linear-gradient(135deg,#2d5a7b 0%,#4db8e8 100%);border-radius:50%;box-shadow:0 0 30px rgba(77,184,232,0.4);margin:0 auto 30px auto;line-height:80px;font-size:40px;color:#ffffff;text-align:center;">
                  ✉️
                </div>
              </td>
            </tr>
          <!-- Header -->
          <tr>
            <td>
              <h1 style="color:#ffffff;font-size:28px;font-weight:600;margin:0 0 15px 0;text-shadow:0 0 20px rgba(77,184,232,0.3);">Verify Your Account</h1>
              <p style="color:#b0c4de;font-size:17px;line-height:24px;margin:0 0 35px 0;">
                Use the code below to verify your account:
              </p>
            </td>
          </tr>
          
          <!-- Code Box -->
          <tr>
            <td>
              <div style="background:#0f1620;border:2px solid #4db8e8;border-radius:12px;padding:25px;margin:20px 0;">
                <div style="font-size:40px;font-weight:700;color:#4db8e8;letter-spacing:8px;font-family:'Montserrat',monospace;">
                  ${code}
                </div>
              </div>
            </td>
          </tr>
          
          <!-- Info Text -->
          <tr>
            <td>
              <p style="color:#8fa3c0;font-size:15px;line-height:22px;margin:30px 0 10px 0;">
                This code expires in <strong style="color:#4db8e8;">5 minutes</strong>.<br>
                If you did not request this email, please ignore it.
              </p>
            </td>
          </tr>
          
          <!-- Divider -->
          <tr>
            <td>
              <div style="height:1px;background:rgba(77,184,232,0.1);margin:25px 0;"></div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td>
              <p style="color:#6a7a94;font-size:13px;margin:0;">
                © 2026 Scrumble. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to", to);
  } catch (err) {
    console.log("Email sending error:", err.message);
    throw new Error("Could not send email");
  }
};

module.exports = sendVerificationEmail;
