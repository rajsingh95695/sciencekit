import { connectToDB } from "@/lib/db";
import AdminLog from "@/models/AdminLog";

type LogLevel = "info" | "warn" | "error";

function write(level: LogLevel, message: string, meta?: unknown) {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    meta
  };

  if (level === "error") {
    console.error(payload);
    return;
  }

  if (level === "warn") {
    console.warn(payload);
    return;
  }

  console.info(payload);
}

export const logger = {
  info(message: string, meta?: unknown) {
    write("info", message, meta);
  },
  warn(message: string, meta?: unknown) {
    write("warn", message, meta);
  },
  error(message: string, meta?: unknown) {
    write("error", message, meta);
  }
};

export async function logAdminAction(input: {
  adminId: string;
  action: string;
  resource: string;
  resourceId?: string;
  payload?: unknown;
}) {
  write("info", `Admin action: ${input.action}`, input);

  try {
    await connectToDB();
    await AdminLog.create(input);
  } catch (error) {
    write("error", "Failed to persist admin log.", error);
  }
}
