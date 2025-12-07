import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export default async function Reports({
  searchParams,
}: {
  searchParams: { groupBy?: string };
}) {
  const admin = await requireRole(["ADMIN"]);
  if (!admin) return <div className="p-10">Forbidden</div>;

  const { groupBy = "month" } = await searchParams;

  // Prisma order type simplified for this page
  type OrderItem = {
    totalAmountPaise: number;
    createdAt: Date;
  };

  const orders: OrderItem[] = await prisma.order.findMany({
    include: {
      items: {
        include: {
          listing: {
            include: {
              category: true,
              supplier: true,
            },
          },
        },
      },
      customer: true,
    },
  });

  // FIX reduce type error
  const total = orders.reduce(
    (sum: number, o: OrderItem) => sum + o.totalAmountPaise,
    0
    // ^ typed sum and o
  );

  const groups = new Map<string, number>();

  for (const o of orders) {
    const key =
      groupBy === "month"
        ? `${o.createdAt.getFullYear()}-${o.createdAt.getMonth() + 1}`
        : `${o.createdAt.getFullYear()}`;
    groups.set(key, (groups.get(key) ?? 0) + o.totalAmountPaise);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h3 className="text-xl font-semibold">Sales Reports</h3>
      <p className="mt-2">Total: ₹{(total / 100).toFixed(2)}</p>

      <ul className="mt-6 divide-y">
        {[...groups.entries()].map(([k, v]) => (
          <li key={k} className="py-2">
            {k}: ₹{(v / 100).toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}
