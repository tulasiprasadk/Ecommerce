import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import fs from "node:fs";
import path from "node:path";

type KycMeta = {
  phone: string;
  name: string;
  address: string;
  docType: string;
  file: string | null;
  submittedAt: string;
  reviewed?: boolean;
  reviewedAt?: string;
};

function readKycDir() {
  const dir = path.join(process.cwd(), "public", "kyc");
  try {
    fs.mkdirSync(dir, { recursive: true });
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
    return { dir, files };
  } catch {
    return { dir, files: [] as string[] };
  }
}

export async function GET() {
  const admin = await requireRole(["ADMIN"]);
  if (!admin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const { dir, files } = readKycDir();
  const items = files.map((file) => {
    const metaPath = path.join(dir, file);
    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8")) as KycMeta;
      return { file, meta };
    } catch {
      return { file, meta: null };
    }
  });
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const admin = await requireRole(["ADMIN"]);
  if (!admin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const ct = req.headers.get("content-type") || "";
  let phone = "";
  if (ct.includes("application/json")) {
    const body = await req.json();
    phone = String(body.phone || "").trim();
  } else {
    const fd = await req.formData();
    phone = String(fd.get("phone") || "").trim();
  }
  if (!phone) return NextResponse.json({ message: "phone required" }, { status: 400 });

  const { dir } = readKycDir();
  const metaPath = path.join(dir, `${phone}.json`);
  let meta: KycMeta | null = null;
  try {
    meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
  } catch {
    meta = null;
  }

  const user = await prisma.user.upsert({ where: { phone }, update: { role: "SUPPLIER", name: meta?.name }, create: { phone, role: "SUPPLIER", name: meta?.name } });
  await prisma.supplier.upsert({ where: { userId: user.id }, update: { name: meta?.name || user.name || "Supplier", address: meta?.address || undefined }, create: { userId: user.id, name: meta?.name || user.name || "Supplier", address: meta?.address || undefined } });

  try {
    if (meta) {
      const next = { ...meta, reviewed: true, reviewedAt: new Date().toISOString() } as KycMeta;
      fs.writeFileSync(metaPath, JSON.stringify(next, null, 2));
    }
  } catch {}

  return NextResponse.json({ ok: true, phone });
}

