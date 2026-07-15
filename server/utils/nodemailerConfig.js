import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "patrick44@ethereal.email",
    pass: "pezzgyevuB7HV63nuZ",
  },
});

export default transporter;
