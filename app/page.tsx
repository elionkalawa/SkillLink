import React from "react";
import HeroSection from "../components/LandingPage/HeroSection";
import FeaturesSection from "@/components/LandingPage/Features";
import HowItWorksSection from "@/components/LandingPage/HowItWorks";
import TestimonialsSection from "@/components/LandingPage/Testimonials";
import CTASection from "@/components/LandingPage/CTASection";
import Footer from "@/components/Footer";

const page = () => {
  return (
    <main className="w-full h-full bg-white dark:bg-black">
      <div className="w-full" id="home">
        <HeroSection />
      </div>
      <div className="w-full" id="features">
        <FeaturesSection />
      </div>
      <div className="w-full" id="how-it-works">
        <HowItWorksSection />
      </div>
      <div className="w-full" id="testimonials">
        <TestimonialsSection />
      </div>
      <div className="w-full" id="cta">
        <CTASection />
      </div>
      <div className="w-full">
        <Footer />
      </div>
    </main>
  );
};

export default page;
