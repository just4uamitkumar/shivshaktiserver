//sendEmail.j
import nodemailer from "nodemailer";

//Send Email Verifiction mail
export const sendVerificationEmail = async (email, url, firstName, lastName) => {
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
    subject: "ShivShakti! Verify Your Email",
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <div style="background-color: #eb8500; color: white; padding: 5px; text-align: center;">
            <h2>Verify Your Email</h2>
          </div>
          <div style="padding: 20px;">
            <p style="font-size: 16px; margin-top:0">Hi ${firstName + ' ' + lastName},</p>
            <p style="font-size: 16px;">Please copy and paste the link below or click the Verify Email Button to verify your email. </p>
            <p><a style="display: block; padding: 10px 0;" href=${url}>${url}</a></p>
            <p style="text-align:center">
              <a href=${url} style="display: inline-block; padding: 8px 12px; background-color: #eb8500; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;
              font-family: Arial, sans-serif;">✅ Verify Email</a></p>
            <p style="margin: 25px 0 5px; font-size: 14px; color: #555;">If you didn’t request this, please ignore this email.</p>
          </div>
          <div style="background-color: #d1d1d1; text-align: center; padding: 15px; font-size: 12px; color: #2f2f2f;">
            &copy; ${new Date().getFullYear()} ShivShakti. All rights reserved.
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(message);
    console.log("Verification email sent successfully");
  } catch (err) {
    console.error("Error sending email:", err);
  }
};

//Send Cofirmation Email after email verified
export const sendConfirmationEmail = async (email, url, firstName, lastName) => {
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
    <div style="font-family: 'Segoe UI', sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <div style="background-color: #eb8500; color: white; padding: 5px; text-align: center;">
          <h2>Welcome to ShivShakti</h2>
        </div>
        <div style="padding: 20px;">
          <p style="font-size: 16px;  margin-top:0;">Hi ${firstName + ' ' + lastName},</p>
          <p style="font-size: 16px;">🎉 Your email has been successfully verified!</p>
          <p style="font-size: 16px; padding: 10px 0;">You can now log in and enjoy all the features of ShivShakti.</p>
          <p style="text-align:center;"><a href=${url} style="display: inline-block;  padding: 8px 12px; background-color: #eb8500; color: white; text-decoration: none; border-radius: 4px;">Log In Now</a></p>
          <p style="margin: 25px 0 5px; font-size: 14px; color: #555;">If you didn’t request this, please ignore this email.</p>
        </div>
        <div style="background-color: #d1d1d1; text-align: center; padding: 15px; font-size: 12px; color: #2f2f2f;">
            &copy; ${new Date().getFullYear()} ShivShakti. All rights reserved.
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

//Send forgot Password message to reset
export const sendForgotPasswordEmail = async (email, url, firstName, lastName) => {
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
  subject: "ShivShakti! Reset your password",
  html: `
    <div style="font-family: 'Segoe UI', sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <div style="background-color: #eb8500; color: white; padding: 5px; text-align: center;">
          <h2>Reset your Password</h2>
        </div>
        <div style="padding: 20px;">
          <p style="font-size: 16px; margin-top:0;">Hi ${firstName + ' ' + lastName},</p>
          <p style="font-size: 16px; padding: 10px 0;">Please copy and paste the link below or click the Reset Password Button to reset your password. </p>
          <p><a style="display: block; padding: 10px 0;" href=${url}>${url}</a></p>
          <p style="text-align:center;">
            <a href=${url} style="display: inline-block; padding: 8px 12px; background-color: #eb8500; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;
            font-family: Arial, sans-serif;">Reset Password</a>
          </p>
          <p style="margin: 25px 0 5px; font-size: 14px; color: #555;">If you didn’t request this, please ignore this email.</p>
        </div>
        <div style="background-color: #d1d1d1; text-align: center; padding: 15px; font-size: 12px; color: #2f2f2f;">
          &copy; ${new Date().getFullYear()} ShivShakti. All rights reserved.
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

//Send confirm reset Password message
export const sendPasswordResetSuccessEmail = async (email, firstName, lastName) => {
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
    subject: "ShivShakti! Your password has been changed",
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <div style="background-color: #eb8500; color: white; padding: 5px; text-align: center;">
            <h2>Password Changed Successfully</h2>
          </div>
          <div style="padding: 20px;">
            <p style="font-size: 16px; margin-top:0;">Hi ${firstName + ' ' + lastName},</p>
            <p style="font-size: 16px; padding: 10px 0;">Your password has been updated successfully. If this wasn't you, please contact support immediately.</p>
            <p style="margin: 25px 0 5px; font-size: 14px; color: #555;">Stay safe and secure,<br/>Team ShivShakti</p>
          </div>
          <div style="background-color: #d1d1d1; text-align: center; padding: 15px; font-size: 12px; color: #2f2f2f;">
            &copy; ${new Date().getFullYear()} ShivShakti. All rights reserved.
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(message);
    console.log("Password reset confirmation email sent");
  } catch (err) {
    console.error("Error sending confirmation email:", err);
  }
};
