import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { otpTemplate } from "./templates/otpTemplate.js";
import { billTemplate } from "./templates/billTemplate.js";

dotenv.config();

// Unified Transporter Configuration
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS, 
  },
});

/**
 * Sends a  HTML OTP email
 */
export async function sendOTP(email, otp) {
  try {
    await transporter.sendMail({
      from: `"Mess Management" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Login Verification Code",
      html: otpTemplate(otp),
    });
    return { success: true };
  } catch (error) {
    console.error("Email Error:", error);
    return { success: false, error };
  }
}

/**
 * Sends a professional HTML Bill statement
 */
export async function sendBillEmail(email, data) {
  try {
    await transporter.sendMail({
      from: `"Mess Billing" <${process.env.MAIL_USER}>`,
      to: email,
      subject: `Mess Bill for ${data.month} ${data.year}`,
      html: billTemplate(data), // Calling external HTML template
    });
    return { success: true };
  } catch (error) {
    console.error("Billing Email Error:", error);
    return { success: false, error };
  }
}
