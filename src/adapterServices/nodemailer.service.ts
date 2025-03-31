import nodemailer from "nodemailer";
import { SETTINGS } from "../settings/settings";

export const nodemailerService = {
  async sendEmail(email: string, code: string): Promise<boolean> {
    let transporter = nodemailer.createTransport({
      host: "smtp.mail.ru",
      port: 465,
      secure: true,
      auth: {
        user: SETTINGS.MAIL.EMAIL,
        pass: SETTINGS.MAIL.EMAIL_PASSWORD,
      },
    });

    let info = await transporter.sendMail({
      from: `Dmitrii <${SETTINGS.MAIL.EMAIL}>`,
      to: email,
      subject: "Your code is here",
      html: ` <h1>Thank for your registration</h1>
               <p>To finish registration please follow the link below:<br>
                  <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
              </p>`,
    });

    return !!info;
  },
};
