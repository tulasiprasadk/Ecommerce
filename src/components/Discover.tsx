"use client";
import { useState } from "react";

const images = [
  { src: "/globe.svg", title: "Markets", desc: "Neighbourhood markets and vendors.", href: "/catalog" },
  { src: "/window.svg", title: "Home Services", desc: "Cleaning, maintenance and more.", href: "/catalog" },
  { src: "/file.svg", title: "Cuisine", desc: "Fresh meals from local kitchens.", href: "/catalog" },
  { src: "/next.svg", title: "Businesses", desc: "Local entrepreneurs and shops.", href: "/supplier" },
  { src: "/vercel.svg", title: "Community", desc: "A supportive neighbourhood.", href: "/blog" },
  { src: "/logo.svg", title: "Innovation", desc: "Digital-first connections.", href: "/blog" },
  { src: "/globe.svg", title: "Pharmacy", desc: "Medicines and wellness.", href: "/catalog" },
  { src: "/window.svg", title: "Groceries", desc: "Daily essentials.", href: "/catalog" },
  { src: "/file.svg", title: "Electronics", desc: "Devices and accessories.", href: "/catalog" },
  { src: "/next.svg", title: "Fitness", desc: "Gyms and trainers.", href: "/catalog" },
  { src: "/vercel.svg", title: "Events", desc: "Local happenings.", href: "/blog" },
  { src: "/logo.svg", title: "Support", desc: "We are here to help.", href: "/contact" },
];

export default function Discover() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold">Discover RR Nagar</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {images.map((i, idx) => (
          <button key={idx} className="group overflow-hidden rounded-xl border bg-white/10 p-2 shadow-sm transition hover:shadow-md touch-manipulation" onClick={() => setOpen(idx)}>
            <div className="flex h-16 w-full items-center justify-center overflow-hidden rounded-lg bg-white">
              <img src={i.src} alt={i.title} className="h-12 w-12 object-contain" />
            </div>
            <div className="p-2 text-left">
              <div className="text-xs font-semibold group-hover:text-primary">{i.title}</div>
              <p className="text-[11px] opacity-70">Tap to learn more</p>
            </div>
          </button>
        ))}
      </div>
      {open !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setOpen(null)}>
          <div className="w-full max-w-md rounded-2xl p-[2px] shadow-2xl" style={{ background: "linear-gradient(135deg, #ffd000, #c8102e)" }} onClick={(e) => e.stopPropagation()}>
            <div className="rounded-2xl bg-[#ffd000] p-4 text-[#c8102e]">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
                  <img src={images[open].src} alt={images[open].title} className="h-10 w-10 object-contain" />
                </div>
                <div>
                  <div className="text-lg font-bold">{images[open].title}</div>
                  <div className="text-sm opacity-80">{images[open].desc}</div>
                </div>
              </div>
              <div className="mt-4 rounded-lg bg-white p-3 text-sm text-[#c8102e] shadow">
                Rajarajeshwari Nagar is a growing neighbourhood with a strong local economy, diverse cuisine,
                and friendly services — celebrated through RRnagar.com.
              </div>
              <div className="mt-4 flex items-center justify-between">
                <a href={images[open].href} className="inline-flex items-center rounded bg-[#c8102e] px-4 py-2 text-white shadow hover:opacity-90">Explore</a>
                <button className="rounded border border-[#c8102e] px-4 py-2 text-[#c8102e]" onClick={() => setOpen(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
