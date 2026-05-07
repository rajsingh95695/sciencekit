"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Search, Link as LinkIcon, Plus, X, History, Layers } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/services/api-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ImportProduct() {
  const [urls, setUrls] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previews, setPreviews] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<{ url: string; title: string; date: string }[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem("importHistory");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {}
    }
  }, []);

  const addToHistory = (url: string, title: string) => {
    const newHistory = [{ url, title, date: new Date().toISOString() }, ...history].slice(0, 50);
    setHistory(newHistory);
    localStorage.setItem("importHistory", JSON.stringify(newHistory));
  };

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urls.trim()) return;
    
    const urlList = urls.split("\n").map(u => u.trim()).filter(Boolean);
    if (urlList.length === 0) return;

    setIsFetching(true);
    setPreviews([]);
    setCurrentIndex(0);
    
    const fetchedPreviews = [];
    
    for (const url of urlList) {
      try {
        const data = await apiRequest<any>("/api/import-product", {
          method: "POST",
          body: JSON.stringify({ url })
        });
        
        fetchedPreviews.push({
          ...data,
          price: 0,
          category: "Electronics",
          subcategory: "Kits",
          stock: 10,
          difficulty: "Medium",
          tags: data.features ? data.features.join(", ") : "",
          brand: data.brand || "",
          videoUrl: data.videoUrl || "",
          variantsText: (data.variants || []).join(", ")
        });
        toast.success(`Extracted: ${data.title}`);
      } catch (error) {
        toast.error(`Failed to fetch ${url}: ${error instanceof Error ? error.message : "Error"}`);
      }
    }
    
    if (fetchedPreviews.length > 0) {
      setPreviews(fetchedPreviews);
    }
    setIsFetching(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (previews.length === 0) return;
    
    setIsSaving(true);
    const currentPreview = previews[currentIndex];
    
    try {
      // 1. Upload external images to Cloudinary
      let uploadedImages = currentPreview.images.map((url: string) => ({ url, publicId: "", alt: currentPreview.title }));
      
      if (currentPreview.images.length > 0) {
        try {
          const uploadRes = await apiRequest<any>("/api/admin/upload-external", {
            method: "POST",
            body: JSON.stringify({ urls: currentPreview.images })
          });
          
          if (uploadRes && uploadRes.results) {
            uploadedImages = uploadRes.results.map((r: any) => ({
              url: r.url,
              publicId: r.publicId || "",
              alt: currentPreview.title
            }));
          }
        } catch (uploadErr) {
          console.error("Image upload failed, falling back to external URLs", uploadErr);
        }
      }

      const payload = {
        name: currentPreview.title,
        slug: currentPreview.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        description: currentPreview.description,
        category: currentPreview.category,
        subcategory: currentPreview.subcategory,
        price: Number(currentPreview.price),
        discountPrice: Number(currentPreview.price),
        stock: Number(currentPreview.stock),
        difficulty: currentPreview.difficulty,
        images: uploadedImages,
        tags: currentPreview.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
        componentsIncluded: currentPreview.features || [],
        brand: currentPreview.brand,
        videoUrl: currentPreview.videoUrl,
        variants: currentPreview.variantsText.split(",").map((v: string) => v.trim()).filter(Boolean),
        featured: false,
        trendingScore: 0
      };
      
      await apiRequest("/api/products", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      
      toast.success("Imported product saved successfully!");
      addToHistory(currentPreview.originalUrl, currentPreview.title);
      
      // Remove the saved preview
      const nextPreviews = [...previews];
      nextPreviews.splice(currentIndex, 1);
      setPreviews(nextPreviews);
      
      if (nextPreviews.length === 0) {
        setUrls("");
      } else {
        if (currentIndex >= nextPreviews.length) {
          setCurrentIndex(nextPreviews.length - 1);
        }
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save product.");
    } finally {
      setIsSaving(false);
    }
  };

  const preview = previews[currentIndex];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="import">
        <TabsList>
          <TabsTrigger value="import"><LinkIcon className="h-4 w-4 mr-2"/> Import</TabsTrigger>
          <TabsTrigger value="history"><History className="h-4 w-4 mr-2"/> History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="import" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Layers className="h-5 w-5 text-[var(--primary)]" />
                Auto Product Importer
              </CardTitle>
              <CardDescription>
                Paste URLs (one per line) from external suppliers to automatically extract details using AI.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFetch} className="flex flex-col gap-3">
                <Textarea 
                  placeholder="https://example.com/product/123&#10;https://example.com/product/456" 
                  value={urls}
                  onChange={(e) => setUrls(e.target.value)}
                  className="min-h-[100px] flex-1"
                  required
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={isFetching || !urls.trim()}>
                    {isFetching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                    Fetch Data
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {previews.length > 0 && preview && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                <div>
                  <CardTitle>Review & Complete Import</CardTitle>
                  <CardDescription>Review the extracted data ({currentIndex + 1} of {previews.length})</CardDescription>
                </div>
                {previews.length > 1 && (
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={currentIndex === 0}
                      onClick={() => setCurrentIndex(curr => curr - 1)}
                    >
                      Prev
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={currentIndex === previews.length - 1}
                      onClick={() => setCurrentIndex(curr => curr + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSave} className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4 md:col-span-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold">Product Title</label>
                      <Input 
                        value={preview.title} 
                        onChange={(e) => {
                          const newPreviews = [...previews];
                          newPreviews[currentIndex].title = e.target.value;
                          setPreviews(newPreviews);
                        }} 
                        required 
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold">Description (HTML)</label>
                      <Textarea 
                        value={preview.description} 
                        onChange={(e) => {
                          const newPreviews = [...previews];
                          newPreviews[currentIndex].description = e.target.value;
                          setPreviews(newPreviews);
                        }} 
                        rows={6}
                        required 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold">Brand</label>
                    <Input value={preview.brand} onChange={(e) => {
                      const newPreviews = [...previews];
                      newPreviews[currentIndex].brand = e.target.value;
                      setPreviews(newPreviews);
                    }} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold">Video URL</label>
                    <Input type="url" value={preview.videoUrl} onChange={(e) => {
                      const newPreviews = [...previews];
                      newPreviews[currentIndex].videoUrl = e.target.value;
                      setPreviews(newPreviews);
                    }} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold">Category</label>
                    <Input value={preview.category} onChange={(e) => {
                      const newPreviews = [...previews];
                      newPreviews[currentIndex].category = e.target.value;
                      setPreviews(newPreviews);
                    }} required />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold">Subcategory</label>
                    <Input value={preview.subcategory} onChange={(e) => {
                      const newPreviews = [...previews];
                      newPreviews[currentIndex].subcategory = e.target.value;
                      setPreviews(newPreviews);
                    }} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold">Price (₹)</label>
                    <Input type="number" value={preview.price} onChange={(e) => {
                      const newPreviews = [...previews];
                      newPreviews[currentIndex].price = e.target.value;
                      setPreviews(newPreviews);
                    }} required />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold">Stock</label>
                    <Input type="number" value={preview.stock} onChange={(e) => {
                      const newPreviews = [...previews];
                      newPreviews[currentIndex].stock = e.target.value;
                      setPreviews(newPreviews);
                    }} required />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold">Difficulty</label>
                    <select 
                      className="flex h-11 w-full rounded-2xl border border-[var(--input)] bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                      value={preview.difficulty} 
                      onChange={(e) => {
                        const newPreviews = [...previews];
                        newPreviews[currentIndex].difficulty = e.target.value;
                        setPreviews(newPreviews);
                      }}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold">Tags (comma separated)</label>
                    <Input value={preview.tags} onChange={(e) => {
                      const newPreviews = [...previews];
                      newPreviews[currentIndex].tags = e.target.value;
                      setPreviews(newPreviews);
                    }} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-sm font-semibold">Variants (comma separated)</label>
                    <Input value={preview.variantsText} onChange={(e) => {
                      const newPreviews = [...previews];
                      newPreviews[currentIndex].variantsText = e.target.value;
                      setPreviews(newPreviews);
                    }} placeholder="Red, Blue, Large, Small" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold">Extracted Images</label>
                    <div className="flex flex-wrap gap-4">
                      {preview.images.map((img: string, idx: number) => (
                        <div key={idx} className="relative group rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--muted)]">
                          <img src={img} alt={`Preview ${idx}`} className="h-24 w-24 object-cover" />
                          <button 
                            type="button" 
                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              const newPreviews = [...previews];
                              newPreviews[currentIndex].images.splice(idx, 1);
                              setPreviews(newPreviews);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      {preview.images.length === 0 && <p className="text-sm text-[var(--muted-foreground)]">No images found.</p>}
                    </div>
                  </div>

                  <div className="md:col-span-2 pt-4 flex gap-3 border-t">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                      Save Product to Catalog
                    </Button>
                    <Button type="button" variant="outline" onClick={() => {
                      const newPreviews = [...previews];
                      newPreviews.splice(currentIndex, 1);
                      setPreviews(newPreviews);
                      if (currentIndex >= newPreviews.length) {
                        setCurrentIndex(Math.max(0, newPreviews.length - 1));
                      }
                    }}>
                      Discard
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Import History</CardTitle>
              <CardDescription>Recently imported products from external sources.</CardDescription>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-sm text-[var(--muted-foreground)]">No imports yet.</p>
              ) : (
                <div className="space-y-4">
                  {history.map((h, i) => (
                    <div key={i} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium text-sm">{h.title}</p>
                        <a href={h.url} target="_blank" rel="noreferrer" className="text-xs text-[var(--primary)] hover:underline truncate max-w-[300px] block">
                          {h.url}
                        </a>
                      </div>
                      <span className="text-xs text-[var(--muted-foreground)]">
                        {new Date(h.date).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
