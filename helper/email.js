const nodemailer =require('nodemailer');
// require("dotenv").createTransport();


//sending a mail to a particlar user/receipent by invoking options
const sendMail = async (options)=>{
    const transporter = await nodemailer.createTransport({
        service: "gmail",
        secure: false, // true for port 465, false for other ports
        auth: {
          user: "uzochukwufaustina@gmail.com",
         //generate password from gmail
          pass: process.env.pass,
        },
        tls: {
            rejectUnauthorized: false, // to bypass ssl verification
        }
      });

      //invoke the sender
      const mailOption = {
        //the email receiver
        subject:options.subject, text:options.text, to:options.email, from:"uzochukwufaustina@gmail.com", html:options.html 
     };
      await transporter.sendMail(mailOption)

      module.exports = sendMail;
}