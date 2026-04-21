import nodemailer from 'nodemailer'

/*
  WHY a service file?
  
  The email logic is complex.
  We do not want this inside the controller.
  
  Controller = decides WHAT to do
  Service    = knows HOW to do it
  
  Controller says: "send an email about this message"
  Service says: "ok I will connect to Gmail, format it, send it"
  
  This separation means:
  - Easy to test each part separately
  - Easy to switch from Gmail to SendGrid later
  - Controller stays clean and simple
*/

// ========================
// EMAIL TEMPLATES
// ========================

/*
  We write emails in HTML.
  This makes them look professional in the inbox.
  
  The template function takes data and returns HTML string.
  We use template literals (backticks) for multi-line strings.
*/

interface ContactEmailData {
  name:    string
  email:   string
  subject: string
  message: string
  id:      string
}

// Email YOU receive when someone contacts you
function buildNotificationEmail(data: ContactEmailData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Message</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #0a0a0f;
      color: #e2e8f0;
      padding: 40px 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #111118;
      border-radius: 16px;
      border: 1px solid #1e1e2e;
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #7c3aed, #3b82f6);
      padding: 32px;
      text-align: center;
    }
    .header h1 {
      font-size: 24px;
      font-weight: 700;
      color: white;
      margin-bottom: 4px;
    }
    .header p {
      color: rgba(255,255,255,0.8);
      font-size: 14px;
    }
    .body { padding: 32px; }
    .field {
      margin-bottom: 20px;
      padding: 16px;
      background: #0a0a0f;
      border-radius: 10px;
      border: 1px solid #1e1e2e;
    }
    .field-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #7c3aed;
      margin-bottom: 6px;
    }
    .field-value {
      font-size: 15px;
      color: #e2e8f0;
      line-height: 1.6;
    }
    .message-field .field-value {
      white-space: pre-wrap;
    }
    .reply-btn {
      display: block;
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, #7c3aed, #3b82f6);
      color: white;
      text-align: center;
      text-decoration: none;
      border-radius: 10px;
      font-weight: 600;
      font-size: 15px;
      margin-top: 24px;
    }
    .footer {
      padding: 20px 32px;
      border-top: 1px solid #1e1e2e;
      text-align: center;
      font-size: 12px;
      color: #4a5568;
    }
    .id-badge {
      font-family: monospace;
      font-size: 11px;
      color: #4a5568;
      margin-top: 8px;
    }
  </style>
</head>
<body>
  <div class="container">

    <div class="header">
      <h1>📬 New Message!</h1>
      <p>Someone contacted you through your portfolio</p>
    </div>

    <div class="body">

      <div class="field">
        <div class="field-label">From</div>
        <div class="field-value">${data.name}</div>
      </div>

      <div class="field">
        <div class="field-label">Email</div>
        <div class="field-value">
          <a href="mailto:${data.email}" style="color: #7c3aed;">
            ${data.email}
          </a>
        </div>
      </div>

      <div class="field">
        <div class="field-label">Subject</div>
        <div class="field-value">${data.subject}</div>
      </div>

      <div class="field message-field">
        <div class="field-label">Message</div>
        <div class="field-value">${data.message}</div>
      </div>

      <a href="mailto:${data.email}?subject=Re: ${data.subject}" class="reply-btn">
        Reply to ${data.name} →
      </a>

    </div>

    <div class="footer">
      <p>Sent from your portfolio contact form</p>
      <p class="id-badge">Message ID: ${data.id}</p>
    </div>

  </div>
