import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { $Enums } from "@/generated/prisma/client";
import { cookies } from "next/headers";
import QRCode from "qrcode";

export async function POST(req: Request) {
  const { listing: listingId, address, landmark, method } = await req.json();
  const phone = (await cookies()).get("phone")?.value;
  if (!phone) return NextResponse.json({ message: "Login required" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

  const listing = await prisma.listing.findUnique({ where: { id: listingId }, include: { supplier: true } });
  if (!listing) return NextResponse.json({ message: "Listing not found" }, { status: 404 });

  const settings = await prisma.setting.findFirst();
  const marginPercent = settings?.marginPercent ?? 15;
  const platformFeeFixedPaise = settings?.platformFeeFixedPaise ?? 0;
  const deliveryFeeFixedPaise = settings?.deliveryFeeFixedPaise ?? 0;

  const amountPaise = listing.pricePaise; // single item for demo
  const marginPaise = Math.round((amountPaise * marginPercent) / 100);
  const totalPaise = amountPaise + platformFeeFixedPaise + deliveryFeeFixedPaise;

  const order = await prisma.order.create({
    data: {
      customerId: user.id,
      address,
      landmark,
      paymentMethod: method,
      status: (method === "UPI" ? "PENDING" : "PAID") as $Enums.OrderStatus,
      totalAmountPaise: totalPaise,
      platformMarginPercent: marginPercent,
      platformFeePaise: platformFeeFixedPaise,
      deliveryFeePaise: deliveryFeeFixedPaise,
      items: { create: [{ listingId: listing.id, quantity: 1, amountPaise: amountPaise }] },
    },
    include: { items: true },
  });

  await prisma.transaction.create({
    data: {
      orderId: order.id,
      supplierId: listing.supplierId,
      amountGrossPaise: amountPaise,
      marginPaise,
      platformFeePaise: platformFeeFixedPaise,
      deliveryFeePaise: deliveryFeeFixedPaise,
      amountNetPaise: amountPaise - marginPaise,
    },
  });

  await prisma.notification.create({
    data: { supplierId: listing.supplierId, type: "order_created", payload: { orderId: order.id, customerPhone: user.phone } },
  });

  let upiQr: string | undefined;
  if (method === "UPI") {
    const upiVpa = process.env.UPI_VPA || "";
    const amount = (totalPaise / 100).toFixed(2);
    const upiUrl = `upi://pay?pa=${upiVpa}&am=${amount}&tn=${encodeURIComponent("RRnagar Order " + order.id)}`;
    upiQr = await QRCode.toDataURL(upiUrl);
  }
  if (method === "PI") {
    // placeholder for Pi payment initiation
  }

  return NextResponse.json({ message: "Order created", orderId: order.id, upiQr });
}
