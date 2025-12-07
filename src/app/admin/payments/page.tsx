import Image from "next/image";
import Link from "next/link";
import { requireRole } from "@/lib/auth";

type ProofMeta = {
  orderId: string;
  utr: string | null;
  proof: string | null;
  submittedAt: string;
  reviewed?: boolean;
  reviewedAt?: string;
  action?: string;
};

type AdminProof = {
  file: string;
  meta: ProofMeta | null;
  order: {
    id: string;
    status: string;
    totalAmountPaise: number;
    items: { id: string; amountPaise: number; listing: { title: string } }[];
  } | null;
};

export default async function PaymentsAdmin() {
  const admin = await requireRole(["ADMIN"]);
  if (!admin) return <div className="p-10">Forbidden</div>;

  const res = await fetch("/api/admin/payments", { cache: "no-store" });
  const data = await res.json();
  const proofs: AdminProof[] = data.proofs || [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h2 className="text-2xl font-bold">Payment Proofs</h2>
      <p className="mt-2 text-sm text-zinc-600">Review submitted UTRs and screenshots, then confirm orders.</p>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {proofs.length === 0 && <div className="rounded border p-4">No proofs found</div>}
        {proofs.map((p, idx) => (
          <div key={idx} className="overflow-hidden rounded-2xl border shadow-sm">
            {p?.meta?.proof ? (
              <Image src={p.meta.proof} alt="Proof" width={800} height={450} className="h-48 w-full object-cover" />
            ) : (
              <div className="flex h-48 items-center justify-center bg-muted">No image</div>
            )}
            <div className="p-4">
              <div className="font-semibold">Order {p?.order?.id || p?.meta?.orderId}</div>
              <div className="mt-1 text-sm text-zinc-700">Status: {p?.order?.status}</div>
              <div className="mt-1 text-sm text-zinc-700">UTR: {p?.meta?.utr || "—"}</div>
              <div className="mt-1 text-xs text-zinc-500">Submitted: {p?.meta?.submittedAt}</div>
              <ul className="mt-3 text-sm">
                {p?.order?.items?.map((it) => (
                  <li key={it.id}>{it.listing.title} — ₹{(it.amountPaise / 100).toFixed(2)}</li>
                ))}
              </ul>
              {p?.order && (
                <div className="mt-3 font-semibold">Total: ₹{(p.order.totalAmountPaise / 100).toFixed(2)}</div>
              )}
              <div className="mt-4 flex items-center gap-2">
                <form action="/api/admin/payments" method="post">
                  <input type="hidden" name="orderId" value={p?.order?.id || p?.meta?.orderId} />
                  <input type="hidden" name="action" value="confirm" />
                  <button className="rounded bg-black px-4 py-2 text-white">Confirm Order</button>
                </form>
                <Link href={`/checkout/success?order=${encodeURIComponent(p?.order?.id || p?.meta?.orderId || "")}`} className="rounded border px-3 py-2">View Order</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
