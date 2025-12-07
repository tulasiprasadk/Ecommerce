import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Category, Listing } from "@/generated/prisma/client";

type ListingWithRelations = Listing & {
  supplier: { name: string };
  category: { name: string };
};

export default async function Catalog() {
  const [categories, listings] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.listing.findMany({
      where: { available: true },
      include: { supplier: true, category: true },
      take: 30,
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h2 className="text-2xl font-bold">Categories</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((c: Category) => (
          <Link
            key={c.id}
            href={`/catalog/${c.slug}`}
            className="rounded-full border px-3 py-1 text-sm hover:bg-muted"
          >
            {c.name}
          </Link>
        ))}
      </div>

      <h3 className="mt-8 text-xl font-semibold">Featured Listings</h3>
      <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((l: ListingWithRelations) => (
          <Link
            key={l.id}
            href={`/listing/${l.id}`}
            className="group rounded-2xl border p-4 shadow-sm transition hover:shadow"
          >
            <div className="flex items-start justify-between">
              <div className="font-medium group-hover:text-primary">
                {l.title}
              </div>
              <span className="rounded bg-primary px-2 py-1 text-xs text-white">
                ₹{(l.pricePaise / 100).toFixed(0)}
              </span>
            </div>
            <div className="mt-1 text-sm text-zinc-600">
              {l.supplier.name} • {l.category.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
