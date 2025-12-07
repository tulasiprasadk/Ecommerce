import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

// Define the type for advertisement items (Prisma auto-generates these fields)
type AdItem = {
  id: string;
  position: string;
  imageUrl: string | null;
  targetUrl: string | null;
  createdAt: Date;
};

export default async function Ads() {
  const admin = await requireRole(["ADMIN"]);
  if (!admin) return <div className="p-10">Forbidden</div>;

  const items: AdItem[] = await prisma.advertisement.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h3 className="text-xl font-semibold">Advertisements</h3>

      <form
        action="/api/admin/ads"
        method="post"
        className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-4"
      >
        <select name="position" className="rounded border px-3 py-2">
          <option>TOP</option>
          <option>BOTTOM</option>
          <option>LEFT</option>
          <option>RIGHT</option>
        </select>

        <input
          name="imageUrl"
          placeholder="Image URL"
          className="rounded border px-3 py-2"
        />

        <input
          name="targetUrl"
          placeholder="Target URL"
          className="rounded border px-3 py-2"
        />

        <button className="rounded bg-black px-4 py-2 text-white">Add</button>
      </form>

      <ul className="mt-6 divide-y">
        {items.map((i: AdItem) => (
          <li key={i.id} className="py-2">
            {i.position} •{" "}
            <a
              href={i.targetUrl ?? "#"}
              className="text-blue-600 hover:underline"
            >
              {i.targetUrl}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
