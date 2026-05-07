import { NextRequest } from 'next/server';
import Product from '@/models/Product';
import { connectToDB } from '@/lib/db';

export const GET = async (req: NextRequest) => {
  await connectToDB();
  const { searchParams } = new URL(req.url);
  const pricePending = searchParams.get('pricePending');
  let filter = {};
  if (pricePending) {
    filter = { $or: [ { price: null }, { price: { $exists: false } } ] };
  }
  const products = await Product.find(filter).lean();
  return new Response(JSON.stringify({ products }), { status: 200 });
};
