"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/services/api-client";

type Field = {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "checkbox" | "array" | "json" | "date";
};

function normalizeForEdit(field: Field, value: any) {
  if (field.type === "array") {
    return Array.isArray(value) ? value.join(", ") : "";
  }

  if (field.type === "json") {
    return value ? JSON.stringify(value, null, 2) : "[]";
  }

  if (field.type === "checkbox") {
    return Boolean(value);
  }

  if (field.type === "date") {
    return value ? new Date(value).toISOString().slice(0, 16) : "";
  }

  return value ?? "";
}

function normalizeForSubmit(field: Field, value: any) {
  if (field.type === "number") {
    return Number(value || 0);
  }

  if (field.type === "checkbox") {
    return Boolean(value);
  }

  if (field.type === "array") {
    return String(value)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (field.type === "json") {
    return JSON.parse(value || "[]");
  }

  if (field.type === "date") {
    return new Date(value).toISOString();
  }

  return value;
}

export function ResourceManager({
  title,
  description,
  endpoint,
  fields,
  itemLabelKey
}: {
  title: string;
  description: string;
  endpoint: string;
  fields: Field[];
  itemLabelKey: string;
}) {
  const initialForm = useMemo(
    () =>
      fields.reduce<Record<string, any>>((accumulator, field) => {
        accumulator[field.key] = field.type === "checkbox" ? false : "";
        return accumulator;
      }, {}),
    [fields]
  );
  const [items, setItems] = useState<Array<Record<string, any>>>([]);
  const [form, setForm] = useState<Record<string, any>>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchItems = async () => {
    const response = await apiRequest<any>(endpoint, { method: "GET" });
    if (Array.isArray(response)) {
      setItems(response);
    } else if (response && Array.isArray(response.items)) {
      setItems(response.items);
    } else {
      setItems([]);
    }
  };

  useEffect(() => {
    void fetchItems();
  }, [endpoint]);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-5 p-6">
          <div>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={async (event) => {
              event.preventDefault();
              try {
                const payload = fields.reduce<Record<string, any>>((accumulator, field) => {
                  accumulator[field.key] = normalizeForSubmit(field, form[field.key]);
                  return accumulator;
                }, {});

                await apiRequest(editingId ? `${endpoint}/${editingId}` : endpoint, {
                  method: editingId ? "PATCH" : "POST",
                  body: JSON.stringify(payload)
                });

                toast.success(editingId ? "Updated successfully." : "Created successfully.");
                setForm(initialForm);
                setEditingId(null);
                await fetchItems();
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Request failed.");
              }
            }}
          >
            {fields.map((field) => (
              <div className={field.type === "textarea" || field.type === "json" ? "md:col-span-2" : ""} key={field.key}>
                <label className="mb-2 block text-sm font-semibold">{field.label}</label>
                {field.type === "textarea" || field.type === "json" ? (
                  <Textarea
                    value={form[field.key]}
                    onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))}
                    className={field.type === "json" ? "font-mono text-xs" : ""}
                  />
                ) : field.type === "checkbox" ? (
                  <label className="flex h-11 items-center gap-3 rounded-2xl border border-[var(--input)] px-4">
                    <input
                      type="checkbox"
                      checked={Boolean(form[field.key])}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          [field.key]: event.target.checked
                        }))
                      }
                    />
                    <span>Enabled</span>
                  </label>
                ) : (
                  <Input
                    type={field.type === "number" ? "number" : field.type === "date" ? "datetime-local" : "text"}
                    value={form[field.key]}
                    onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))}
                  />
                )}
              </div>
            ))}
            <div className="flex gap-3 md:col-span-2">
              <Button>{editingId ? "Update" : "Create"}</Button>
              {editingId ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setForm(initialForm);
                  }}
                >
                  Cancel
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <thead>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </thead>
            <tbody>
              {items.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item[itemLabelKey]}</TableCell>
                  <TableCell>{new Date(item.createdAt).toLocaleDateString("en-IN")}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingId(item._id);
                        setForm(
                          fields.reduce<Record<string, any>>((accumulator, field) => {
                            accumulator[field.key] = normalizeForEdit(field, item[field.key]);
                            return accumulator;
                          }, {})
                        );
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        await apiRequest(`${endpoint}/${item._id}`, {
                          method: "DELETE"
                        });
                        toast.success("Deleted successfully.");
                        await fetchItems();
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
