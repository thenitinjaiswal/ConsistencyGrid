import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/authOptions";
import { redirect } from "next/navigation";
import LandingPage from "@/components/landing/LandingPage";

/**
 * Landing Page (Server Side)
 * 
 * Handles authentication redirection before rendering the landing page content.
 * If the user is logged in, they are instantly redirected to the dashboard.
 */
export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return <LandingPage />;
}
