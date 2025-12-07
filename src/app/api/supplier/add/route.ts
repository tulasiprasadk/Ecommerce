import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSupplier } from "@/lib/auth";

export async function POST(req: Request) {
  const supplier = await requireSupplier();
  if (!supplier) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const { title, description, price, category, type } = await req.json();
  const sanitize = (s: string | null | undefined) =>
    (s || "").replace(/(https?:\/\/|www\.)\S+/gi, "").trim();
  const safeTitle = sanitize(title);
  const safeDescription = sanitize(description);
  const cat = await prisma.category.upsert({
    where: { slug: category.toLowerCase().replace(/\s+/g, "-") },
    update: {},
    create: { name: category, slug: category.toLowerCase().replace(/\s+/g, "-") },
  });
  const created = await prisma.listing.create({
    data: {
      supplierId: supplier.id,
      categoryId: cat.id,
      type,
      title: safeTitle,
      description: safeDescription || null,
      pricePaise: Math.round(parseFloat(price) * 100),
      available: true,
    },
  });
  return NextResponse.json({ message: "Listing added", id: created.id });
}
