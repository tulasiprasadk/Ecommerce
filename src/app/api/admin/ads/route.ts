import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { $Enums } from "@/generated/prisma/client";
import { requireRole } from "@/lib/auth";

export async function GET() {
  const admin = await requireRole(["ADMIN"]);
  if (!admin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const items = await prisma.advertisement.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ items });
}
export async function POST(req: Request) {
  const admin = await requireRole(["ADMIN"]);
  if (!admin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const ct = req.headers.get("content-type") || "";
  let imageUrl = "";
  let targetUrl = "";
  let position = "TOP";
  if (ct.includes("application/json")) {
    const body = await req.json().catch(() => ({}));
    imageUrl = body?.imageUrl || "";
    targetUrl = body?.targetUrl || "";
    position = body?.position || "TOP";
  } else {
    const form = await req.formData();
    imageUrl = String(form.get("imageUrl") || "");
    targetUrl = String(form.get("targetUrl") || "");
    position = String(form.get("position") || "TOP");
  }
  if (!imageUrl || !targetUrl) return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  const allowed = new Set<$Enums.AdPosition>(["TOP", "BOTTOM", "LEFT", "RIGHT"]);
  const pos: $Enums.AdPosition = allowed.has(position as $Enums.AdPosition) ? (position as $Enums.AdPosition) : "TOP";
  await prisma.advertisement.create({ data: { imageUrl, targetUrl, position: pos } });
  return NextResponse.redirect(new URL("/admin/ads", req.url));
}
