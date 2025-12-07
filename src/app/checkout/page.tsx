"use client";
import { useEffect, useRef, useState } from "react";

export default function Checkout() {
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const listing = params.get("listing") || "";
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [method, setMethod] = useState<"UPI" | "PI">("UPI");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const pollRef = useRef<number | null>(null);

  async function requestOtp() {
    await fetch("/api/auth/request-otp", { method: "POST", body: JSON.stringify({ phone }), headers: { "Content-Type": "application/json" } });
  }
  async function verifyOtp() {
    await fetch("/api/auth/verify-otp", { method: "POST", body: JSON.stringify({ phone, code }), headers: { "Content-Type": "application/json" } });
  }

  async function placeOrder() {
    const res = await fetch("/api/order/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ listing, address, landmark, method }) });
    const data = await res.json();
    if (data.orderId) setOrderId(data.orderId);
    if (data.upiQr) setQrDataUrl(data.upiQr);
    setMessage(data.message || "Order created");
  }

  async function confirmPaid() {
    if (!orderId) return;
    const res = await fetch("/api/order/confirm", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId }) });
    const data = await res.json();
    if (data.ok) window.location.href = `/checkout/success?order=${orderId}`;
  }

  useEffect(() => {
    async function poll() {
      if (!orderId) return;
      const res = await fetch(`/api/order/status?orderId=${encodeURIComponent(orderId)}`);
      const data = await res.json();
      const status = data?.order?.status;
      if (status === "PAID" || status === "CONFIRMED") {
        if (pollRef.current) window.clearInterval(pollRef.current);
        window.location.assign(`/checkout/success?order=${orderId}`);
      }
    }
    if (qrDataUrl && orderId) {
      if (pollRef.current) window.clearInterval(pollRef.current);
      pollRef.current = window.setInterval(poll, 5000);
    }
    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
      pollRef.current = null;
    };
  }, [qrDataUrl, orderId]);

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h2 className="text-2xl font-bold">Checkout</h2>
      <div className="mt-6 rounded border p-4">
        <h3 className="font-semibold">Login with Phone</h3>
        <div className="mt-2 flex gap-2">
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="flex-1 rounded border px-3 py-2" />
          <button onClick={requestOtp} className="rounded border px-3 py-2">Send OTP</button>
        </div>
        <div className="mt-2 flex gap-2">
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="OTP (use 000000)" className="flex-1 rounded border px-3 py-2" />
          <button onClick={verifyOtp} className="rounded border px-3 py-2">Verify</button>
        </div>
      </div>

      <div className="mt-6 rounded border p-4">
        <h3 className="font-semibold">Delivery Details</h3>
        <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" className="mt-2 w-full rounded border px-3 py-2" />
        <input value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="Landmark" className="mt-2 w-full rounded border px-3 py-2" />
      </div>

      <div className="mt-6 rounded border p-4">
        <h3 className="font-semibold">Payment</h3>
        <div className="mt-2 flex gap-4">
          <label className="flex items-center gap-2"><input type="radio" checked={method === "UPI"} onChange={() => setMethod("UPI")} /> UPI</label>
          <label className="flex items-center gap-2"><input type="radio" checked={method === "PI"} onChange={() => setMethod("PI")} /> Pi Network</label>
        </div>
        <button onClick={placeOrder} className="mt-3 rounded bg-black px-4 py-2 text-white">Pay</button>
        {method === "UPI" && qrDataUrl && (
          <div className="mt-4">
            <img src={qrDataUrl} alt="UPI QR" className="h-48 w-48" />
            <p className="text-sm text-zinc-600">Scan to pay via UPI</p>
            <button onClick={confirmPaid} className="mt-3 rounded border px-3 py-2">I have paid</button>
            <div className="mt-4 rounded border p-3">
              <div className="font-semibold">Or submit UTR / screenshot</div>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!orderId) return;
                  const form = e.currentTarget as HTMLFormElement;
                  const fd = new FormData(form);
                  fd.append("orderId", orderId);
                  const res = await fetch("/api/order/proof", { method: "POST", body: fd });
                  const data = await res.json();
                  if (data?.ok) window.location.href = `/checkout/success?order=${orderId}`;
                }}
                className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2"
              >
                <input name="utr" placeholder="UTR / Reference" className="rounded border px-3 py-2" />
                <input name="proof" type="file" accept="image/*" className="rounded border px-3 py-2" />
                <button className="rounded bg-black px-4 py-2 text-white md:col-span-2">Submit Proof</button>
              </form>
            </div>
          </div>
        )}
        {method === "PI" && (
          <div className="mt-4 rounded border p-4">
            <div className="text-lg font-semibold">Pi Network Payment</div>
            <div className="mt-2 text-sm text-zinc-600">Open your Pi app to approve the payment request. This is a visual mock.</div>
            <button className="mt-3 rounded bg-purple-600 px-4 py-2 text-white">Open Pi</button>
          </div>
        )}
      </div>
      {message && <p className="mt-4 text-green-700">{message}</p>}
    </div>
  );
}
