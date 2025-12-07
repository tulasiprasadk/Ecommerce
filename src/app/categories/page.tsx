import { prisma } from "@/lib/prisma";

export default async function Categories() {
  const items = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h2 className="text-2xl font-bold">Categories</h2>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {items.map((c) => (
          <a key={c.id} href={`/catalog?category=${encodeURIComponent(c.slug)}`} className="group rounded-2xl border bg-muted p-4 text-center shadow-sm transition hover:shadow">
            <div className="font-medium group-hover:text-primary">{c.name}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
