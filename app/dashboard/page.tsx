import { redirect } from "next/navigation";
import { safeGetServerSession } from "@/lib/auth";
import DashboardClient from "@/components/dashboard/DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardRoutePage() {
  const session = await safeGetServerSession();
  if (!session) {
    redirect("/login");
  }

  return <DashboardClient />;
}
