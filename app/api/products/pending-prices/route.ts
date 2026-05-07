import { NextRequest } from 'next/server';
import Product from '@/models/Product';
import { connectToDB } from '@/lib/db';

export const GET = async (req: NextRequest) => {
  await connectToDB();
  
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const limit = 20;
  
  const query: any = {
    $or: [
      { price: null },
      { price: { $exists: false } },
      { price: 0 },
    ],
  };
  
  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }
  
  const skip = (page - 1) * limit;
  
  const [products, total] = await Promise.all([
    Product.find(query)
      .select('title slug description images brand category subcategory price originalUrl createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(query),
  ]);
  
  return new Response(
    JSON.stringify({ success: true, products, total, page }),
    { status: 200 }
  );
};
