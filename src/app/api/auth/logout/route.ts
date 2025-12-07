import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.redirect("/");
  res.cookies.set("phone", "", { httpOnly: true, path: "/", expires: new Date(0) });
  return res;
}
