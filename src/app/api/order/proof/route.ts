import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import fs from "node:fs";
import path from "node:path";

export async function POST(req: Request) {
  const phone = (await cookies()).get("phone")?.value;
  if (!phone) return NextResponse.json({ message: "Login required" }, { status: 401 });

  const ct = req.headers.get("content-type") || "";
  if (!ct.includes("multipart/form-data")) {
    return NextResponse.json({ message: "Invalid content type" }, { status: 400 });
  }

  const form = await req.formData();
  const orderId = String(form.get("orderId") || "").trim();
  const utr = String(form.get("utr") || "").trim();
  const file = form.get("proof");
  if (!orderId) return NextResponse.json({ message: "orderId required" }, { status: 400 });

  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { customer: true } });
  if (!order || order.customer.phone !== phone) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  // save file to public/proofs
  let savedPath: string | null = null;
  if (file && typeof file === "object" && "arrayBuffer" in (file as Blob)) {
    const array = await (file as Blob).arrayBuffer();
    const buffer = Buffer.from(array);
    const dir = path.join(process.cwd(), "public", "proofs");
    fs.mkdirSync(dir, { recursive: true });
    const nameProp = (file as File).name || "proof.png";
    const ext = nameProp.split(".").pop() || "png";
    const name = `${orderId}-${Date.now()}.${ext}`;
    const full = path.join(dir, name);
    fs.writeFileSync(full, buffer);
    savedPath = `/proofs/${name}`;
  }

  // write a small json alongside for admin review
  const metaDir = path.join(process.cwd(), "public", "proofs");
  fs.mkdirSync(metaDir, { recursive: true });
  const metaPath = path.join(metaDir, `${orderId}.json`);
  fs.writeFileSync(
    metaPath,
    JSON.stringify({ orderId, utr: utr || null, proof: savedPath, submittedAt: new Date().toISOString() }, null, 2)
  );

  return NextResponse.json({ ok: true, proof: savedPath, utr });
}
