// workers/emailWorker.js
// Processes jobs from the email queue
// Uses nodemailer — swap transport config for your email provider
'use strict'

const { Worker } = require('bullmq')
const nodemailer = require('nodemailer')
const { bullMQConnection } = require('../redis')
require('dotenv').config()

// ── Nodemailer transport ──────────────────────────────────────
// For dev: uses Ethereal (fake SMTP, inspect at ethereal.email)
// For prod: swap with your provider (Resend, SendGrid, Gmail SMTP)
async function createTransport() {
  if (process.env.NODE_ENV === 'production') {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }

  // Dev: auto-create Ethereal test account
  const testAccount = await nodemailer.createTestAccount()
  console.log('📧 Ethereal test account:', testAccount.user)
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: { user: testAccount.user, pass: testAccount.pass },
  })
}

// ── Job handlers ──────────────────────────────────────────────
async function handleNewPost(data, transport) {
  const { postTitle, postSlug, authorName } = data
  const info = await transport.sendMail({
    from: process.env.EMAIL_FROM || '"Portfolio CMS" <noreply@portfolio.dev>',
    to: process.env.NOTIFY_EMAIL || process.env.SMTP_USER,
    subject: `New post published: ${postTitle}`,
    html: `
      <h2>New post published</h2>
      <p><strong>${authorName}</strong> just published a new post.</p>
      <p><strong>${postTitle}</strong></p>
      <p><a href="${process.env.SITE_URL || 'http://localhost:3000'}/posts/${postSlug}">
        Read the post →
      </a></p>
    `,
  })
  console.log('📧 New post email sent:', nodemailer.getTestMessageUrl(info) || info.messageId)
}

async function handleContactForm(data, transport) {
  const { name, email, message } = data
  const info = await transport.sendMail({
    from: process.env.EMAIL_FROM || '"Portfolio CMS" <noreply@portfolio.dev>',
    to: process.env.NOTIFY_EMAIL || process.env.SMTP_USER,
    replyTo: email,
    subject: `Contact form message from ${name}`,
    html: `
      <h2>New contact form submission</h2>
      <p><strong>From:</strong> ${name} (${email})</p>
      <hr />
      <p>${message.replace(/\n/g, '<br>')}</p>
    `,
  })
  console.log('📧 Contact form email sent:', nodemailer.getTestMessageUrl(info) || info.messageId)
}

// ── Worker ────────────────────────────────────────────────────
async function startEmailWorker() {
  const transport = await createTransport()

  const worker = new Worker(
    'email',
    async (job) => {
      console.log(`📬 Processing email job: ${job.name} (id: ${job.id})`)

      switch (job.name) {
        case 'new-post':
          await handleNewPost(job.data, transport)
          break
        case 'contact-form':
          await handleContactForm(job.data, transport)
          break
        default:
          console.warn(`Unknown email job type: ${job.name}`)
      }
    },
    {
      connection: bullMQConnection,
      concurrency: 5,
    }
  )

  worker.on('completed', (job) => {
    console.log(`✅ Email job completed: ${job.name} (id: ${job.id})`)
  })

  worker.on('failed', (job, err) => {
    console.error(`❌ Email job failed: ${job?.name} (id: ${job?.id}) —`, err.message)
  })

  console.log('🔄 Email worker started')
  return worker
}

module.exports = { startEmailWorker }