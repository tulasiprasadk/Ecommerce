import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function UserDashboard() {
  const user = await requireUser();
  if (!user) return <div className="p-10">Login required</div>;
  const orders = await prisma.order.findMany({ where: { customerId: user.id }, orderBy: { createdAt: "desc" }, take: 10, include: { items: { include: { listing: true } } } });
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h2 className="text-2xl font-bold">Welcome</h2>
      <p className="mt-1 text-zinc-700">Phone: {user.phone}</p>
      <div className="mt-6 rounded border">
        <div className="border-b p-4 font-semibold">Recent Orders</div>
        {orders.length === 0 && <div className="p-4 text-sm text-zinc-600">No orders yet</div>}
        {orders.map((o) => (
          <div key={o.id} className="grid grid-cols-1 gap-2 border-b p-4 md:grid-cols-3">
            <div>
              <div className="font-medium">Order #{o.id.slice(-6)}</div>
              <div className="text-sm text-zinc-600">Status: {o.status}</div>
            </div>
            <div className="md:col-span-2 text-sm">
              {o.items.map((it) => (
                <div key={it.id} className="flex justify-between">
                  <span>{it.listing.title}</span>
                  <span>₹{(it.amountPaise / 100).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <a href="/catalog" className="mt-6 inline-block rounded bg-black px-4 py-2 text-white">Shop Now</a>
    </div>
  );
}
