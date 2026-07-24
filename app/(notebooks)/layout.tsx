"use client";

import { Navbar } from "@/components/shared/navbar";
import { TopProgressBar } from "@/components/shared/top-progress-bar";
import { useAuth } from "@/providers/auth-provider";
import { redirect } from "next/navigation";
import { PageLoader } from "@/components/shared/page-loader";

export default function NotebooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   const { status } = useAuth();

  if (status === "checking") {
  return <PageLoader />;
}

  if (status === "unauthenticated") {
    redirect("/login");
    return null;
  }
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
