import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

// Prisma model type inferred manually
type CategoryItem = {
  id: string;
  name: string;
  createdAt: Date;
};

export default async function Categories() {
  const admin = await requireRole(["ADMIN"]);
  if (!admin) return <div className="p-10">Forbidden</div>;

  const items: CategoryItem[] = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h3 className="text-xl font-semibold">Categories</h3>

      <form
        action="/api/admin/categories"
        method="post"
        className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-4"
      >
        <input
          name="name"
          placeholder="Category Name"
          className="rounded border px-3 py-2"
        />
        <button className="rounded bg-black px-4 py-2 text-white">
          Add
        </button>
      </form>

      <ul className="mt-6 divide-y">
        {items.map((i: CategoryItem) => (
          <li key={i.id} className="py-2">
            {i.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
