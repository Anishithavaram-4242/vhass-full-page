import { createTransport } from "nodemailer";



const buildTransport = () => {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER || process.env.Gmail;
  const pass = process.env.SMTP_PASS || process.env.Password;

  const looksPlaceholder = (val) => !val || /your-.*password|your-email|example\.com/i.test(String(val));
  const devMode = (process.env.NODE_ENV || 'development') !== 'production';
  if (devMode && (looksPlaceholder(user) || looksPlaceholder(pass))) {
    console.warn("Using mock email transport (jsonTransport) due to missing/placeholder SMTP creds in dev mode.");
    return createTransport({ jsonTransport: true });
  }

  if (!user || !pass) {
    console.warn("Email credentials missing. Using jsonTransport for development.");
    return createTransport({ jsonTransport: true });
  }

  const secure = port === 465;
  return createTransport({ host, port, secure, auth: { user, pass } });
};

const fromAddress = () => (process.env.SMTP_USER || process.env.Gmail || "no-reply@vhassacademy.com");

const sendMail = async (email, subject, data) => {
  console.log("Setting up email transport");
  const transport = buildTransport();

  console.log("Email transport configured");
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        h1 {
            color: red;
        }
        p {
            margin-bottom: 20px;
            color: #666;
        }
        .otp {
            font-size: 36px;
            color: #7b68ee; /* Purple text */
            margin-bottom: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>OTP Verification</h1>
        <p>Hello ${data.name} your (One-Time Password) for your account verification is.</p>
        <p class="otp">${data.otp}</p> 
    </div>
</body>
</html>
`;

  try {
    console.log("Sending email to:", email);
    await transport.sendMail({
      from: fromAddress(),
      to: email,
      subject,
      html,
    });
    console.log("Email sent successfully to:", email);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export default sendMail;

export const sendForgotMail = async (subject, data) => {
  const transport = buildTransport();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f3f3f3;
      margin: 0;
      padding: 0;
    }
    .container {
      background-color: #ffffff;
      padding: 20px;
      margin: 20px auto;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      max-width: 600px;
    }
    h1 {
      color: #5a2d82;
    }
    p {
      color: #666666;
    }
    .button {
      display: inline-block;
      padding: 15px 25px;
      margin: 20px 0;
      background-color: #5a2d82;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-size: 16px;
    }
    .footer {
      margin-top: 20px;
      color: #999999;
      text-align: center;
    }
    .footer a {
      color: #5a2d82;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Reset Your Password</h1>
    <p>Hello,</p>
    <p>You have requested to reset your password. Please click the button below to reset your password.</p>
    <a href="${process.env.FRONTEND_URL}/reset-password/${data.token}" class="button">Reset Password</a>
    <p>If you did not request this, please ignore this email.</p>
    <div class="footer">
      <p>Thank you,<br>Your Website Team</p>
      <p><a href="https://vhass.in">vhass.in</a></p>
    </div>
  </div>
</body>
</html>
`;
  
  await transport.sendMail({
    from: fromAddress(),
    to: data.email,
    subject,
    html,
  });
};

export const sendContactMail = async (data) => {
  const transport = buildTransport();

  const { name, email, message } = data || {};

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New contact message</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f6f6f6; margin: 0; padding: 0; }
    .container { background-color: #ffffff; padding: 20px; margin: 20px auto; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.08); max-width: 640px; }
    h1 { color: #5a2d82; font-size: 20px; }
    p { color: #333; line-height: 1.6; }
    .meta { color: #666; font-size: 14px; }
    .msg { white-space: pre-wrap; background:#faf7ff; border-left: 4px solid #5a2d82; padding: 12px; border-radius: 6px; }
  </style>
  </head>
  <body>
    <div class="container">
      <h1>New contact message from vhass.in</h1>
      <p class="meta"><strong>Name:</strong> ${name || "-"}</p>
      <p class="meta"><strong>Email:</strong> ${email || "-"}</p>
      <p class="meta"><strong>Received:</strong> ${new Date().toLocaleString()}</p>
      <p><strong>Message:</strong></p>
      <div class="msg">${(message || "").replace(/</g, "&lt;")}</div>
    </div>
  </body>
</html>`;

  await transport.sendMail({
    from: fromAddress(),
    to: "info@vhassacademy.com",
    subject: `New contact message from ${name || email || "Website"}`,
    replyTo: email,
    html,
  });
};

// Send acknowledgement email back to the sender of the contact form
export const sendContactAck = async (data) => {
  const transport = buildTransport();

  const { name, email } = data || {};
  if (!email) return; // nothing to do

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>We received your message</title>
  <style>
    body{font-family:Arial, sans-serif;background:#f6f6f6;margin:0;padding:0}
    .container{background:#ffffff;max-width:640px;margin:20px auto;padding:24px;border-radius:8px;box-shadow:0 2px 6px rgba(0,0,0,0.08)}
    h1{color:#5a2d82;font-size:22px;margin:0 0 12px}
    p{color:#333;line-height:1.6;margin:0 0 12px}
    .footer{margin-top:20px;color:#777;text-align:center;font-size:13px}
  </style>
  </head>
  <body>
    <div class="container">
      <h1>Thanks${name ? `, ${name}` : ''} — we received your message</h1>
      <p>Our team at VHASS Academy has received your inquiry. We typically reply within 24–48 hours.</p>
      <p>If you didn’t submit this request, please ignore this email.</p>
      <div class="footer">
        <p>✉️ info@vhassacademy.com</p>
        <p>📞 +91 8985380266</p>
      </div>
    </div>
  </body>
</html>`;

  await transport.sendMail({
    from: fromAddress(),
    to: email,
    subject: "We received your message — VHASS Academy",
    html,
  });
};

export const sendTransactMailAdmin = async (subject, data) => {
  const transport = buildTransport();

  const primaryEmail = "vhass0310@gmail.com";
  const bccEmails = ["info@vhassacademy.com", "kandregulanuraj@gmail.com"];

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New purchase</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f3f3f3;
      margin: 0;
      padding: 0;
    }
    .container {
      background-color: #ffffff;
      padding: 20px;
      margin: 20px auto;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      max-width: 600px;
    }
    h1 {
      color: #5a2d82;
    }
    p {
      color: #666666;
    }
    .button {
      display: inline-block;
      padding: 15px 25px;
      margin: 20px 0;
      background-color: #5a2d82;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-size: 16px;
    }
    .footer {
      margin-top: 20px;
      color: #999999;
      text-align: center;
    }
    .footer a {
      color: #5a2d82;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${subject}</h1>
    <p>Name : ${data.name}</p>
    <p>Email : ${data.email}</p>
    <p>Item name : ${data.course}</p>
    <p>TRANSACTION ID : ${data.txnid}</p>
    <p>Payment Status : ${data.stat}</p>
    <p>Date & Time : ${data.time}</p>
    <div class="footer">
      <p>Thank you,<br>Your Website Team</p>
      <p><a href="https://vhass.in">vhass.in</a></p>
    </div>
  </div>
</body>
</html>
`;

  await transport.sendMail({
    from: fromAddress(),
    to: primaryEmail,
    bcc: bccEmails,
    subject,
    html,
  });
};

export const sendTransactMailUser = async (subject, data) => {
  const transport = buildTransport();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f3f3f3;
      margin: 0;
      padding: 0;
    }
    .container {
      background-color: #ffffff;
      padding: 20px;
      margin: 20px auto;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      max-width: 600px;
    }
    h1 {
      color: #5a2d82;
    }
    p {
      color: #666666;
    }
    .button {
      display: inline-block;
      padding: 15px 25px;
      margin: 20px 0;
      background-color: #5a2d82;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-size: 16px;
    }
    .footer {
      margin-top: 20px;
      color: #999999;
      text-align: center;
    }
    .footer a {
      color: #5a2d82;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${subject}</h1>
    <p>Name : ${data.name}</p>
    <p>Item name : ${data.course}</p>
    <p>TRANSACTION ID : ${data.txnid}</p>
    <p>Payment Status : ${data.stat}</p>
    <p>Date & Time : ${data.time}</p>
    <div class="footer">
      <p>Thank you,<br>Vhass</p>
      <p>✉️ info@vhassacademy.com</p>
      <p>📞 +91 8985320226</p>
      <p><a href="https://vhass.in">vhass.in</a></p>
    </div>
  </div>
</body>
</html>
`;

  await transport.sendMail({
    from: fromAddress(),
    to: data.email,
    subject,
    html,
  });
};
