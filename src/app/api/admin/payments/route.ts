import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import type { $Enums } from "@/generated/prisma/client";
import fs from "node:fs";
import path from "node:path";

type ProofMeta = {
  orderId: string;
  utr: string | null;
  proof: string | null;
  submittedAt: string;
  reviewed?: boolean;
  reviewedAt?: string;
  action?: string;
};

function readProofsDir() {
  const dir = path.join(process.cwd(), "public", "proofs");
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

  const { dir, files } = readProofsDir();
  const proofs = await Promise.all(
    files.map(async (file) => {
      const metaPath = path.join(dir, file);
      let meta: ProofMeta | null = null;
      try {
        meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
      } catch {
        meta = null;
      }
      const orderId = meta?.orderId || file.replace(/\.json$/, "");
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: { include: { listing: true } }, customer: true },
      });
      return { file, meta, order };
    })
  );

  return NextResponse.json({ proofs });
}

export async function POST(req: Request) {
  const admin = await requireRole(["ADMIN"]);
  if (!admin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const ct = req.headers.get("content-type") || "";
  let orderId = "";
  let action = "confirm";
  if (ct.includes("application/json")) {
    const body = await req.json();
    orderId = String(body.orderId || "").trim();
    action = String(body.action || action);
  } else {
    const fd = await req.formData();
    orderId = String(fd.get("orderId") || "").trim();
    action = String(fd.get("action") || action);
  }
  if (!orderId) return NextResponse.json({ message: "orderId required" }, { status: 400 });

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return NextResponse.json({ message: "Order not found" }, { status: 404 });

  if (action === "confirm") {
    await prisma.order.update({ where: { id: orderId }, data: { status: "CONFIRMED" as $Enums.OrderStatus } });
  } else if (action === "paid") {
    await prisma.order.update({ where: { id: orderId }, data: { status: "PAID" as $Enums.OrderStatus } });
  }

  const { dir } = readProofsDir();
  const metaPath = path.join(dir, `${orderId}.json`);
  try {
    const current = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
    const next = {
      ...current,
      reviewed: true,
      reviewedAt: new Date().toISOString(),
      action,
    };
    fs.writeFileSync(metaPath, JSON.stringify(next, null, 2));
  } catch {
    // ignore if meta missing
  }

  return NextResponse.json({ ok: true, orderId, action });
}
