import { redirect } from "next/navigation";
import { safeGetServerSession } from "@/lib/auth";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default async function DashboardRoutePage() {
  const session = await safeGetServerSession();
  if (!session) {
    redirect("/login");
  }

  return <DashboardClient />;
}
