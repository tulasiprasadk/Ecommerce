"use client";
import { useState } from "react";
import type { Setting, PaymentOption } from "@/generated/prisma/client";

export default function SettingsForm({ initial }: { initial: Setting }) {
  const [item, setItem] = useState<Setting>(initial);
  const [saving, setSaving] = useState(false);
  async function save() {
    setSaving(true);
    await fetch("/api/admin/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) });
    setSaving(false);
  }
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h3 className="text-xl font-semibold">Platform Settings</h3>
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <label>Margin %<input type="number" value={item.marginPercent} onChange={(e) => setItem({ ...item, marginPercent: Number(e.target.value) })} className="mt-1 w-full rounded border px-3 py-2" /></label>
        <label>Platform Fee (paise)<input type="number" value={item.platformFeeFixedPaise} onChange={(e) => setItem({ ...item, platformFeeFixedPaise: Number(e.target.value) })} className="mt-1 w-full rounded border px-3 py-2" /></label>
        <label>Delivery Fee (paise)<input type="number" value={item.deliveryFeeFixedPaise} onChange={(e) => setItem({ ...item, deliveryFeeFixedPaise: Number(e.target.value) })} className="mt-1 w-full rounded border px-3 py-2" /></label>
        <label>Low Order Threshold (paise)<input type="number" value={item.lowOrderThresholdPaise} onChange={(e) => setItem({ ...item, lowOrderThresholdPaise: Number(e.target.value) })} className="mt-1 w-full rounded border px-3 py-2" /></label>
        <label>Payment Option<select value={item.paymentOption} onChange={(e) => setItem({ ...item, paymentOption: e.target.value as PaymentOption })} className="mt-1 w-full rounded border px-3 py-2"><option>RAZORPAY</option><option>UPI</option><option>PI</option></select></label>
        <label>UPI VPA<input value={item.upiVpa ?? ""} onChange={(e) => setItem({ ...item, upiVpa: e.target.value })} className="mt-1 w-full rounded border px-3 py-2" /></label>
        <label>WhatsApp Support<input value={item.whatsappSupportNumber ?? ""} onChange={(e) => setItem({ ...item, whatsappSupportNumber: e.target.value })} className="mt-1 w-full rounded border px-3 py-2" /></label>
      </div>
      <button onClick={save} className="mt-4 rounded bg-black px-4 py-2 text-white" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
    </div>
  );
}
