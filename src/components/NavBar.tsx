"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-transparent bg-transparent">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-3 text-xl font-bold">
          <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full ring-2 ring-zinc-300 bg-white">
            <Image src="/logo.png" alt="RR Nagar Logo" width={44} height={44} className="object-contain" priority />
          </span>
          <span>RRnagar<span className="text-primary">.com</span></span>
        </Link>
        <button className="md:hidden rounded border px-3 py-1 text-sm" onClick={() => setOpen((o) => !o)}>{open ? "Close" : "Menu"}</button>
        <nav className="hidden items-center gap-4 text-sm md:flex">
          <Link href="/user" className="hover:text-primary">My Account</Link>
          <Link href="/blog" className="hover:text-primary">Blog</Link>
          <Link href="/faqs" className="hover:text-primary">FAQs</Link>
          <Link href="/contact" className="hover:text-primary">Contact</Link>
          <Link href="/api/auth/logout" prefetch={false} className="hover:text-primary">Logout</Link>
        </nav>
      </div>
      {open && (
        <div className="md:hidden border-t bg-transparent">
          <nav className="mx-auto max-w-6xl px-4 py-3 text-sm">
            <div className="flex flex-col gap-2">
              <Link href="/user">My Account</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/faqs">FAQs</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/api/auth/logout" prefetch={false}>Logout</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
