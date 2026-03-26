"use client";

import { Linkedin, Twitter, Github } from "lucide-react";
import Link from "next/link";
import { LogoIcon } from "./ui/LogoIcon";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="md:max-w-6xl w-full mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm sm:text-base justify-center items-center md:justify-start md:items-start">
        {/* Logo / Brand */}
        <div className="flex flex-col space-y-4 w-full justify-center items-center md:justify-start md:items-start">
          <h1 className="text-xl sm:text-2xl font-bold text-white flex justify-center items-center gap-2">
            <LogoIcon />
            SkillLink
          </h1>
          <p className="text-gray-400 text-sm sm:text-base text-center md:text-left">
            Connect, collaborate, and grow your professional skills with real projects.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col space-y-2 justify-center items-center md:justify-start md:items-start">
          <h3 className="font-semibold text-white mb-2 text-sm sm:text-base">Navigation</h3>
          <Link href="#features" className="hover:text-white transition text-sm sm:text-base">Features</Link>
          <Link href="#how-it-works" className="hover:text-white transition text-sm sm:text-base">How It Works</Link>
          <Link href="#testimonials" className="hover:text-white transition text-sm sm:text-base">Testimonials</Link>
          <Link href="#cta" className="hover:text-white transition text-sm sm:text-base">Get Started</Link>
        </div>

        {/* Social Links */}
        <div className="flex flex-col space-y-4 justify-center items-center md:justify-start md:items-start">
          <h3 className="font-semibold text-white mb-2 text-sm sm:text-base ">Follow Us</h3>
          <div className="flex gap-10 w-full justify-center items-center md:justify-start md:items-start md:gap-4">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <Linkedin size={24} className="hover:text-white transition" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <Twitter size={24} className="hover:text-white transition" />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Github size={24} className="hover:text-white transition" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Legal / Copyright */}
      <div className="mt-12 border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
        <p>© 2026 SkillLink. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2">
          <Link href="/terms" className="hover:text-white transition text-sm sm:text-base">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-white transition text-sm sm:text-base">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
