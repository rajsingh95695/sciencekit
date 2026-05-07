
"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Table, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { apiRequest } from "@/services/api-client";

export default function AdminOpsPage() {
  const [messages, setMessages] = useState<Array<Record<string, any>>>([]);
  const [logs, setLogs] = useState<Array<Record<string, any>>>([]);

  useEffect(() => {
    void apiRequest<Array<Record<string, any>>>("/api/contact", { method: "GET" })
      .then(setMessages)
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "Unable to load contact inbox.");
      });

    void apiRequest<Array<Record<string, any>>>("/api/admin/logs", { method: "GET" })
      .then(setLogs)
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "Unable to load admin logs.");
      });
  }, []);

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="space-y-4 p-6">
          <div>
            <CardTitle className="text-2xl">Contact inbox</CardTitle>
            <CardDescription>Latest customer and institution enquiries.</CardDescription>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </thead>
              <tbody>
                {messages.map((message) => (
                  <TableRow key={message._id}>
                    <TableCell>{message.name}</TableCell>
                    <TableCell>{message.subject}</TableCell>
                    <TableCell>{message.email}</TableCell>
                    <TableCell>{message.message}</TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 p-6">
          <div>
            <CardTitle className="text-2xl">Admin logs</CardTitle>
            <CardDescription>Recent mutations across products, orders, coupons, and content.</CardDescription>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Resource ID</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <TableRow key={log._id}>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.resource}</TableCell>
                    <TableCell>{log.resourceId || "-"}</TableCell>
                    <TableCell>{new Date(log.createdAt).toLocaleString("en-IN")}</TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
