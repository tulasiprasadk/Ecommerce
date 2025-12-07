import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Listing({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) return notFound();
  const listing = await prisma.listing.findUnique({ where: { id }, include: { supplier: true, category: true } });
  if (!listing) return notFound();
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">{listing.title}</h1>
      <div className="mt-2 text-sm text-zinc-600">{listing.supplier.name} • {listing.category.name}</div>
      <div className="mt-3">₹{(listing.pricePaise / 100).toFixed(2)}</div>
      {listing.description && <p className="mt-4 text-zinc-700">{listing.description}</p>}
      <Link href={`/checkout?listing=${listing.id}`} className="mt-6 inline-block rounded bg-black px-4 py-2 text-white">Proceed to Checkout</Link>
    </div>
  );
}
