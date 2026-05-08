import { Queue } from 'bullmq';
import IORedis from 'ioredis';

let connection: IORedis | null = null;
let queue: Queue | null = null;

function getRedisUrl() {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    throw new Error('REDIS_URL is required to use bulk import queue features.');
  }

  return redisUrl;
}

function getConnection() {
  if (!connection) {
    connection = new IORedis(getRedisUrl(), {
      maxRetriesPerRequest: null,
    });
  }

  return connection;
}

export function getImportQueue() {
  if (!queue) {
    queue = new Queue('importQueue', { connection: getConnection() });
  }

  return queue;
}

export const importQueue = {
  add: (...args: Parameters<Queue['add']>) => getImportQueue().add(...args),
} satisfies Pick<Queue, 'add'>;

export function getRandomUserAgent() {
  const agents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    'Mozilla/5.0 (X11; Linux x86_64)',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
    'Mozilla/5.0 (Android 11; Mobile; rv:89.0)',
  ];
  return agents[Math.floor(Math.random() * agents.length)];
}

export async function randomDelay() {
  const ms = 1000 + Math.random() * 4000;
  return new Promise((res) => setTimeout(res, ms));
}
