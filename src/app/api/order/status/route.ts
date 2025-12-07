import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("orderId");
  if (!id) return NextResponse.json({ message: "orderId required" }, { status: 400 });
  const order = await prisma.order.findUnique({ where: { id }, select: { id: true, status: true, paymentMethod: true } });
  if (!order) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json({ order });
}
