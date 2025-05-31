import { CONFIG } from "@app/utils/config.utils";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "healthpost.central@gmail.com",
    pass: "mvhw fqxx qqpl hiio",
  },
});

type MailDetailType = {
  to: string,
  subject: string,
  text: string,
}

const sendMail = async (mailDetails: MailDetailType) => {
  await transporter.sendMail({
    from: CONFIG.MAIL,
    ...mailDetails
  });
};

export default sendMail;
