"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import GuestNavbar from "./GuestNavbar";
import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

const HeroSection = () => {
  const router = useRouter();
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    };

    const timeoutId = setTimeout(updateTheme, 0);

    // Watch for class changes so the image updates instantly on toggle
    const observer = new MutationObserver(() => updateTheme());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div className="w-full h-screen">
        <div className="z-999 top-0 left-0 right-0 backdrop-blur-sm fixed">
          <GuestNavbar />
        </div>

        {/* Background Image */}
        <div className="w-full h-full">
          {theme && (
            <Image
              src={theme === "dark" ? "/assets/hero-img-dark.png" : "/assets/hero-img-light.png"}
              alt="Hero Background"
              fill
              className="w-full h-full object-cover object-left sm:object-center"
            />
          )}
        </div>
        <div className="w-full h-full absolute top-0 left-0 right-0 py-20 px-4 sm:px-10 lg:px-20 bg-linear-to-b from-transparent from-80% to-95% to-white dark:to-black ">
          <div className="w-full h-full flex flex-col justify-center items-start gap-10 max-w-xl">
            <h1 className="sm:text-5xl lg:text-7xl text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-green-500 to-blue-500">
              Turn Skills Into
              <br />
              Opportunities
            </h1>
            <p className="text-black dark:text-white  lg:text-lg text-sm mt-2 ">
              SkillLink helps you discover exciting projects that match your
              skills, connect and collaborate with peers across different
              industries, and build a strong professional portfolio. Grow your
              expertise, showcase your talents, and unlock new opportunities to
              advance your career.
            </p>
            <div className="flex md:flex-row flex-col justify-center gap-4 w-full md:w-auto">
              <button
                className="bg-blue-500 text-white md:px-4 px-3 py-2 rounded-lg hover:bg-blue-600 transition flex justify-center items-center gap-2"
                onClick={() => router.push("/auth/login")}
              >
                Get Started <ArrowUpRight />
              </button>
              <button
                className="border border-blue-500 text-blue-500 px-6 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition"
                onClick={() => router.push("/dashboard")}
              >
                Browse Projects
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
