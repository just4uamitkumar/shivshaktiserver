//sendEmail.j
import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, url) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail", // or use SMTP config
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // for dev mode
  // const transporter = nodemailer.createTransport({
  //   host: "smtp.mailtrap.io",
  //   port: 2525,
  //   auth: {
  //     user: process.env.MAILTRAP_USER,
  //     pass: process.env.MAILTRAP_PASS,
  //   },
  // });


  const message = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: "Verify Your Email for ShivShakti",
    html: `<p>Please copy and paste the link below or hit the Verify Email Button  to verify your email:</p>
          <p><a href="${url}">${url}</a></p
          <p><a href="${url}" style="
        display: inline-block;
        padding: 10px 20px;
        background-color: #eb8500;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
        font-family: Arial, sans-serif;
      ">
        ✅ Verify Email
      </a></p>`,
  };

  try {
    await transporter.sendMail(message);
    console.log("Verification email sent successfully");
  } catch (err) {
    console.error("Error sending email:", err);
  }
};


export const sendConfirmationEmail = async (email, firstName, lastName) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const message = {
  from: process.env.SMTP_EMAIL,
  to: email,
  subject: "✅ You're Verified — Welcome to ShivShakti!",
  html: `
    <div style="font-family: 'Segoe UI', sans-serif; background-color: #f9f9f9; padding: 30px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <div style="background-color: #eb8500; color: white; padding: 20px; text-align: center;">
          <h2>Welcome to ShivShakti</h2>
        </div>
        <div style="padding: 30px;">
          <p style="font-size: 16px;">Hi ${firstName + ' ' + lastName},</p>
          <p style="font-size: 16px;">🎉 Your email has been successfully verified!</p>
          <p style="font-size: 16px;">You can now log in and enjoy all the features of ShivShakti.</p>
          <a href="http://localhost:5173/" style="display: inline-block; margin-top: 20px; padding: 12px 20px; background-color: #eb8500; color: white; text-decoration: none; border-radius: 4px;">Log In Now</a>
          <p style="margin-top: 30px; font-size: 14px; color: #555;">If you didn’t request this, please ignore this email.</p>
        </div>
        <div style="background-color: #f1f1f1; text-align: center; padding: 15px; font-size: 12px; color: #777;">
          © ${new Date().getFullYear()} ShivShakti. All rights reserved.
        </div>
      </div>
    </div>
  `,
};


  try {
    await transporter.sendMail(message);
    console.log("Confirmation email sent successfully");
  } catch (err) {
    console.error("Error sending confirmation email:", err);
  }
};
