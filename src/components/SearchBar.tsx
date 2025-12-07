"use client";
import { useState } from "react";

type SearchResult = {
  id: string;
  title: string;
  pricePaise: number;
  supplier?: { name: string } | null;
  category?: { name: string } | null;
};

export default function SearchBar() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  async function onSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) {
        setResults([]);
        return;
      }
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const data = await res.json();
        setResults(Array.isArray(data?.results) ? data.results : []);
      } else {
        const text = await res.text();
        try {
          const data = text ? JSON.parse(text) : { results: [] };
          setResults(Array.isArray(data?.results) ? data.results : []);
        } catch {
          setResults([]);
        }
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={onSearch} className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products or services"
          className="flex-1 rounded-full border border-white/40 bg-white/80 px-4 py-2 backdrop-blur"
        />
        <button className="rounded-full bg-black/80 px-4 py-2 text-white hover:bg-black">Search</button>
      </form>
      {loading && <p className="mt-3 text-sm">Searching…</p>}
      {!!results.length && (
        <ul className="mt-4 divide-y">
          {results.map((r) => (
            <li key={r.id} className="py-2">
              <a href={`/listing/${r.id}`} className="font-medium hover:underline">
                {r.title} — ₹{(r.pricePaise / 100).toFixed(2)}
              </a>
              <div className="text-xs text-zinc-600">{r.supplier?.name} • {r.category?.name}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
