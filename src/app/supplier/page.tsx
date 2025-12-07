"use client";
import { useState } from "react";

export default function Supplier() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [docType, setDocType] = useState<"AADHAAR" | "GST">("AADHAAR");
  const [file, setFile] = useState<File | null>(null);

  async function requestOtp() {
    await fetch("/api/auth/request-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone }) });
    setMessage("OTP sent");
  }
  async function verifyOtp() {
    await fetch("/api/auth/verify-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone, code }) });
    setMessage("Logged in");
  }

  async function submitKyc() {
    const fd = new FormData();
    fd.append("name", name);
    fd.append("address", address);
    fd.append("docType", docType);
    if (file) fd.append("file", file);
    const res = await fetch("/api/supplier/signup", { method: "POST", body: fd });
    const data = await res.json();
    setMessage(data.message || "Submitted");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h2 className="text-2xl font-bold">Supplier</h2>
      <div className="mt-4 flex gap-4">
        <button className={`rounded px-3 py-2 ${tab === "login" ? "bg-black text-white" : "border"}`} onClick={() => setTab("login")}>Login</button>
        <button className={`rounded px-3 py-2 ${tab === "signup" ? "bg-black text-white" : "border"}`} onClick={() => setTab("signup")}>Sign Up</button>
      </div>

      {tab === "login" && (
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
      )}

      {tab === "signup" && (
        <div className="mt-6 rounded border p-4">
          <h3 className="font-semibold">Supplier KYC</h3>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Business / Owner Name" className="mt-2 w-full rounded border px-3 py-2" />
          <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Business Address" className="mt-2 w-full rounded border px-3 py-2" />
          <div className="mt-2 flex gap-4">
            <label className="flex items-center gap-2"><input type="radio" checked={docType === "AADHAAR"} onChange={() => setDocType("AADHAAR")} /> Aadhaar Card</label>
            <label className="flex items-center gap-2"><input type="radio" checked={docType === "GST"} onChange={() => setDocType("GST")} /> GST Certificate</label>
          </div>
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="mt-2 w-full rounded border px-3 py-2" />
          <button onClick={submitKyc} className="mt-3 rounded bg-black px-4 py-2 text-white">Submit for Approval</button>
          <p className="mt-2 text-xs text-zinc-600">Admin will review and approve your supplier account.</p>
        </div>
      )}

      <div className="mt-6">
        <a href="/supplier/add" className="rounded border px-3 py-2">Go to Supplier Dashboard</a>
      </div>
      {message && <p className="mt-4 text-green-700">{message}</p>}
    </div>
  );
}

