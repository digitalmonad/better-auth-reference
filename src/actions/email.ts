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
  if (!process.env.EMAIL_FROM) {
    throw new Error("EMAIL_FROM environment variable is not set");
  }

  // Support both Mailpit (local) and Mailtrap (cloud)
  const isMailpit =
    process.env.SMTP_HOST === "localhost" ||
    process.env.SMTP_HOST === "mailpit";
  const host = process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io";
  const port = parseInt(process.env.SMTP_PORT || "2525");

  // Validate auth for Mailtrap, optional for Mailpit
  if (
    !isMailpit &&
    (!process.env.MAILTRAP_USERNAME || !process.env.MAILTRAP_PASSWORD)
  ) {
    throw new Error(
      "MAILTRAP_USERNAME and MAILTRAP_PASSWORD are required when not using Mailpit",
    );
  }

  // Create Nodemailer transporter
  const transport = nodemailer.createTransport({
    host,
    port,
    auth:
      process.env.MAILTRAP_USERNAME && process.env.MAILTRAP_PASSWORD
        ? {
            user: process.env.MAILTRAP_USERNAME,
            pass: process.env.MAILTRAP_PASSWORD,
          }
        : undefined, // No auth needed for local Mailpit
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
