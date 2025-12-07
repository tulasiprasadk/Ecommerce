import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const results = await prisma.listing.findMany({
      where: {
        available: true,
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
        ],
      },
      include: { supplier: true, category: true },
      take: 20,
    });
    return NextResponse.json({ results });
  } catch (e) {
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
