import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import type { $Enums } from "@/generated/prisma/client";

export async function requirePhone(): Promise<string | null> {
  const c = await cookies();
  const phone = c.get("phone")?.value || null;
  return phone;
}

export async function getOrCreateUserByPhone(phone: string) {
  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing) return existing;
  return prisma.user.create({ data: { phone } });
}

export async function requireUser() {
  const phone = await requirePhone();
  if (!phone) return null;
  return prisma.user.findUnique({ where: { phone } });
}

export async function requireRole(roles: $Enums.UserRole[]) {
  const user = await requireUser();
  if (!user) return null;
  return roles.includes(user.role as $Enums.UserRole) ? user : null;
}

export async function requireSupplier() {
  const user = await requireRole(["SUPPLIER"]);
  if (!user) return null;
  const supplier = await prisma.supplier.findUnique({ where: { userId: user.id } });
  return supplier || null;
}
