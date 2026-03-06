import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import exphbs from 'express-handlebars';
import path from 'path';
import { SendMailOptions } from 'nodemailer';

interface HandlebarsMailOptions extends SendMailOptions {
  template: string;
  context?: Record<string, unknown>;
}

type Template = 'resetPassword' | 'verifyEmail';
type TemplateText = 'resetPasswordText' | 'verifyEmailText';

// Environment Validation
const host: string | undefined = process.env.SMTP_HOST;
const port: number = parseInt(process.env.SMTP_PORT as string, 10);
const secure: boolean = process.env.SMTP_SECURE === 'true';
const user = process.env.SMTP_USER;
const password = process.env.SMTP_PASS;
const from = process.env.SMTP_FROM;

if (!host || !port || !user || !password || !from) {
  throw new Error('SMTP configuration missing');
}

// Handlebars setup

const handlebars = exphbs.create({ extname: '.hbs', defaultLayout: false });

const hbsOptions = {
  viewEngine: handlebars,
  viewPath: path.resolve(process.cwd(), 'server/tokenServices/templates'),
  extname: '.hbs',
};

// Transporter Singleton

const transporter = nodemailer.createTransport({
  host: host,
  port: port,
  secure: secure,
  auth: {
    user: user,
    pass: password,
  },
});

transporter.use('compile', hbs(hbsOptions));

if (process.env.NODE_ENV !== 'production') {
  transporter
    .verify()
    .then(() => {
      console.log('SMTP ready');
    })
    .catch(console.error);
}

// Begin function.
export async function sendTokenEmail(
  email: string,
  firstName: string,
  resetUrl: string,
  expiresIn: number,
  template: Template,
  templateText: TemplateText,
) {
  const mailOptions: HandlebarsMailOptions = {
    from: `"Jira-Clone" <jira-clone@example.com>`,
    to: email,
    subject: 'Request to Change Password Token - JiraClone',
    template: template,
    context: { firstName, resetUrl, expiresIn },
    text: templateText,
  };

  const info = await transporter.sendMail(mailOptions as HandlebarsMailOptions);

  if (process.env.NODE_ENV !== 'production') {
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
  return {
    messageId: info.messageId,
    messageUrl: nodemailer.getTestMessageUrl(info),
  };
}
