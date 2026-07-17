import sendEmail from "./sendEmail.js";

async function sendResetPasswordEmail({ name, email, token, origin }) {
  const resetURL = `${origin}/user/reset-password?token=${token}&email=${email}`;
  const messageHTML = `<p>Please reset password by clicking on the following link : 
  <a href="${resetURL}">Reset Password 🔏</a>
  </p>`;

  return sendEmail({
    to: email,
    subject: `Reset Password Link`,
    html: `<h4>Hello, ${name}!</h4>
    ${messageHTML}
    `,
  });
}

export default sendResetPasswordEmail;
