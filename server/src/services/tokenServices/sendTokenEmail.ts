import nodemailer from 'nodemailer';
import { create } from 'express-handlebars';
import path from 'path';
import { SendMailOptions } from 'nodemailer';

interface HandlebarsMailOptions extends SendMailOptions {
  template: string;
  context?: Record<string, unknown>;
}

import {
  HbsType,
  HbsTextType,
} from '../../utilities/tokenUtilities/emailTypeMap';

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

const handlebars = create({ extname: '.hbs', defaultLayout: false });

const hbsOptions = {
  viewEngine: handlebars,
  viewPath: path.resolve(__dirname, '../../tokenServices/templates'),
  extname: '.hbs',
};

// Transporter Singleton

let handlebarsInitialized = false;

async function initializeHandlebars() {
  if (handlebarsInitialized) return;

  const { default: hbs } = await import('nodemailer-express-handlebars');

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

  handlebarsInitialized = true;
  return transporter;
}

// Begin function.
export async function sendTokenEmail(
  email: string,
  firstName: string,
  link: string,
  expiresIn: number,
  template: HbsType,
  templateText: HbsTextType,
) {
  const transporter = await initializeHandlebars();

  if (!transporter) {
    throw new Error('Transporter was not initialized');
  }

  const mailOptions: HandlebarsMailOptions = {
    from: from,
    to: email,
    subject: 'Request to Change Password Token - JiraClone',
    template: template,
    context: { firstName, link, expiresIn },
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
