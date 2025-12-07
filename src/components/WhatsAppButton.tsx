"use client";

export default function WhatsAppButton() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP || "";
  if (!number) return null;
  const url = `https://wa.me/${number}?text=${encodeURIComponent("Hello RRnagar.com support")}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-green-500 px-4 py-3 text-white shadow-lg hover:bg-green-600"
    >
      <span>WhatsApp</span>
    </a>
  );
}
