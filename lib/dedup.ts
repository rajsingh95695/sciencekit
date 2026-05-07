import Product from '@/models/Product';

export async function isDuplicate({ slug, title, url }: { slug: string, title: string, url: string }) {
  const exists = await Product.findOne({
    $or: [
      { slug },
      { title },
      { originalUrl: url },
    ],
  });
  return !!exists;
}
