import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const body = await req.json();
  await prisma.message.create({ data: body });

  if (process.env.SMTP_HOST) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    });
    await transporter.sendMail({ from: process.env.SMTP_USER, to: process.env.SMTP_USER, subject: "RRnagar Support", text: JSON.stringify(body) });
  }
  return NextResponse.json({ message: "Message recorded" });
}

