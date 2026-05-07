"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pause, Play, X, RotateCcw, History, Loader2 } from 'lucide-react';

export default function BulkImport() {
  const [categoryUrl, setCategoryUrl] = useState('');
  const [targetCategory, setTargetCategory] = useState('');
  const [targetSubcategory, setTargetSubcategory] = useState('');
  const [jobId, setJobId] = useState<string | null>(null);
  interface JobStatus {
    status: string;
    totalProducts: number;
    importedCount: number;
    skippedCount: number;
    failedCount: number;
    logs: string[];
  }
  const [status, setStatus] = useState<JobStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [importHistory, setImportHistory] = useState<JobStatus[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Fetch import history
  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch('/api/bulk-import/history');
      const data = await res.json();
      if (data.success) {
        setImportHistory(data.jobs);
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
    setHistoryLoading(false);
  };

  const pauseImport = async () => {
    if (!jobId) return;
    try {
      const res = await fetch('/api/bulk-import/pause', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Import paused');
        setStatus(data.job);
      } else {
        toast.error(data.error || 'Failed to pause');
      }
    } catch (err: any) {
      toast.error('Error pausing import');
    }
  };

  const resumeImport = async () => {
    if (!jobId) return;
    try {
      const res = await fetch('/api/bulk-import/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Import resumed');
        setStatus(data.job);
        setPolling(true);
      } else {
        toast.error(data.error || 'Failed to resume');
      }
    } catch (err: any) {
      toast.error('Error resuming import');
    }
  };

  const cancelImport = async () => {
    if (!jobId) return;
    try {
      const res = await fetch('/api/bulk-import/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Import cancelled');
        setStatus(data.job);
        setPolling(false);
      } else {
        toast.error(data.error || 'Failed to cancel');
      }
    } catch (err: any) {
      toast.error('Error cancelling import');
    }
  };

  const resetForm = () => {
    setJobId(null);
    setStatus(null);
    setCategoryUrl('');
    setTargetCategory('');
    setTargetSubcategory('');
    setPolling(false);
  };

  const startImport = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bulk-import/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: categoryUrl, targetCategory, targetSubcategory }),
      });
      const data = await res.json();
      if (data.success) {
        setJobId(data.jobId);
        toast.success('Import started!');
        setPolling(true);
      } else {
        toast.error('Failed to start import.');
      }
    } catch (err: any) {
      console.error('Import start error:', err);
      toast.error(err.message || 'Error starting import. Check console for details.');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!jobId || !polling) return;
    const interval = setInterval(async () => {
      const res = await fetch(`/api/bulk-import/status?jobId=${jobId}`);
      const data = await res.json();
      if (data.success) {
        setStatus(data.job);
        if (['completed', 'failed', 'cancelled'].includes(data.job.status)) {
          setPolling(false);
        }
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [jobId, polling]);

  return (
    <Card className="max-w-2xl mx-auto my-10">
      <CardHeader>
        <CardTitle>Bulk Category Importer</CardTitle>
        <CardDescription>Auto Product Import System</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold">Category URL</label>
          <Input
            placeholder="Paste Category URL"
            value={categoryUrl}
            onChange={e => setCategoryUrl(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold">Target Category</label>
          <Select value={targetCategory} onValueChange={setTargetCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="books">Books</SelectItem>
              <SelectItem value="clothing">Clothing</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold">Target Subcategory</label>
          <Select value={targetSubcategory} onValueChange={setTargetSubcategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select Subcategory" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sub1">Subcategory 1</SelectItem>
              <SelectItem value="sub2">Subcategory 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={startImport} disabled={loading || !categoryUrl || !targetCategory} className="w-full">
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {loading ? 'Starting...' : 'Start Import'}
        </Button>
        
        {/* Control Buttons */}
        {status && ['running', 'paused'].includes(status.status) && (
          <div className="flex gap-2">
            {status.status === 'running' ? (
              <Button variant="outline" onClick={pauseImport} className="flex-1 gap-2">
                <Pause className="w-4 h-4" /> Pause
              </Button>
            ) : (
              <Button variant="outline" onClick={resumeImport} className="flex-1 gap-2">
                <Play className="w-4 h-4" /> Resume
              </Button>
            )}
            <Button variant="destructive" onClick={cancelImport} className="flex-1 gap-2">
              <X className="w-4 h-4" /> Cancel
            </Button>
          </div>
        )}
        
        {status && ['completed', 'cancelled', 'failed'].includes(status.status) && (
          <Button variant="outline" onClick={resetForm} className="w-full gap-2">
            <RotateCcw className="w-4 h-4" /> New Import
          </Button>
        )}
        
        {/* History Toggle */}
        <Button 
          variant="ghost" 
          onClick={() => {
            setShowHistory(!showHistory);
            if (!showHistory) fetchHistory();
          }}
          className="w-full gap-2"
        >
          <History className="w-4 h-4" /> 
          {showHistory ? 'Hide History' : 'Show Import History'}
        </Button>
      </CardContent>
      {status && (
        <CardContent className="border-t pt-6 space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{status.totalProducts ? Math.round(((status.importedCount + status.skippedCount + status.failedCount) / status.totalProducts) * 100) : 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{
                  width: `${status.totalProducts ? Math.round(((status.importedCount + status.skippedCount + status.failedCount) / status.totalProducts) * 100) : 0}%`,
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-600">Status</p>
              <p className="font-semibold">{status.status}</p>
            </div>
            <div>
              <p className="text-gray-600">Total Found</p>
              <p className="font-semibold">{status.totalProducts}</p>
            </div>
            <div>
              <p className="text-gray-600">Imported</p>
              <p className="font-semibold text-green-600">{status.importedCount}</p>
            </div>
            <div>
              <p className="text-gray-600">Skipped</p>
              <p className="font-semibold text-orange-600">{status.skippedCount}</p>
            </div>
            <div>
              <p className="text-gray-600">Failed</p>
              <p className="font-semibold text-red-600">{status.failedCount}</p>
            </div>
          </div>
          {status.logs.length > 0 && (
            <div>
              <p className="font-semibold mb-2">Logs</p>
              <div className="bg-gray-50 rounded-lg p-3 max-h-48 overflow-y-auto text-xs space-y-1">
                {status.logs.map((log: string, i: number) => (
                  <div key={i} className="text-gray-700">{log}</div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      )}
      
      {/* Import History */}
      {showHistory && (
        <CardContent className="border-t pt-6">
          <h3 className="font-semibold mb-4">Import History</h3>
          {historyLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {importHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No import history</p>
              ) : (
                importHistory.map((job: any) => (
                  <div key={job._id} className="bg-gray-50 rounded-lg p-3 text-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium truncate max-w-xs">{job.url}</p>
                        <p className="text-gray-500">{job.targetCategory} / {job.targetSubcategory || 'N/A'}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        job.status === 'completed' ? 'bg-green-100 text-green-700' :
                        job.status === 'running' ? 'bg-blue-100 text-blue-700' :
                        job.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                        job.status === 'failed' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    <div className="flex gap-4 mt-2 text-xs text-gray-600">
                      <span>Found: {job.totalProducts}</span>
                      <span className="text-green-600">✓ {job.importedCount}</span>
                      <span className="text-orange-600">⏸ {job.skippedCount}</span>
                      <span className="text-red-600">✗ {job.failedCount}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(job.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
