import { NextRequest } from 'next/server';
import ImportJob from '@/models/ImportJob';
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
    
    if (['completed', 'cancelled', 'failed'].includes(job.status)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Job already finished' }),
        { status: 400 }
      );
    }
    
    job.status = 'cancelled';
    job.logs.push(`Job cancelled at ${new Date().toISOString()}`);
    await job.save();
    
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
