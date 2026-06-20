// utils/sendEmail.js
const axios = require("axios");

const sendEmail = async (to, subject, html) => {
  try {
    console.log("Attempting to send email to:", to);
    console.log("Using Brevo API...");

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Le-Travaille",
          email: process.env.SENDER_EMAIL,
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      },
    );

    console.log(`✅ Email sent to ${to}:`, response.data.messageId);
    return response.data;
  } catch (error) {
    console.error("Error sending email:", error);

    if (error.response) {
      console.error("Brevo API error details:", error.response.data);
    }

    throw new Error(`Failed to send email: ${error.message}`);
  }
};

module.exports = sendEmail;
