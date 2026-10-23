import nodemailer from 'nodemailer'

export async function sendEmail({ to, subject, text, html }) {
  const { SMTP_USER, SMTP_APP_PASSWORD } = process.env

  if (!SMTP_USER || !SMTP_APP_PASSWORD) {
    throw new Error('SMTP email configuration is missing.')
  }

  const mailer = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: SMTP_USER,
      pass: SMTP_APP_PASSWORD,
    },
  })

  return mailer.sendMail({
    from: `"MentorHub" <${SMTP_USER}>`,
    to,
    subject,
    text,
    html,
  })
}
