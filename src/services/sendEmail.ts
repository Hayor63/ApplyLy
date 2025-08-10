import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import config from "config";

interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  text?: string;
  fullName: string;
}


//using Mailgen
const sendEmail = async ({
  from,
  to,
  subject,
  text,
  fullName,
}: EmailOptions) => {
  let mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "ApplyLy",
      link: "https://applyLy.com",
    },
  });

  const email = {
    body: {
      name: fullName,
      intro: text || "Welcome to ApplyLy!",
      outro: "Need help? Just reply to this email, we'd love to help.",
    },
  };

  const emailBody = mailGenerator.generate(email);


//using nodemailer
  try {
   console.log("Brevo Host:", config.get<string>("brevoHost"));// Should print smtp-relay.brevo.com

    const transporter = nodemailer.createTransport({
      
      host: config.get<string>("brevoHost"),
      port: config.get<number>("brevoPort"), 
      auth: {
        user: config.get<string>("userMailLogin"),
        pass: config.get<string>("brevoMailkey"),
      },
    });

    await transporter.sendMail({
      from,
      to,
      subject,
      html: emailBody,
    });

    transporter.verify((error, success) => {
      if (error) {
        console.error("SMTP connection failed:", error);
      } else {
        console.log("SMTP connection successful:", success);
      }
    });

    return { success: true, msg: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error); // Log the error details
    return { success: false, msg: "Failed to send email" };
  }
};

export default sendEmail;
