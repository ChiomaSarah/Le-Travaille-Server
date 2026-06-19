const { Resend } = require("resend");

const sendEmail = async (to, subject, html) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: `Le-Travaille <${process.env.SENDER_EMAIL}>`,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email!");
    }

    console.log(`Email sent to ${to}:`, data);
    return data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email!");
  }
};

module.exports = sendEmail;
