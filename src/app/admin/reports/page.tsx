import { prisma } from "@/lib/prisma";

type GroupKey = "day" | "week" | "month" | "year" | "category" | "supplier" | "user";

function formatKey(key: string) {
  return key;
}

export default async function Reports({ searchParams }: { searchParams: Promise<{ groupBy?: GroupKey }> }) {
  const { groupBy = "month" } = await searchParams;
  const orders = await prisma.order.findMany({ include: { items: { include: { listing: { include: { category: true, supplier: true } } } } , customer: true } });
  const total = orders.reduce((sum, o) => sum + o.totalAmountPaise, 0);

  const groups = new Map<string, number>();
  for (const o of orders) {
    let key = "";
    const d = new Date(o.createdAt);
    if (groupBy === "day") key = d.toISOString().slice(0, 10);
    else if (groupBy === "week") {
      const start = new Date(d);
      const day = start.getUTCDay();
      const diff = start.getUTCDate() - day + (day === 0 ? -6 : 1);
      start.setUTCDate(diff);
      key = start.toISOString().slice(0, 10);
    } else if (groupBy === "month") key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    else if (groupBy === "year") key = String(d.getUTCFullYear());
    else if (groupBy === "user") key = o.customer.phone;
    else if (groupBy === "supplier") key = o.items[0]?.listing?.supplier?.name || "Unknown";
    else if (groupBy === "category") key = o.items[0]?.listing?.category?.name || "Unknown";
    const current = groups.get(key) || 0;
    groups.set(key, current + o.totalAmountPaise);
  }

  const rows = Array.from(groups.entries()).sort((a, b) => a[0] < b[0] ? -1 : 1);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h3 className="text-xl font-semibold">Reports</h3>
      <div className="mt-3">Total orders: {orders.length}</div>
      <div className="mt-1">Gross volume: ₹{(total / 100).toFixed(2)}</div>
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        {(["day","week","month","year","user","supplier","category"] as GroupKey[]).map((g) => (
          <a key={g} href={`/admin/reports?groupBy=${g}`} className={`rounded border px-3 py-1 ${g===groupBy?"bg-primary text-white":""}`}>{g}</a>
        ))}
      </div>
      <div className="mt-6 rounded border">
        <div className="grid grid-cols-2 border-b p-3 font-semibold">
          <div>Group</div>
          <div className="text-right">Total (₹)</div>
        </div>
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-2 border-b p-3 text-sm">
            <div>{formatKey(k)}</div>
            <div className="text-right">{(v / 100).toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
