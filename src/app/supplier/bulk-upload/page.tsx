"use client";
import { useState } from "react";

export default function BulkUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [downloading, setDownloading] = useState(false);

  async function upload() {
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/supplier/bulk-upload", { method: "POST", body: form });
    const data = await res.json();
    setMessage(data.message || "Uploaded");
  }

  async function downloadTemplate() {
    setDownloading(true);
    const headers = ["title","description","price","category","type"]; // CSV template
    const csv = headers.join(",") + "\n";
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rrnagar_bulk_template.csv";
    a.click();
    URL.revokeObjectURL(url);
    setDownloading(false);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h3 className="text-xl font-semibold">Bulk Upload via Excel/CSV</h3>
      <p className="mt-2 text-sm text-zinc-600">Use the template to upload multiple products/services.</p>
      <div className="mt-4 flex items-center gap-3">
        <input type="file" accept=".xlsx,.xls,.csv" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <button onClick={upload} className="rounded bg-black px-4 py-2 text-white">Upload</button>
        <button onClick={downloadTemplate} className="rounded border px-4 py-2">Download Template</button>
      </div>
      {message && <p className="mt-4 text-green-700">{message}</p>}
    </div>
  );
}

