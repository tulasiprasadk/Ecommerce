import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("target") || "/";
  const ad = searchParams.get("ad");
  await prisma.analyticsEvent.create({ data: { type: "ad_click", meta: { ad, target } } });
  return NextResponse.redirect(target);
}

