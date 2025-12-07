import Image from "next/image";
import { requireRole } from "@/lib/auth";

type KycMeta = {
  phone: string;
  name: string;
  address: string;
  docType: string;
  file: string | null;
  submittedAt: string;
  reviewed?: boolean;
  reviewedAt?: string;
};

type KycItem = {
  file: string;
  meta: KycMeta | null;
};

export default async function AdminKyc() {
  const admin = await requireRole(["ADMIN"]);
  if (!admin) return <div className="p-10">Forbidden</div>;

  const res = await fetch("/api/admin/kyc", { cache: "no-store" });
  const data = await res.json();
  const items: KycItem[] = data.items || [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h2 className="text-2xl font-bold">Supplier KYC</h2>
      <p className="mt-2 text-sm text-zinc-600">Approve supplier registrations submitted with Aadhaar or GST.</p>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {items.length === 0 && <div className="rounded border p-4">No KYC submissions</div>}
        {items.map((p, idx) => (
          <div key={idx} className="overflow-hidden rounded-2xl border shadow-sm">
            {p?.meta?.file ? (
              <Image src={p.meta.file} alt="KYC" width={800} height={450} className="h-48 w-full object-cover" />
            ) : (
              <div className="flex h-48 items-center justify-center bg-muted">No document</div>
            )}
            <div className="p-4">
              <div className="font-semibold">{p?.meta?.name} • {p?.meta?.phone}</div>
              <div className="mt-1 text-sm text-zinc-700">Type: {p?.meta?.docType}</div>
              <div className="mt-1 text-xs text-zinc-500">Submitted: {p?.meta?.submittedAt}</div>
              <div className="mt-1 text-sm text-zinc-700">Address: {p?.meta?.address}</div>
              <div className="mt-4 flex items-center gap-2">
                <form action="/api/admin/kyc" method="post">
                  <input type="hidden" name="phone" value={p?.meta?.phone || ""} />
                  <button className="rounded bg-black px-4 py-2 text-white">Approve Supplier</button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

