import { prisma } from "@/lib/prisma";
import type { Order } from "@/generated/prisma/client";

export default async function UserPage({
  searchParams,
}: {
  searchParams?: Record<string, string>;
}) {
  // TODO: Replace with actual logged-in customer once auth is connected.
  const phone = searchParams?.phone;

  if (!phone) {
    return (
      <div className="mx-auto max-w-3xl p-10 text-center">
        Please log in to view your orders.
      </div>
    );
  }

  const orders: Order[] = await prisma.order.findMany({
    where: { customer: { phone } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl p-4">
      <h2 className="mb-6 text-xl font-semibold">Your Account</h2>

      <div className="rounded-xl border shadow-sm">
        <div className="border-b p-4 font-semibold">Recent Orders</div>

        {orders.length === 0 && (
          <div className="p-4 text-sm text-zinc-600">No orders yet</div>
        )}

        {orders.map((o: Order) => (
          <div
            key={o.id}
            className="grid grid-cols-1 gap-2 border-b p-4 md:grid-cols-3"
          >
            <div>
              <div className="font-medium">Order #{o.id.slice(-6)}</div>
              <div className="text-sm text-zinc-600">
                Total: ₹{(o.totalAmountPaise / 100).toFixed(2)}
              </div>
            </div>

            <div className="text-sm text-zinc-700">
              Status:{" "}
              <span className="font-medium">
                {o.status}
              </span>
            </div>

            <div className="text-sm text-zinc-700">
              Placed on: {new Date(o.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
