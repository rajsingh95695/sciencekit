import { NextRequest } from 'next/server';
import ImportJob from '@/models/ImportJob';
import { connectToDB } from '@/lib/db';

export const GET = async (req: NextRequest) => {
  await connectToDB();
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get('jobId');
  if (!jobId) return new Response(JSON.stringify({ success: false, error: 'Missing jobId' }), { status: 400 });
  const job = await ImportJob.findById(jobId);
  if (!job) return new Response(JSON.stringify({ success: false, error: 'Job not found' }), { status: 404 });
  return new Response(JSON.stringify({ success: true, job }), { status: 200 });
};
