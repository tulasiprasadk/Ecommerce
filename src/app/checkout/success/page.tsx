import { prisma } from "@/lib/prisma";
import type { Order, OrderItem } from "@/generated/prisma/client";

export default async function OrderSuccess({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const id = searchParams.id;

  if (!id) {
    return (
      <div className="mx-auto max-w-2xl p-10 text-center">
        Invalid order ID
      </div>
    );
  }

  const ord: (Order & { items: (OrderItem & { listing: { title: string } })[] }) | null =
    await prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { listing: true } },
      },
    });

  if (!ord) {
    return (
      <div className="mx-auto max-w-2xl p-10 text-center">
        Order not found
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-10">
      <h2 className="text-2xl font-bold text-green-600">Order Successful 🎉</h2>

      <div className="mt-6 rounded-xl border p-6 shadow-sm">
        <div className="font-semibold">Order ID</div>
        <div className="text-sm text-gray-700">{ord.id}</div>

        <div className="mt-4 font-semibold">Total Amount</div>
        <div className="text-sm text-gray-700">
          ₹{(ord.totalAmountPaise / 100).toFixed(2)}
        </div>

        <div className="mt-4 font-semibold">Items</div>
        <ul className="mt-2 text-sm">
          {ord.items.map((it: OrderItem & { listing: { title: string } }) => (
            <li key={it.id}>
              {it.listing.title} — ₹{(it.amountPaise / 100).toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
