import Link from "next/link";
import { requireRole } from "@/lib/auth";

export default async function Admin() {
  const admin = await requireRole(["ADMIN"]);
  if (!admin) return <div className="p-10">Forbidden</div>;
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h2 className="text-2xl font-bold">Admin Panel</h2>
      <div className="mt-6 flex flex-col gap-4">
        <Link href="/admin/categories" className="rounded border p-4">Manage Categories</Link>
        <Link href="/admin/ads" className="rounded border p-4">Manage Advertisements</Link>
        <Link href="/admin/settings" className="rounded border p-4">Platform Settings</Link>
        <Link href="/admin/reports" className="rounded border p-4">Reports</Link>
        <Link href="/admin/suppliers" className="rounded border p-4">Approve Supplier</Link>
        <Link href="/admin/payments" className="rounded border p-4">Review Payments</Link>
        <Link href="/admin/kyc" className="rounded border p-4">Review KYC</Link>
      </div>
    </div>
  );
}
