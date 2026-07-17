import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "ozella.halvorson28@ethereal.email",
    pass: "hgxR9JBMKmqerhj9AA",
  },
});

export default transporter;
