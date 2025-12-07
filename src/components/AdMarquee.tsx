"use client";

import Image from "next/image";
import Link from "next/link";
import type { Advertisement } from "@/generated/prisma/client";

export default function AdMarquee({ ads }: { ads: Advertisement[] }) {
  if (!ads || ads.length === 0) return null;

  return (
    <div className="w-full overflow-hidden bg-zinc-100 py-2">
      <div className="flex animate-marquee gap-8 whitespace-nowrap">
        {ads.map((ad: Advertisement) => (
          <Link
            key={ad.id}
            href={`/api/analytics/click?target=${encodeURIComponent(
              ad.targetUrl
            )}&ad=${ad.id}`}
            prefetch={false}
            className="inline-block"
          >
            <Image
              src={ad.imageUrl}
              alt="ad"
              width={200}
              height={56}
              className="h-14 w-auto"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
