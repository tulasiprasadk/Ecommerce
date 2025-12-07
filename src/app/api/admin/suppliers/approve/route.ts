import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function POST(req: Request) {
  const admin = await requireRole(["ADMIN"]);
  if (!admin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const { phone, name } = await req.json();
  if (!phone) return NextResponse.json({ message: "Phone required" }, { status: 400 });
  const user = await prisma.user.upsert({ where: { phone }, update: { role: "SUPPLIER", name }, create: { phone, name, role: "SUPPLIER" } });
  await prisma.supplier.upsert({ where: { userId: user.id }, update: { name: name || user.name || "Supplier" }, create: { userId: user.id, name: name || user.name || "Supplier" } });
  return NextResponse.json({ message: "Supplier approved" });
}
