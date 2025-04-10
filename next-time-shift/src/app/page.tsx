import * as config from "@/data/constants";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Starfield from "@/app/components/stars/StarField";
import PublicNavMenu from "@/app/components/navbar/PublicNavMenu";

export default async function HomePage() {
  // Get userId
  const { userId } = await auth();
  // User is already signed in
  if (userId != null) redirect("/dashboard");
  return (
    <>
      <PublicNavMenu/>
      <main className="home pt-40">
        <Starfield/>
        <h1 className="font-grotesk text-9xl">supr<span className="text-accent">nova</span></h1>
        <div className="card">
          <p>{config.description}</p>
        </div>
      </main>
    </>
  );
}
