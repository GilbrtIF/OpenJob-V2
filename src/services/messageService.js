import amqp from 'amqplib';

const QUEUE_NAME = 'application_notifications';
let connection = null;
let channel = null;

export const initRabbitMQ = async () => {
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
      console.warn('RabbitMQ Connection Closed.');
      channel = null;
      // Opsional: bisa tambahkan setTimeout untuk reconnect
    });

    channel = await connection.createChannel();

    // Tambahan dari review: listener pada channel
    channel.on('error', (err) => {
      console.error('RabbitMQ Channel Error:', err.message);
    });

    channel.on('close', () => {
      console.warn('RabbitMQ Channel Closed.');
      channel = null;
    });

    await channel.assertQueue(QUEUE_NAME, { durable: true });
    console.log('✅ Publisher terhubung ke RabbitMQ.');
  } catch (error) {
    console.error('❌ Gagal terhubung ke RabbitMQ:', error.message);
    if (connection) await connection.close();
    channel = null;
  }
};

initRabbitMQ();

export const publishApplicationNotification = async (applicationId) => {
  try {
    if (!channel) {
      console.warn('RabbitMQ belum siap. Pesan tidak dikirim.');
      return;
    }

    const payload = JSON.stringify({ application_id: applicationId });

    channel.sendToQueue(QUEUE_NAME, Buffer.from(payload), {
      persistent: true,
    });

    console.log(`📤 Pesan terkirim untuk lamaran: ${applicationId}`);
  } catch (error) {
    console.error('❌ Gagal mengirim pesan:', error.message);
  }
};