import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { $Enums } from "@/generated/prisma/client";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const phone = (await cookies()).get("phone")?.value;
  if (!phone) return NextResponse.json({ message: "Login required" }, { status: 401 });
  const { orderId } = await req.json();
  if (!orderId) return NextResponse.json({ message: "orderId required" }, { status: 400 });
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { customer: true } });
  if (!order || order.customer.phone !== phone) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const updated = await prisma.order.update({ where: { id: orderId }, data: { status: "PAID" as $Enums.OrderStatus } });
  return NextResponse.json({ ok: true, orderId: updated.id });
}
