import { NextResponse } from "next/server";
import { getOrCreateUserByPhone } from "@/lib/auth";

export async function POST(req: Request) {
  const { phone, code } = await req.json();
  if (!phone || !code) return NextResponse.json({ ok: false }, { status: 400 });
  const res = NextResponse.json({ ok: true });
  await getOrCreateUserByPhone(phone);
  res.cookies.set("phone", phone, { httpOnly: true, path: "/" });
  return res;
}

