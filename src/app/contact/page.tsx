"use client";
import { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  async function submit() {
    const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, phone, content }) });
    const data = await res.json();
    setMessage(data.message || "Sent");
  }

  const whatsapp = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || ""}?text=${encodeURIComponent("Help needed")}`;

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h2 className="text-2xl font-bold">Customer Care</h2>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="mt-4 w-full rounded border px-3 py-2" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="mt-2 w-full rounded border px-3 py-2" />
      <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="mt-2 w-full rounded border px-3 py-2" />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Message" className="mt-2 w-full rounded border px-3 py-2" />
      <div className="mt-3 flex gap-3">
        <button onClick={submit} className="rounded bg-black px-4 py-2 text-white">Send</button>
        <a href={whatsapp} target="_blank" rel="noopener" className="rounded border px-4 py-2">WhatsApp</a>
      </div>
      {message && <p className="mt-3 text-green-700">{message}</p>}
    </div>
  );
}

