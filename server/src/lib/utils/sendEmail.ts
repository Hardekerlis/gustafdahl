import Logger from 'frictionless-logger';
import nodemailer from 'nodemailer';
import { config } from './config';

const logger = new Logger({
  message: {
    static: {
      text: 'Mailer',
    },
  },
});

// async..await is not allowed in global scope, must use a wrapper
export const sendEmail = async (recipient: string, html: string) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();

  // console.log(testAccount);

  // return;

  logger.info('Creating transporter');
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'jurrmyx4jsa6mpyt@ethereal.email', // generated ethereal user
      pass: 'Ejsb9TmKWCPADRcXjy', // generated ethereal password
    },
  });

  logger.debug('Sending mail');
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: recipient, // list of receivers
    subject: 'Hello ✔', // Subject line
    html,
  });

  if (config.dev) {
    logger.debug(`Email preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  }
};
