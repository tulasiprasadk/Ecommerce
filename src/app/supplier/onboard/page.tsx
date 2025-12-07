import Link from "next/link";
import { requireRole } from "@/lib/auth";

export default async function Onboard() {
  const admin = await requireRole(["ADMIN"]);
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h2 className="text-2xl font-bold">Supplier Onboarding</h2>
      <p className="mt-2 text-zinc-700">Add your services or products to reach RR Nagar residents.</p>
      <div className="mt-6 flex flex-col gap-4">
        {!!admin && (
          <Link href="/supplier/bulk-upload" className="rounded border p-4 hover:shadow">
            Upload multiple items via Excel template
          </Link>
        )}
        <Link href="/supplier/add" className="rounded border p-4 hover:shadow">
          Add a single service/product
        </Link>
      </div>
    </div>
  );
}
