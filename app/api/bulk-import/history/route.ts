import { NextRequest } from 'next/server';
import ImportJob from '@/models/ImportJob';
import { connectToDB } from '@/lib/db';

export const GET = async (req: NextRequest) => {
  await connectToDB();
  
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 10;
  const skip = (page - 1) * limit;
  
  const [jobs, total] = await Promise.all([
    ImportJob.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    ImportJob.countDocuments(),
  ]);
  
  return new Response(
    JSON.stringify({ success: true, jobs, total, page }),
    { status: 200 }
  );
};
