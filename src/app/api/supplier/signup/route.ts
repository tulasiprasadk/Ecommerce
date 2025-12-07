import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import fs from "node:fs";
import path from "node:path";

export async function POST(req: Request) {
  const ct = req.headers.get("content-type") || "";
  if (!ct.includes("multipart/form-data")) {
    return NextResponse.json({ message: "Invalid content type" }, { status: 400 });
  }

  const c = await cookies();
  const phone = c.get("phone")?.value || null;
  const form = await req.formData();
  const name = String(form.get("name") || "").trim();
  const address = String(form.get("address") || "").trim();
  const docType = String(form.get("docType") || "AADHAAR").trim();
  const file = form.get("file");

  if (!phone) return NextResponse.json({ message: "Login required" }, { status: 401 });
  if (!name) return NextResponse.json({ message: "Name required" }, { status: 400 });

  let savedPath: string | null = null;
  if (file && typeof file === "object" && "arrayBuffer" in (file as Blob)) {
    const array = await (file as Blob).arrayBuffer();
    const buffer = Buffer.from(array);
    const dir = path.join(process.cwd(), "public", "kyc");
    fs.mkdirSync(dir, { recursive: true });
    const base = `${phone}-${Date.now()}-${docType.toLowerCase()}`;
    const nameProp = (file as File).name || "doc";
    const ext = nameProp.split(".").pop() || "bin";
    const full = path.join(dir, `${base}.${ext}`);
    fs.writeFileSync(full, buffer);
    savedPath = `/kyc/${base}.${ext}`;
  }

  const metaDir = path.join(process.cwd(), "public", "kyc");
  fs.mkdirSync(metaDir, { recursive: true });
  const metaPath = path.join(metaDir, `${phone}.json`);
  fs.writeFileSync(
    metaPath,
    JSON.stringify({ phone, name, address, docType, file: savedPath, submittedAt: new Date().toISOString() }, null, 2)
  );

  await prisma.message.create({ data: { userId: null, phone, name, content: `Supplier signup: ${docType}` } });

  return NextResponse.json({ ok: true, message: "KYC submitted" });
}

