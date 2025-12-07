import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET() {
  const admin = await requireRole(["ADMIN"]);
  if (!admin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const items = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ items });
}
export async function POST(req: Request) {
  const admin = await requireRole(["ADMIN"]);
  if (!admin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const ct = req.headers.get("content-type") || "";
  let name = "";
  if (ct.includes("application/json")) {
    const body = await req.json().catch(() => ({}));
    name = body?.name || "";
  } else {
    const form = await req.formData();
    name = String(form.get("name") || "");
  }
  if (!name) return NextResponse.json({ message: "Name required" }, { status: 400 });
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  await prisma.category.create({ data: { name, slug } });
  return NextResponse.redirect(new URL("/admin/categories", req.url));
}
