import { redirect } from "next/navigation";

import { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";

export default async function AuthLayout({children} : {
  children: ReactNode
}) {
  // Get userId
  const { userId } = await auth();
  // User is already signed in
  if (userId != null) redirect("/");
  return (
    <main className="flex justify-center pt-40">
      {children}
    </main>
  );
}