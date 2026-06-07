// This code defines a utility function sendEmail that uses the nodemailer library to send emails. It checks for email credentials in environment variables, creates a transporter object for sending emails through Gmail, and defines the mail options including the recipient, subject, and message. The function then attempts to send the email and returns a success response if successful, or throws an error if there is an issue with sending the email. This utility can be used in various parts of the application to send emails, such as OTPs for user registration or password reset links.
const nodemailer = require("nodemailer");
// This code defines a utility function sendEmail that uses the nodemailer library to send emails. It checks for email credentials in environment variables, creates a transporter object for sending emails through Gmail, and defines the mail options including the recipient, subject, and message. The function then attempts to send the email and returns a success response if successful, or throws an error if there is an issue with sending the email. This utility can be used in various parts of the application to send emails, such as OTPs for user registration or password reset links.
const sendEmail = async (options) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error(
        "Email credentials not configured in environment variables",
      );
    }
    // Create a transporter object using the default SMTP transport (Gmail in this case). The transporter is configured with the email service and authentication details (email and password) from environment variables. This allows the application to send emails through the specified email account.
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    // Define the mail options, including the sender's email address, recipient's email address, subject, and message body. The message is included in both plain text and HTML formats to ensure compatibility with different email clients. The recipient's email address, subject, and message are passed as parameters to the function, allowing for dynamic email content.
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: `<p>${options.message}</p>`,
    };
    // Attempt to send the email using the transporter object and the defined mail options. If the email is sent successfully, it logs the response and returns a success message along with the message ID. If there is an error during the email sending process, it catches the error, logs it, and throws a new error with a descriptive message.
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return {
      success: true,
      message: "Email sent successfully",
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Email sending error:", error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

module.exports = sendEmail;
