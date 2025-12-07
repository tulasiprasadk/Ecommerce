import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET() {
  const admin = await requireRole(["ADMIN"]);
  if (!admin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  let item = await prisma.setting.findFirst();
  if (!item) item = await prisma.setting.create({ data: { marginPercent: 15 } });
  return NextResponse.json({ item });
}
export async function POST(req: Request) {
  const admin = await requireRole(["ADMIN"]);
  if (!admin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const body = await req.json();
  let item = await prisma.setting.findFirst();
  if (!item) item = await prisma.setting.create({ data: { marginPercent: 15 } });
  const updated = await prisma.setting.update({ where: { id: item.id }, data: body });
  return NextResponse.json({ item: updated });
}
