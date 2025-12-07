import { prisma } from "@/lib/prisma";

export default async function Success({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order: orderParam } = await searchParams;
  const id = orderParam || "";
  const ord = id ? await prisma.order.findUnique({ where: { id }, include: { items: { include: { listing: true } }, customer: true } }) : null;
  if (!ord) return <div className="p-10">Order not found</div>;
  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h2 className="text-2xl font-bold">Payment Successful</h2>
      <p className="mt-2 text-zinc-700">Order ID: {ord.id}</p>
      <p className="mt-1 text-zinc-700">Status: {ord.status}</p>
      <div className="mt-4 rounded border p-4">
        <div className="font-semibold">Items</div>
        <ul className="mt-2 text-sm">
          {ord.items.map((it) => (
            <li key={it.id}>{it.listing.title} — ₹{(it.amountPaise / 100).toFixed(2)}</li>
          ))}
        </ul>
        <div className="mt-3 font-semibold">Total: ₹{(ord.totalAmountPaise / 100).toFixed(2)}</div>
      </div>
      <a href="/catalog" className="mt-6 inline-block rounded bg-black px-4 py-2 text-white">Continue Shopping</a>
    </div>
  );
}
