import { redirect } from "next/navigation";
import { safeGetServerSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await safeGetServerSession();
  if (!session) {
    redirect("/login");
  }
  redirect("/dashboard");
}
