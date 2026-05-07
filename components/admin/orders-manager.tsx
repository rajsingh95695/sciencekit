"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { apiRequest } from "@/services/api-client";
import { formatCurrency } from "@/lib/utils";

export function OrdersManager() {
  const [orders, setOrders] = useState<Array<Record<string, any>>>([]);
  const [tracking, setTracking] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Record<string, string>>({});

  const fetchOrders = async () => {
    const response = await apiRequest<Array<Record<string, any>>>("/api/orders?scope=all", { method: "GET" });
    setOrders(response);
  };

  useEffect(() => {
    void fetchOrders();
  }, []);

  return (
    <Card>
      <CardContent className="overflow-x-auto p-0">
        <Table>
          <thead>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tracking</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </thead>
          <tbody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>#{order._id}</TableCell>
                <TableCell>{order.userId?.name || "Customer"}</TableCell>
                <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                <TableCell>
                  <Select
                    value={status[order._id] || order.orderStatus}
                    onValueChange={(value) => setStatus((current) => ({ ...current, [order._id]: value }))}
                  >
                    <SelectTrigger className="min-w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["pending", "processing", "shipped", "delivered", "cancelled"].map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input
                    value={tracking[order._id] || order.shippingTrackingId || ""}
                    onChange={(event) =>
                      setTracking((current) => ({
                        ...current,
                        [order._id]: event.target.value
                      }))
                    }
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    onClick={async () => {
                      await apiRequest(`/api/orders/${order._id}`, {
                        method: "PATCH",
                        body: JSON.stringify({
                          orderStatus: status[order._id] || order.orderStatus,
                          shippingTrackingId: tracking[order._id] || order.shippingTrackingId
                        })
                      });
                      toast.success("Order updated.");
                      await fetchOrders();
                    }}
                  >
                    Save
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </CardContent>
    </Card>
  );
}
