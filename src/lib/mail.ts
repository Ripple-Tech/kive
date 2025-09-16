import nodemailer from "nodemailer";

interface MailOptions {
  to: string;
  subject: string;
  body: string;
}

 const domain = process.env.NEXT_PUBLIC_APP_URL;

export async function sendTwoFactorTokenEmail(email: string, token: string) {
  
  return sendMail({
    to: email,
    subject: 'Two factor authentication code',
    body: `<p>your two factor authentication code is:  ${token} </p>`
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  return sendMail({
    to: email,
    subject: 'Reset Your Password',
    body: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
  });
}

export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${domain}/auth/email-verification?token=${token}`;

  return sendMail({
    to: email,
    subject: 'Verify your email',
    body: `<p>Click <a href="${confirmLink}">here</a> to verify your email.</p>`
  });
}

async function sendMail({ to, subject, body }: MailOptions) {
  const { SMTP_PASSWORD, SMTP_EMAIL } = process.env;

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_EMAIL!,
      pass: SMTP_PASSWORD!
    }
  });

  try {
    await transport.verify();
  } catch (error) {
    console.log("Error verifying transport:", error);
    return;
  }

  try {
    const sendResult = await transport.sendMail({
      from: `"Kyve" <${SMTP_EMAIL}>`,
      to,
      subject,
      html: body
    });
    console.log("Email sent successfully:", sendResult);
    return sendResult;
  } catch (error) {
    console.log("Error sending email:", error);
    throw error;
  }
}