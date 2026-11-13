
import redisClient from '../config/redis.js';

const CACHE_TTL = 3600;

// ==================================
// GET CACHE
// ==================================
export const get = async (key) => {
  try {
    // Jika Redis belum siap, anggap cache miss.
    if (!redisClient.isReady) {
      return null;
    }

    const cachedData = await redisClient.get(key);

    if (cachedData === null) {
      return null;
    }

    try {
      return JSON.parse(cachedData);
    } catch (parseError) {
      // Hapus cache yang JSON-nya rusak.
      await redisClient.del(key);
      return null;
    }
  } catch (error) {
    console.warn(
      `Redis GET gagal untuk key ${key}:`,
      error.message
    );

    return null;
  }
};

// ==================================
// SET CACHE
// ==================================
export const set = async (key, value) => {
  try {
    // Jika Redis belum siap, jangan menggagalkan API.
    if (!redisClient.isReady) {
      return false;
    }

    await redisClient.set(
      key,
      JSON.stringify(value),
      {
        EX: CACHE_TTL,
      }
    );

    return true;
  } catch (error) {
    console.warn(
      `Redis SET gagal untuk key ${key}:`,
      error.message
    );

    return false;
  }
};

// ==================================
// DELETE CACHE
// ==================================
export const del = async (...keys) => {
  try {
    const validKeys = keys.filter(
      (key) => typeof key === 'string' && key.length > 0
    );

    if (validKeys.length === 0 || !redisClient.isReady) {
      return 0;
    }

    return await redisClient.del(validKeys);
  } catch (error) {
    console.warn(
      'Redis DELETE gagal:',
      error.message
    );

    return 0;
  }
};
