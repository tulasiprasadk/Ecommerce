import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export default async function CategoriesPage() {
  const admin = await requireRole(["ADMIN"]);
  if (!admin) return <div className="p-10">Forbidden</div>;

  const items = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h3 className="text-xl font-semibold">Categories</h3>
      <ul className="mt-6 divide-y">
        {items.map((c) => (
          <li key={c.id} className="py-2">
            {c.name} • <span className="text-zinc-500">{c.slug}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
