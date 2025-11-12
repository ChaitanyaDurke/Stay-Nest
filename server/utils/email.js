import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendWelcomeEmail = async (user) => {
  const subject = 'Welcome to RoomRent!';
  const text = `Hi ${user.name},\n\nWelcome to RoomRent! We're excited to have you on board.\n\nBest regards,\nThe RoomRent Team`;
  const html = `
    <h1>Welcome to RoomRent!</h1>
    <p>Hi ${user.name},</p>
    <p>We're excited to have you on board. Get started by exploring our properties or listing your own!</p>
    <p>Best regards,<br>The RoomRent Team</p>
  `;

  return sendEmail({ to: user.email, subject, text, html });
};

export const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const subject = 'Password Reset Request';
  const text = `Hi ${user.name},\n\nYou requested a password reset. Please click the link below to reset your password:\n\n${resetUrl}\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nThe RoomRent Team`;
  const html = `
    <h1>Password Reset Request</h1>
    <p>Hi ${user.name},</p>
    <p>You requested a password reset. Please click the link below to reset your password:</p>
    <p><a href="${resetUrl}">Reset Password</a></p>
    <p>If you didn't request this, please ignore this email.</p>
    <p>Best regards,<br>The RoomRent Team</p>
  `;

  return sendEmail({ to: user.email, subject, text, html });
};

export const sendBookingConfirmationEmail = async (user, booking) => {
  const subject = 'Booking Confirmation';
  const text = `Hi ${user.name},\n\nYour booking has been confirmed!\n\nProperty: ${booking.property.title}\nCheck-in: ${booking.startDate}\nCheck-out: ${booking.endDate}\n\nBest regards,\nThe RoomRent Team`;
  const html = `
    <h1>Booking Confirmation</h1>
    <p>Hi ${user.name},</p>
    <p>Your booking has been confirmed!</p>
    <ul>
      <li>Property: ${booking.property.title}</li>
      <li>Check-in: ${booking.startDate}</li>
      <li>Check-out: ${booking.endDate}</li>
    </ul>
    <p>Best regards,<br>The RoomRent Team</p>
  `;

  return sendEmail({ to: user.email, subject, text, html });
};

export const sendPaymentConfirmation = async (payment, user, booking) => {
  const subject = 'Payment Confirmation - RoomRent';
  const text = `
    Hi ${user.name},
    
    Your payment has been received!
    
    Payment Details:
    Amount: ${payment.amount} ${payment.currency}
    Transaction ID: ${payment.transactionId}
    Date: ${new Date(payment.date).toLocaleDateString()}
    Booking Reference: ${booking._id}
    
    Thank you for choosing RoomRent!
    
    Best regards,
    The RoomRent Team
  `;

  return sendEmail({
    to: user.email,
    subject,
    text
  });
}; 