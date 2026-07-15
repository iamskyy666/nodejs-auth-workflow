import sendEmail from "./sendEmail.js";

async function sendVerificationEmail({
  name,
  email,
  verificationToken,
  origin,
}) {
  const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;
  const htmlMessage = `<p>📧 Please confirm your email by clicking on the follwoing link : <a href="${verifyEmail}">Verify Email</a> </p>`;

  return sendEmail({
    to: email,
    subject: "Email Confirmation",
    html: `<h4>Hello ${name}</h4>
    ${htmlMessage}
    `,
  });
}

export default sendVerificationEmail;
