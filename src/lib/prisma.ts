/**
 * 大地观察哨 — Prisma Client 单例
 *
 * Prisma v7 架构：必须通过适配器连接数据库。
 * 这里使用 `prisma-adapter-sqlite`，基于 Node.js 内置 `node:sqlite`，
 * 无需原生编译，兼容 macOS/Windows/Linux。
 *
 * 生产环境切换到 PostgreSQL 时，替换适配器即可。
 */

import { PrismaSqlite } from "prisma-adapter-sqlite";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const databaseUrl = process.env["DATABASE_URL"];

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set. Check your .env file.");
  }

  const adapter = new PrismaSqlite({
    url: databaseUrl,
  });

  return new PrismaClient({
    adapter,
    // 开发环境打印查询（可选开启）
    // log: process.env.NODE_ENV === "development" ? ["query"] : [],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
