import { NextRequest } from 'next/server';
import ImportJob from '@/models/ImportJob';
import { importQueue } from '@/lib/queue';
import { connectToDB } from '@/lib/db';
import { z } from 'zod';

const schema = z.object({
  jobId: z.string(),
});

export const POST = async (req: NextRequest) => {
  await connectToDB();
  
  try {
    const body = await req.json();
    const { jobId } = schema.parse(body);
    
    const job = await ImportJob.findById(jobId);
    if (!job) {
      return new Response(
        JSON.stringify({ success: false, error: 'Job not found' }),
        { status: 404 }
      );
    }
    
    if (job.status !== 'paused') {
      return new Response(
        JSON.stringify({ success: false, error: 'Job is not paused' }),
        { status: 400 }
      );
    }
    
    job.status = 'running';
    job.logs.push(`Job resumed at ${new Date().toISOString()}`);
    await job.save();
    
    // Re-add to queue to continue processing
    await importQueue.add('bulk-import', {
      jobId: job._id.toString(),
      url: job.url,
      targetCategory: job.targetCategory,
      targetSubcategory: job.targetSubcategory,
      resumeFrom: job.importedCount + job.skippedCount + job.failedCount,
    });
    
    return new Response(
      JSON.stringify({ success: true, job }),
      { status: 200 }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 400 }
    );
  }
};
