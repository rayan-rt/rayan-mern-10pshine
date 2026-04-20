import nodemailer from "nodemailer";
// --

const transporter = nodemailer.createTransport({
  host: process.env["SMTP_HOST"],
  port: Number(process.env["SMTP_PORT"]),
  auth: {
    user: process.env["SMTP_USER"],
    pass: process.env["SMTP_PASS"],
  },
});

const sendVerificationEmail = async (email: string, otp: string) => {
  const mailOptions = {
    from: process.env["EMAIL_FROM"],
    to: email,
    subject: "Verify your email",
    text: `Your verification code is: ${otp}. It will expire in 24 hours.`,
    html: `<h1>Email Verification</h1><p>Your verification code is: <strong>${otp}</strong></p><p>It will expire in 24 hours.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

const sendResetPasswordEmail = async (email: string, resetLink: string) => {
  if (
    !process.env["SMTP_USER"] ||
    process.env["SMTP_USER"] === "your_smtp_user"
  ) {
    console.log(`[DEV MODE] Reset Password Link for ${email}: ${resetLink}`);
    return;
  }

  const mailOptions = {
    from: process.env["EMAIL_FROM"],
    to: email,
    subject: "Reset your password",
    text: `You requested a password reset. Click here to reset: ${resetLink}`,
    html: `<h1>Password Reset</h1><p>Click the link below to reset your password. This link expires in 1 hour.</p><a href="${resetLink}">Reset Password</a>`,
  };

  await transporter.sendMail(mailOptions);
};

const mailHelper = {
  sendVerificationEmail,
  sendResetPasswordEmail,
};

export { mailHelper };
