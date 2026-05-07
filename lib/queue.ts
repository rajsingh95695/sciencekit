import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');

export const importQueue = new Queue('importQueue', { connection });

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
