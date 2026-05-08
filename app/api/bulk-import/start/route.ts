import { NextRequest } from 'next/server';
import { z } from 'zod';
import { importQueue } from '@/lib/queue';
import ImportJob from '@/models/ImportJob';
import { connectToDB } from '@/lib/db';

const schema = z.object({
  url: z.string().url(),
  targetCategory: z.string(),
  targetSubcategory: z.string().optional(),
});

export const POST = async (req: NextRequest) => {
  await connectToDB();
  const body = await req.json();
  const { url, targetCategory, targetSubcategory } = schema.parse(body);

  // Create ImportJob in DB
  const jobDoc = await ImportJob.create({
    url,
    targetCategory,
    targetSubcategory,
    status: 'running',
    logs: [],
  });

  try {
    // Add job to queue
    await importQueue.add('bulk-import', {
      jobId: jobDoc._id.toString(),
      url,
      targetCategory,
      targetSubcategory,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to enqueue import job';

    jobDoc.status = 'failed';
    jobDoc.logs.push(message);
    await jobDoc.save();

    return new Response(JSON.stringify({ success: false, error: message }), { status: 503 });
  }

  return new Response(JSON.stringify({ success: true, jobId: jobDoc._id }), { status: 200 });
};
