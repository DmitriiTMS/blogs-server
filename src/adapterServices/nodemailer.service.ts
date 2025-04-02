import nodemailer from "nodemailer";
import { SETTINGS } from "../settings/settings";

export const nodemailerService = {
  async sendEmail(email: string, code: string, template: (code: string) => string): Promise<boolean> {
    let transporter = nodemailer.createTransport({
      host: "smtp.mail.ru",
      port: 465,
      secure: true,
      auth: {
        user: SETTINGS.MAIL.EMAIL,
        pass: SETTINGS.MAIL.EMAIL_PASSWORD,
      },
      tls: {
        // Важные настройки для Mail.ru
        rejectUnauthorized: false, // Только для тестов! В продакшене должно быть true
        minVersion: "TLSv1.2",
        ciphers: 'SSLv3'
      },
    });

    let info = await transporter.sendMail({
      from: `Dmitrii <${SETTINGS.MAIL.EMAIL}>`,
      to: email,
      subject: "Your code is here",
      html: template(code),
    });

    return !!info;
  },
  // async sendEmailResending(email: string, code: string): Promise<boolean> {
  //   let transporter = nodemailer.createTransport({
  //     host: "smtp.mail.ru",
  //     port: 465,
  //     secure: true,
  //     auth: {
  //       user: SETTINGS.MAIL.EMAIL,
  //       pass: SETTINGS.MAIL.EMAIL_PASSWORD,
  //     },
  //   });

  //   let info = await transporter.sendMail({
  //     from: `Dmitrii <${SETTINGS.MAIL.EMAIL}>`,
  //     to: email,
  //     subject: "Your code is here",
  //     html: `<h1>Password recovery</h1>
  //       <p>To finish password recovery please follow the link below:
  //           <a href='https://some-front.com/confirm-registration?code=${code}'>recovery password</a>
  //       </p>`,
  //   });

  //   return !!info;
  // },
};
