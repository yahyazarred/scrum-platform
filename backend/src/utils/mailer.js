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
      text: `Your verification code is: ${code}. It will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to", to);

  } catch (err) {
    console.log("Email sending error:", err.message);
    throw new Error("Could not send email");
  }
};

module.exports = sendVerificationEmail;
