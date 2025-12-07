import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export async function AdMarquee({ position }: { position: "TOP" | "BOTTOM" }) {
  const ads = await prisma.advertisement.findMany({
    where: { position, active: true },
    orderBy: { createdAt: "desc" },
  });
  if (!ads.length) return null;
  return (
    <div className="w-full overflow-hidden bg-zinc-100 py-2">
      <div className="flex animate-marquee gap-8 whitespace-nowrap">
        {ads.map((ad) => (
          <Link key={ad.id} href={`/api/analytics/click?target=${encodeURIComponent(ad.targetUrl)}&ad=${ad.id}`} prefetch={false} className="inline-block">
            <Image src={ad.imageUrl} alt="ad" width={200} height={56} className="h-14 w-auto" />
          </Link>
        ))}
      </div>
      <style>{`
        .animate-marquee { animation: marquee 30s linear infinite; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
}
