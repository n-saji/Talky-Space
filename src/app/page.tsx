import Footer from "./(landingPage)/footer";
import HeroSection from "./(landingPage)/hero";
import NavBar from "./(landingPage)/navBar";

export const metadata = {
  title: "TalkySpace - Home",
  description: "A modern chat application built with Next.js and Tailwind CSS.",
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <NavBar landingPage={true} />

      {/* hero */}
      <HeroSection />

      {/* testimonials */}
      {/* footer */}
      <Footer />
    </div>
  );
}
