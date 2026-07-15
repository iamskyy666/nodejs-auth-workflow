import nodemailer from "nodemailer";
import transporter from "./nodemailerConfig.js";

async function sendEmail({ to, subject, text = "Hello world?", html }) {
  let testAccount = await nodemailer.createTestAccount();

  try {
    const info = await transporter.sendMail({
      from: '"Bruce Wayne" <brucewayne@wayneenterprise.com>', // sender address
      to, // list of recipients
      subject, // subject line
      text, // plain text body
      html, // HTML body
    });

    console.log("Message sent: %s", info.messageId);
    // Preview URL is only available when using an Ethereal test account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    return info;
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
}

export default sendEmail;
