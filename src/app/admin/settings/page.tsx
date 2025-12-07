import { prisma } from "@/lib/prisma";
import SettingsForm from "./settingsForm";
import { requireRole } from "@/lib/auth";

export default async function Settings() {
  const admin = await requireRole(["ADMIN"]);
  if (!admin) return <div className="p-10">Forbidden</div>;
  let item = await prisma.setting.findFirst();
  if (!item) item = await prisma.setting.create({ data: { marginPercent: 15 } });
  return <SettingsForm initial={item} />;
}
