import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

import type { Order, OrderItem } from "@/generated/prisma/client";

// Custom type for included relations
type OrderWithItems = Order & {
  items: (OrderItem & {
    listing: {
      supplier: { name: string };
      category: { slug: string; name: string };
    };
  })[];
};

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

  const items = (await prisma.order.findMany({
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
  })) as OrderWithItems[];

  const filtered =
    supplier || category
      ? items.filter((o) =>
          o.items.some((it) => {
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
