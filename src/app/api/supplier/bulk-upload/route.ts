import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import * as XLSX from "xlsx";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const admin = await requireRole(["ADMIN"]);
  if (!admin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json({ message: "Invalid content type" }, { status: 400 });
  }
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ message: "No file" }, { status: 400 });
  const buffer = Buffer.from(await file.arrayBuffer());
  let rows: Record<string, string>[] = [];
  if (file.name.endsWith(".csv")) {
    const text = buffer.toString("utf-8");
    const lines = text.split(/\r?\n/).filter(Boolean);
    const headers = lines.shift()?.split(",") ?? [];
    rows = lines.map((l) => {
      const cols = l.split(",");
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => (obj[h] = cols[i]));
      return obj;
    });
  } else {
    const wb = XLSX.read(buffer, { type: "buffer" });
    const firstSheet = wb.SheetNames[0];
    rows = XLSX.utils.sheet_to_json<Record<string, string>>(wb.Sheets[firstSheet]);
  }

  let created = 0;
  const basePhone = "0000000000";
  const baseUser = await prisma.user.upsert({ where: { phone: basePhone }, update: {}, create: { phone: basePhone, name: "Bulk" } });
  const baseSupplier = await prisma.supplier.upsert({ where: { userId: baseUser.id }, update: { name: "Bulk Upload Supplier" }, create: { userId: baseUser.id, name: "Bulk Upload Supplier" } });
  for (const r of rows) {
    const cat = await prisma.category.upsert({
      where: { slug: (r.category || "general").toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: { name: r.category || "General", slug: (r.category || "general").toLowerCase().replace(/\s+/g, "-") },
    });
    await prisma.listing.create({
      data: {
        supplierId: baseSupplier.id,
        categoryId: cat.id,
        type: (r.type || "PRODUCT").toUpperCase() === "SERVICE" ? "SERVICE" : "PRODUCT",
        title: r.title || "Untitled",
        description: r.description || null,
        pricePaise: Math.round(parseFloat(r.price || "0") * 100),
        available: true,
      },
    });
    created++;
  }
  return NextResponse.json({ message: `Imported ${created} items` });
}
