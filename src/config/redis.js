
import { createClient } from 'redis';

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT || 6379),
  },

  // Jangan antrekan command ketika koneksi terputus.
  // Cache akan dilewati dan aplikasi menggunakan PostgreSQL.
  disableOfflineQueue: true,
});

// Wajib memasang error listener agar error Redis
// tidak menjadi unhandled EventEmitter error.
redisClient.on('error', (error) => {
  console.error('Redis Client Error:', error.message);
});

// Log ketika Redis sudah siap menerima command.
redisClient.on('ready', () => {
  console.log('Redis terhubung');
});

redisClient.on('reconnecting', () => {
  console.log('Redis mencoba menghubungkan ulang...');
});

// Koneksi dijalankan tanpa memblokir startup Express.
// node-redis akan mencoba reconnect secara otomatis.
const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error(
      'Redis belum tersedia. Aplikasi tetap berjalan menggunakan database:',
      error.message
    );
  }
};

void connectRedis();

export default redisClient;
