const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
  try {
    console.log("Attempting to send email to:", to);
    console.log("Using Brevo SMTP...");

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Le-Travaille" <${process.env.SENDER_EMAIL}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}: ${info.response}`);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

module.exports = sendEmail;
