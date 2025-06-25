"use server";

import nodemailer from "nodemailer";

export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  if (!process.env.MAILTRAP_USERNAME || !process.env.MAILTRAP_PASSWORD) {
    throw new Error(
      "MAILTRAP_USERNAME or MAILTRAP_PASSWORD environment variable are not set"
    );
  }

  if (!process.env.EMAIL_FROM) {
    throw new Error("EMAIL_FROM environment variable is not set");
  }

  // Create Nodemailer transporter for Mailtrap SMTP
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525, // or 587, 465 depending on your Mailtrap settings
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

  try {
    // Send email using Nodemailer
    const response = await transport.sendMail({
      from: process.env.EMAIL_FROM, // Sender email
      to: to.toLowerCase().trim(), // Recipient email
      subject: subject.trim(), // Email subject
      html: text.trim(), // Plain text body
    });

    return {
      success: true,
      messageId: response.messageId,
    };
  } catch (error) {
    console.error("Error sending email:", error.message);
    return {
      success: false,
      message: "Failed to send email. Please try again later.",
      error: error.message,
    };
  }
}
