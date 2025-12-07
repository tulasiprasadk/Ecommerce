import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

// Add required Prisma types
import type { Order, OrderItem } from "@/generated/prisma/client";

export async function GET(req: Request) {
  const admin = await requireRole(["ADMIN"]);
  if (!admin)
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);

  const phone = searchParams.get("phone") || undefined;
  const supplier = searchParams.get("supplier") || undefined;
  const category = searchParams.get("category") || undefined;
  const title = searchParams.get("title") || undefined;

  const min = searchParams.get("min");
  const max = searchParams.get("max");

  const minPaise = min ? Math.round(parseFloat(min) * 100) : undefined;
  const maxPaise = max ? Math.round(parseFloat(max) * 100) : undefined;

  const items = await prisma.order.findMany({
    where: {
      customer: phone ? { phone } : undefined,
      items: title
        ? { some: { listing: { title: { contains: title } } } }
        : undefined,
      totalAmountPaise:
        minPaise || maxPaise ? { gte: minPaise, lte: maxPaise } : undefined,
    },
    include: {
      items: {
        include: {
          listing: {
            include: {
              supplier: true,
              category: true,
            },
          },
        },
      },
      customer: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Typed version to satisfy strict TS mode
  const filtered =
    supplier || category
      ? items.filter((o: Order) =>
          o.items.some((it: OrderItem) => {
            const supplierMatch = supplier
              ? it.listing.supplier.name.includes(supplier)
              : true;

            const categoryMatch = category
              ? it.listing.category.slug === category ||
                it.listing.category.name.includes(category)
              : true;

            return supplierMatch && categoryMatch;
          })
        )
      : items;

  return NextResponse.json({ items: filtered });
}
