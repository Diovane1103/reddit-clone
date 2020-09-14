import nodemailer from "nodemailer";

export async function sendEmail(to: string, subject: string, html: string) {

  //let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "zqs756cw76qunbcy@ethereal.email", 
      pass: "CHTZGnPykdP75hpyJw",
    },
  });

  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', 
    to,
    subject: subject,
    html
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
