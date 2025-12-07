import { requireRole } from "@/lib/auth";

export default async function SuppliersAdmin() {
  const admin = await requireRole(["ADMIN"]);
  if (!admin) return <div className="p-10">Forbidden</div>;
  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h3 className="text-xl font-semibold">Approve Supplier</h3>
      <form action="/api/admin/suppliers/approve" method="post" className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
        <input name="phone" placeholder="Phone" className="rounded border px-3 py-2" />
        <input name="name" placeholder="Name" className="rounded border px-3 py-2" />
        <button className="rounded bg-black px-4 py-2 text-white md:col-span-2">Approve</button>
      </form>
      <p className="mt-3 text-sm text-zinc-600">After approval, supplier can add single products/services.</p>
    </div>
  );
}
