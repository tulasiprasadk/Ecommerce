import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export default async function SidebarAds() {
  const [left, right] = await Promise.all([
    prisma.advertisement.findMany({
      where: { position: "LEFT", active: true },
    }),
    prisma.advertisement.findMany({
      where: { position: "RIGHT", active: true },
    }),
  ]);

  return (
    <>
      <div className="fixed left-2 top-24 z-40 flex w-32 flex-col gap-3">
        {left.map((ad) => (
          <Link
            key={ad.id}
            href={`/api/analytics/click?target=${encodeURIComponent(
              ad.targetUrl
            )}&ad=${ad.id}`}
            prefetch={false}
          >
            <Image
              src={ad.imageUrl}
              alt="ad"
              width={128}
              height={128}
              className="w-full"
            />
          </Link>
        ))}
      </div>

      <div className="fixed right-2 top-24 z-40 flex w-32 flex-col gap-3">
        {right.map((ad) => (
          <Link
            key={ad.id}
            href={`/api/analytics/click?target=${encodeURIComponent(
              ad.targetUrl
            )}&ad=${ad.id}`}
            prefetch={false}
          >
            <Image
              src={ad.imageUrl}
              alt="ad"
              width={128}
              height={128}
              className="w-full"
            />
          </Link>
        ))}
      </div>
    </>
  );
}
