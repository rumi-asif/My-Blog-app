import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@nextgenblog.com',
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''),
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #0ea5e9;">Welcome to NextGen Blog!</h1>
      <p>Hi ${name},</p>
      <p>Thank you for joining our community of writers and readers.</p>
      <p>Start exploring amazing content or share your own stories with the world.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px;">
        Get Started
      </a>
      <p style="margin-top: 30px; color: #666; font-size: 14px;">
        Best regards,<br>The NextGen Blog Team
      </p>
    </div>
  `;
  
  return sendEmail({
    to: email,
    subject: 'Welcome to NextGen Blog',
    html,
  });
}

export async function sendNewsletterEmail(email: string, subject: string, content: string) {
  return sendEmail({
    to: email,
    subject,
    html: content,
  });
}

export async function sendNotificationEmail(email: string, notification: {
  title: string;
  message: string;
  link?: string;
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0ea5e9;">${notification.title}</h2>
      <p>${notification.message}</p>
      ${notification.link ? `
        <a href="${notification.link}" style="background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px;">
          View Details
        </a>
      ` : ''}
    </div>
  `;
  
  return sendEmail({
    to: email,
    subject: notification.title,
    html,
  });
}