</body>
</html>
  `
}

// Auto-reply email the SENDER receives
function buildAutoReplyEmail(name: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Message Received</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #0a0a0f;
      color: #e2e8f0;
      padding: 40px 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #111118;
      border-radius: 16px;
      border: 1px solid #1e1e2e;
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #7c3aed, #3b82f6);
      padding: 40px 32px;
      text-align: center;
    }
    .emoji { font-size: 48px; margin-bottom: 16px; }
    .header h1 {
      font-size: 26px;
      font-weight: 700;
      color: white;
      margin-bottom: 8px;
    }
    .header p { color: rgba(255,255,255,0.8); font-size: 15px; }
    .body { padding: 32px; }
    .body p {
      font-size: 15px;
      line-height: 1.7;
      color: #a0aec0;
      margin-bottom: 16px;
    }
    .highlight {
      color: #7c3aed;
      font-weight: 600;
    }
    .info-box {
      background: #0a0a0f;
      border: 1px solid #1e1e2e;
      border-left: 3px solid #7c3aed;
      border-radius: 10px;
      padding: 16px 20px;
      margin: 20px 0;
    }
    .info-box p {
      margin: 0;
      font-size: 14px;
      color: #a0aec0;
    }
    .footer {
      padding: 20px 32px;
      border-top: 1px solid #1e1e2e;
      text-align: center;
      font-size: 12px;
      color: #4a5568;
    }
  </style>
</head>
<body>
  <div class="container">

    <div class="header">
      <div class="emoji">✅</div>
      <h1>Message Received!</h1>
      <p>Thank you for reaching out, ${name}</p>
    </div>

    <div class="body">
      <p>
        Hi <span class="highlight">${name}</span>,
      </p>
      <p>
        Thank you for contacting me! I have received your message
        and will get back to you as soon as possible.
      </p>

      <div class="info-box">
        <p>⏱️ Expected response time: <strong>within 24 hours</strong></p>
      </div>

      <p>
        In the meantime, feel free to check out my work on GitHub
        or connect with me on LinkedIn.
      </p>

      <p>
        Talk soon,<br>
        <span class="highlight">Your Name</span>
      </p>
    </div>

    <div class="footer">
      <p>This is an automated reply — please do not reply to this email.</p>
      <p style="margin-top: 8px;">
        You contacted me through my portfolio website.
      </p>
    </div>

  </div>
</body>
</html>
  `
}

// ========================
// TRANSPORTER
// The connection to Gmail SMTP
// ========================

/*
  Transporter = the "mail truck"
  We configure it once and reuse it.
  
  host: smtp.gmail.com = Gmail's outgoing mail server
  port: 587 = the standard port for "STARTTLS" (encrypted)
  secure: false = we start plain then upgrade to encrypted
  auth: your Gmail credentials
*/

let transporter: nodemailer.Transporter | null = null

function getTransporter(): nodemailer.Transporter {
  // Return existing transporter if already created
  if (transporter) return transporter

  transporter = nodemailer.createTransport({
    host:   'smtp.gmail.com',
    port:   587,
    secure: false,   // true for port 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      // Do not fail on invalid certs in development
      rejectUnauthorized: process.env.NODE_ENV === 'production',
    },
  })

  return transporter
}

// ========================
// EMAIL FUNCTIONS
// ========================

export interface SendContactEmailParams {
  id:      string
  name:    string
  email:   string
  subject: string
  message: string
}

/*
  sendContactEmails sends TWO emails:
  
  1. Notification to YOU
     "Hey, someone contacted you!"
     
  2. Auto-reply to SENDER
     "Hi John, I got your message!"
  
  We send both at the same time using Promise.all
  so we do not wait for one before starting the other.
*/
export async function sendContactEmails(
  data: SendContactEmailParams,
): Promise<void> {
  const mail = getTransporter()

  const [notificationResult, autoReplyResult] = await Promise.all([

    // Email 1: Notification to YOU
    mail.sendMail({
      from:    process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to:      process.env.EMAIL_TO   || process.env.EMAIL_USER,
      // Reply-to = when YOU click reply in your email app
      // it replies to the SENDER, not to yourself
      replyTo: `${data.name} <${data.email}>`,
      subject: `📬 New message: ${data.subject}`,
      html:    buildNotificationEmail(data),

      // Plain text fallback for email clients that don't support HTML
      text: `
New contact message from ${data.name} (${data.email})

Subject: ${data.subject}

Message:
${data.message}

---
Message ID: ${data.id}
      `.trim(),
    }),

    // Email 2: Auto-reply to SENDER
    mail.sendMail({
      from:    process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to:      `${data.name} <${data.email}>`,
      subject: `✅ Message received — I will reply soon!`,
      html:    buildAutoReplyEmail(data.name),
      text: `
Hi ${data.name},

Thank you for contacting me! I have received your message
and will get back to you within 24 hours.

Talk soon,
Your Name
      `.trim(),
    }),
  ])

  console.log(`📧 Notification sent: ${notificationResult.messageId}`)
  console.log(`📧 Auto-reply sent:   ${autoReplyResult.messageId}`)
}

// Test the email connection
// Call this on server startup to verify credentials work
export async function verifyEmailConnection(): Promise<boolean> {
  try {
    const mail = getTransporter()
    await mail.verify()
    console.log('✅ Email service connected (Gmail SMTP)')
    return true
  } catch (error) {
    console.warn('⚠️  Email service unavailable:', (error as Error).message)
    console.warn('   Contact form will save to DB but not send emails')
    return false
  }
}
