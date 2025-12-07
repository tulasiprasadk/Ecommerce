"use client";

import { useState } from "react";
import type { Setting } from "@/generated/prisma/client";

// Client components cannot import Prisma enums
// So we define the options manually:
const PAYMENT_OPTIONS = ["RAZORPAY", "UPI", "PI"] as const;



export default function SettingsForm({ initial }: { initial: Setting }) {
  const [item, setItem] = useState<Setting>(initial);

  return (
    <form
      action="/api/admin/settings"
      method="post"
      className="mt-4 grid grid-cols-1 gap-4"
    >
      <div>
        <label className="block text-sm text-gray-700">Margin %</label>
        <input
          name="marginPercent"
          type="number"
          defaultValue={item.marginPercent}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-700">Platform Fee (Paise)</label>
        <input
          name="platformFeeFixedPaise"
          type="number"
          defaultValue={item.platformFeeFixedPaise}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-700">Delivery Fee (Paise)</label>
        <input
          name="deliveryFeeFixedPaise"
          type="number"
          defaultValue={item.deliveryFeeFixedPaise}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-700">Payment Option</label>
        <select
          name="paymentOption"
          defaultValue={item.paymentOption}
          className="w-full rounded border px-3 py-2"
        >
          {PAYMENT_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <button className="rounded bg-black px-4 py-2 text-white">
        Save Settings
      </button>
    </form>
  );
}
