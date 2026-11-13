import 'dotenv/config';
import amqp from 'amqplib';
import nodemailer from 'nodemailer';
import pool from './config/database.js';

const QUEUE_NAME = 'application_notifications';

// ==================================
// PERBAIKAN 3: VALIDASI ENVIRONMENT DI AWAL
// ==================================
const requiredEnvVars = [
  'RABBITMQ_HOST', 'RABBITMQ_PORT', 'RABBITMQ_USER', 'RABBITMQ_PASSWORD',
  'MAIL_HOST', 'MAIL_PORT', 'MAIL_USER', 'MAIL_PASSWORD',
  'PGUSER', 'PGDATABASE'
];

const missingEnvVars = requiredEnvVars.filter((env) => !process.env[env]);
if (missingEnvVars.length > 0) {
  console.error('❌ Variabel environment berikut belum diisi di .env:');
  console.error(`   ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

// Setup Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: Number(process.env.MAIL_PORT) === 465,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

let connection = null;
let channel = null;

// ==================================
// PERBAIKAN 1: FLAG UNTUK SHUTDOWN
// ==================================
let isShuttingDown = false;

const startConsumer = async () => {
  try {
    connection = await amqp.connect({
      hostname: process.env.RABBITMQ_HOST,
      port: Number(process.env.RABBITMQ_PORT),
      username: process.env.RABBITMQ_USER,
      password: process.env.RABBITMQ_PASSWORD,
    });

    connection.on('error', (err) => {
      console.error('RabbitMQ Connection Error:', err.message);
    });

    connection.on('close', () => {
      console.warn('RabbitMQ Connection Closed. Consumer berhenti.');
      // Jangan matikan paksa jika proses sedang shutdown dengan rapi
      if (isShuttingDown) return;
      process.exit(1);
    });

    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    channel.prefetch(1);

    channel.on('error', (err) => {
      console.error('RabbitMQ Channel Error:', err.message);
    });

    console.log('⏳ Consumer terhubung. Menunggu pesan...');

    channel.consume(QUEUE_NAME, async (message) => {
      if (message === null) return;

      let applicationId;
      try {
        const payload = JSON.parse(message.content.toString());
        applicationId = payload.application_id;

        if (typeof applicationId !== 'string') {
          throw new Error('application_id bukan string');
        }
      } catch (error) {
        console.error('❌ Pesan rusak/ditolak:', error.message);
        channel.ack(message);
        return;
      }

      try {
        const query = `
          SELECT
            a.id, a.created_at,
            applicant.name  AS applicant_name,
            applicant.email AS applicant_email,
            j.title         AS job_title,
            owner.email     AS owner_email
          FROM applications AS a
          INNER JOIN users AS applicant ON applicant.id = a.user_id
          INNER JOIN jobs  AS j         ON j.id = a.job_id
          LEFT  JOIN users AS owner     ON owner.id = j.owner_id
          WHERE a.id = $1
        `;
        const result = await pool.query(query, [applicationId]);

        if (result.rowCount === 0) {
          console.warn(`⚠️ Lamaran ${applicationId} tidak ditemukan. Pesan dibuang.`);
          channel.ack(message);
          return;
        }

        const data = result.rows[0];

        if (!data.owner_email) {
          console.warn(`⚠️ Job ${data.job_title} tidak punya owner email. Pesan dibuang.`);
          channel.ack(message);
          return;
        }

        const tanggal = new Date(data.created_at).toLocaleString('id-ID', {
          dateStyle: 'full',
          timeStyle: 'short',
        });

        // ==================================
        // PERBAIKAN 2: FALLBACK MAIL_FROM
        // ==================================
        const fromAddress = process.env.MAIL_FROM || process.env.MAIL_USER;

        const mailOptions = {
          from: `"OpenJob Notifications" <${fromAddress}>`,
          to: data.owner_email,
          subject: `Lamaran Baru untuk: ${data.job_title}`,
          text: `Halo,\n\nAda lamaran baru untuk pekerjaan "${data.job_title}".\n\nDetail Pelamar:\n- Nama: ${data.applicant_name}\n- Email: ${data.applicant_email}\n- Tanggal Melamar: ${tanggal}\n\nSilakan cek dashboard Anda untuk informasi lebih lanjut.\n\nSalam,\nOpenJob Team`,
        };

        console.log(`📧 Mengirim email ke ${data.owner_email}...`);
        await transporter.sendMail(mailOptions);
        channel.ack(message);
        console.log(`✅ Email terkirim dan pesan ${applicationId} di-ack.`);

      } catch (error) {
        console.error(`❌ Gagal memproses lamaran ${applicationId}:`, error.message);
        console.log('⏳ Mencoba ulang dalam 5 detik...');
        setTimeout(() => {
          channel.nack(message, false, true);
        }, 5000);
      }
    });

  } catch (error) {
    console.error('❌ Gagal memulai consumer:', error.message);
    process.exit(1);
  }
};

// ==================================
// GRACEFUL SHUTDOWN (Diperbarui)
// ==================================
const shutdown = async () => {
  if (isShuttingDown) return;
  isShuttingDown = true; // Set flag agar handler 'close' tidak memicu process.exit(1)

  console.log('\nMematikan consumer dengan rapi...');
  try {
    if (channel) await channel.close();
    if (connection) await connection.close();
    await pool.end();
  } catch (error) {
    console.error('Error saat shutdown:', error.message);
  } finally {
    process.exit(0); // Keluar dengan sukses
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

startConsumer();