import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { type, meta } = body || {};
  if (!type) return NextResponse.json({ ok: false }, { status: 400 });
  await prisma.analyticsEvent.create({ data: { type, meta } });
  return NextResponse.json({ ok: true });
}

