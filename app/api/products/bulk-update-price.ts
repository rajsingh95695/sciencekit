import { NextRequest } from 'next/server';
import Product from '@/models/Product';
import { connectToDB } from '@/lib/db';

export const POST = async (req: NextRequest) => {
  await connectToDB();
  const { updates } = await req.json();
  const ids = Object.keys(updates);
  for (const id of ids) {
    await Product.findByIdAndUpdate(id, { price: Number(updates[id]) });
  }
  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
