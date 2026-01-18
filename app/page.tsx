import { redirect } from "next/navigation";
import { safeGetServerSession } from "@/lib/auth";

export default async function HomePage() {
  const session = await safeGetServerSession();
  if (!session) {
    redirect("/login");
  }
  redirect("/dashboard");
}
