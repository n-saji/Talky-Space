import { cookies } from "next/headers";
import Footer from "./(landingPage)/footer";
import HeroSection from "./(landingPage)/hero";
import NavBar from "./(landingPage)/navBar";

export const metadata = {
  title: "TalkySpace - Home",
  description: "A modern chat application built with Next.js and Tailwind CSS.",
};

export default async function Home() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.get("access_token")?.value;
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <NavBar landingPage={true} isAuthenticated={!!cookieHeader} />

      {/* hero */}
      <HeroSection />

      {/* testimonials */}
      {/* footer */}
      <Footer />
    </div>
  );
}
