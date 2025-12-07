import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export default async function Categories() {
  const admin = await requireRole(["ADMIN"]);
  if (!admin) return <div className="p-10">Forbidden</div>;
  const items = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h3 className="text-xl font-semibold">Categories</h3>
      <form
        action="/api/admin/categories"
        method="post"
        className="mt-4 flex gap-2"
      >
        <input name="name" placeholder="Name" className="flex-1 rounded border px-3 py-2" />
        <button className="rounded bg-black px-4 py-2 text-white">Add</button>
      </form>
      <ul className="mt-6 divide-y">
        {items.map((i) => (<li key={i.id} className="py-2">{i.name}</li>))}
      </ul>
    </div>
  );
}
