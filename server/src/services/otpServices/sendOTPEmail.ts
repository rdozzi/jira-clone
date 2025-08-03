import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Ethereal email info:
const user = process.env.ETHEREAL_USER;
const password = process.env.ETHEREAL_PASS;

export async function sendOTPEmail(email: string, otp: string) {
  let transporter;
  try {
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: user,
        pass: password,
      },
    });

    await transporter.verify();

    const info = await transporter.sendMail({
      from: '"Jira-Clone" <jira-clone@example.com>',
      to: email,
      subject: 'Your OTP from Jira-Clone is attached', // Subject line
      text: `Here is your OTP: ${otp}`, // plain text body
      html: `<b>Here is your OTP: <strong>${otp}</strong></b>`, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    return info.messageId;
  } catch (error) {
    console.error('Email transaction failed', error);
  } finally {
    if (transporter) {
      transporter.close();
    }
  }
}
