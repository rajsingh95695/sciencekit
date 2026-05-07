"use client";
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface Product {
  _id: string;
  title: string;
  price: number | null;
}

export default function PriceEditor() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch('/api/products?pricePending=1');
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await fetch('/api/products/bulk-update-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates: editing }),
      });
      toast.success('Prices updated!');
      fetchProducts();
      setEditing({});
    } catch (err) {
      toast.error('Failed to update prices.');
    }
    setLoading(false);
  };

  return (
    <Card className="max-w-2xl mx-auto my-10">
      <CardHeader>
        <CardTitle>Bulk Price Editor</CardTitle>
        <CardDescription>Set prices for products with pending prices</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {products.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No products with pending prices found.</p>
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <div key={product._id} className="flex items-center gap-3 border rounded-lg p-3">
                <div className="flex-1">
                  <p className="font-medium text-sm">{product.title}</p>
                  <p className="text-xs text-gray-500">
                    {product.price ? `Current: ₹${product.price}` : <span className="text-orange-600 font-semibold">Pending</span>}
                  </p>
                </div>
                <Input
                  type="number"
                  placeholder="₹ Price"
                  value={editing[product._id] ?? ''}
                  onChange={e => setEditing({ ...editing, [product._id]: e.target.value })}
                  className="w-24"
                />
              </div>
            ))}
          </div>
        )}
        <Button
          onClick={handleSave}
          disabled={Object.keys(editing).length === 0 || loading}
          className="w-full"
        >
          {loading ? 'Saving...' : 'Save Prices'}
        </Button>
      </CardContent>
    </Card>
  );
}
