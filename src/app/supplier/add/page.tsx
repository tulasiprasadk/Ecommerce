"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SupplierAdd() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("PRODUCT");
  const [accepted, setAccepted] = useState(false);
  const [message, setMessage] = useState("");

  async function submit() {
    if (!accepted) { setMessage("Please accept terms"); return; }
    const res = await fetch("/api/supplier/add", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, description, price, category, type }) });
    const data = await res.json();
    setMessage(data.message || "Added");
    if (data.id) router.push(`/listing/${data.id}`);
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h3 className="text-xl font-semibold">Add Service/Product</h3>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="mt-3 w-full rounded border px-3 py-2" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="mt-2 w-full rounded border px-3 py-2" />
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
        <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price (₹)" className="rounded border px-3 py-2" />
        <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" className="rounded border px-3 py-2" />
      </div>
      <div className="mt-2 flex gap-4">
        <label className="flex items-center gap-2"><input type="radio" checked={type === "PRODUCT"} onChange={() => setType("PRODUCT")} /> Product</label>
        <label className="flex items-center gap-2"><input type="radio" checked={type === "SERVICE"} onChange={() => setType("SERVICE")} /> Service</label>
      </div>
      <p className="mt-3 text-sm text-zinc-600">You must be logged in and approved as a supplier. Contact admin if you see a &quot;Forbidden&quot; message.</p>
      <label className="mt-3 flex items-center gap-2"><input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} /> I accept terms and conditions</label>
      <button onClick={submit} className="mt-4 rounded bg-black px-4 py-2 text-white">Submit</button>
      {message && <p className="mt-3 text-green-700">{message}</p>}
    </div>
  );
}
