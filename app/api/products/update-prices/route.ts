import { NextRequest } from 'next/server';
import Product from '@/models/Product';
import { connectToDB } from '@/lib/db';
import { z } from 'zod';

const updateSchema = z.object({
  updates: z.array(z.object({
    id: z.string(),
    price: z.number().min(0),
  })),
});

export const POST = async (req: NextRequest) => {
  await connectToDB();
  
  try {
    const body = await req.json();
    const { updates } = updateSchema.parse(body);
    
    let updated = 0;
    
    for (const update of updates) {
      const result = await Product.updateOne(
        { _id: update.id },
        { 
          $set: { 
            price: update.price,
            discountPrice: update.price,
          } 
        }
      );
      if (result.modifiedCount > 0) updated++;
    }
    
    return new Response(
      JSON.stringify({ success: true, updated }),
      { status: 200 }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 400 }
    );
  }
};
