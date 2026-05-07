"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Save, Search, CheckSquare, Square } from 'lucide-react';

interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  images: string[];
  brand: string;
  category: string;
  subcategory: string;
  price: number | null;
  originalUrl: string;
  createdAt: string;
}

export default function BulkPriceEditor() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [bulkPrice, setBulkPrice] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/products/pending-prices?page=${page}&search=${searchTerm}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        setTotal(data.total);
        // Initialize prices from existing data
        const initialPrices: Record<string, string> = {};
        data.products.forEach((p: Product) => {
          if (p.price !== null) {
            initialPrices[p._id] = p.price.toString();
          }
        });
        setPrices(initialPrices);
      }
    } catch (err) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, searchTerm]);

  const handlePriceChange = (productId: string, value: string) => {
    setPrices(prev => ({ ...prev, [productId]: value }));
  };

  const toggleSelect = (productId: string) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedProducts.size === products.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(products.map(p => p._id)));
    }
  };

  const applyBulkPrice = () => {
    const price = bulkPrice;
    if (!price || isNaN(Number(price))) {
      toast.error('Enter a valid bulk price');
      return;
    }
    
    const newPrices: Record<string, string> = { ...prices };
    selectedProducts.forEach(id => {
      newPrices[id] = price;
    });
    setPrices(newPrices);
    toast.success(`Price applied to ${selectedProducts.size} products`);
  };

  const savePrices = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(prices)
        .filter(([_, price]) => price && !isNaN(Number(price)))
        .map(([id, price]) => ({ id, price: Number(price) }));

      if (updates.length === 0) {
        toast.error('No valid prices to save');
        return;
      }

      const res = await fetch('/api/products/update-prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Updated ${data.updated} products`);
        fetchProducts();
        setSelectedProducts(new Set());
      } else {
        toast.error(data.error || 'Failed to update prices');
      }
    } catch (err) {
      toast.error('Error saving prices');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Bulk Price Editor</h2>
          <p className="text-gray-500">{total} products pending pricing</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={savePrices} disabled={saving} className="gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Prices
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                placeholder="Bulk price"
                value={bulkPrice}
                onChange={(e) => setBulkPrice(e.target.value)}
                className="w-32"
              />
              <Button 
                variant="outline" 
                onClick={applyBulkPrice}
                disabled={selectedProducts.size === 0}
              >
                Apply to Selected ({selectedProducts.size})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={toggleSelectAll}
                      className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded"
                    >
                      {selectedProducts.size === products.length && products.length > 0 ? (
                        <CheckSquare className="w-4 h-4" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Product</th>
                  <th className="px-4 py-3 text-left font-medium">Category</th>
                  <th className="px-4 py-3 text-left font-medium">Brand</th>
                  <th className="px-4 py-3 text-left font-medium w-40">Price (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleSelect(product._id)}
                        className="hover:bg-gray-100 p-1 rounded"
                      >
                        {selectedProducts.has(product._id) ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {product.images[0] && (
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div>
                          <p className="font-medium text-sm">{product.title}</p>
                          <p className="text-xs text-gray-500 truncate max-w-xs">
                            {product.description?.slice(0, 60)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {product.category}
                      {product.subcategory && (
                        <span className="text-gray-500"> / {product.subcategory}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">{product.brand || '-'}</td>
                    <td className="px-4 py-3">
                      <Input
                        type="number"
                        placeholder="Set price"
                        value={prices[product._id] || ''}
                        onChange={(e) => handlePriceChange(product._id, e.target.value)}
                        className="w-32"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {products.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No products pending pricing
            </div>
          )}

          {/* Pagination */}
          {total > 20 && (
            <div className="flex justify-between items-center p-4 border-t">
              <p className="text-sm text-gray-500">
                Showing {(page - 1) * 20 + 1} - {Math.min(page * 20, total)} of {total}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page * 20 >= total}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
