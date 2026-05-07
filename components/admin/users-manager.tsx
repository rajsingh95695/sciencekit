"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { apiRequest } from "@/services/api-client";

export function UsersManager() {
  const [users, setUsers] = useState<Array<Record<string, any>>>([]);
  const [roles, setRoles] = useState<Record<string, string>>({});

  const fetchUsers = async () => {
    const response = await apiRequest<Array<Record<string, any>>>("/api/users", { method: "GET" });
    setUsers(response);
  };

  useEffect(() => {
    void fetchUsers();
  }, []);

  return (
    <Card>
      <CardContent className="overflow-x-auto p-0">
        <Table>
          <thead>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Save</TableHead>
            </TableRow>
          </thead>
          <tbody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Select
                    value={roles[user._id] || user.role}
                    onValueChange={(value) => setRoles((current) => ({ ...current, [user._id]: value }))}
                  >
                    <SelectTrigger className="min-w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">user</SelectItem>
                      <SelectItem value="admin">admin</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    onClick={async () => {
                      await apiRequest(`/api/users/${user._id}`, {
                        method: "PATCH",
                        body: JSON.stringify({
                          role: roles[user._id] || user.role
                        })
                      });
                      toast.success("User role updated.");
                      await fetchUsers();
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
