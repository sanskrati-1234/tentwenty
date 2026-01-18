import { safeGetServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";

export default async function LoginPage() {
  const session = await safeGetServerSession();

  if (session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex">
      <div className="w-full md:w-1/2 flex items-center justify-center px-6">
        <LoginForm />
      </div>

      <div className="hidden md:flex w-1/2 bg-blue-600 text-white items-center justify-center px-12">
        <div className="max-w-md">
          <h1 className="text-3xl font-bold mb-4">ticktock</h1>
          <p className="text-sm leading-relaxed">
            Introducing ticktock, our cutting-edge timesheet web application
            designed to revolutionize how you manage employee work hours.
          </p>
        </div>
      </div>
    </div>
  );
}
