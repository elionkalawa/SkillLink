"use client";

import { NavLinksType } from "@/types";
import { guestLinks } from "@/lib";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import MobileMenu from "../MobileMenu";
import { ThemeToggle } from "../ThemeToggle";
import { Logo } from "../ui/Logo";

const GuestNavbar = () => {
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  return (
    <>
      <nav className="relative w-full h-24 flex items-center justify-between px-4 sm:px-10 lg:px-20 dark:text-white">
        {/* Mobile menu dropdown */}
        {openMobileMenu && (
          <div className="absolute top-24 left-0 right-0 z-50 border-b border-black/20 sm:hidden dark:bg-gray-900/30">
            <MobileMenu links={guestLinks} />
          </div>
        )}

        {/* LOGO */}
        <div className="h-full flex items-center justify-center">
          <Logo />
        </div>

        {/* Nav Links */}
        <div className="hidden sm:flex gap-4 text-black dark:text-white">
          {guestLinks.map((link: NavLinksType, index: number) => (
            <Link key={index} href={link.href}>
              {link.name}
            </Link>
          ))}
        </div>

        {/* Auth Links */}
        <div className="hidden sm:flex gap-4">
          <button
            type="button"
            className="py-1 px-4 rounded-lg bg-blue-600 text-white"
          >
            Sign Up
          </button>
          <button
            type="button"
            className="py-1 px-4 rounded-lg ring-1 ring-blue-600 text-blue-600"
          >
            Log In
          </button>
          <div className="">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="sm:hidden text-black dark:text-white">
          <button
            type="button"
            className="p-2 rounded-lg hover:bg-black/20 dark:hover:bg-white/20"
            onClick={() => setOpenMobileMenu(!openMobileMenu)}
          >
            {openMobileMenu ? <X /> : <Menu />}
          </button>
        </div>
      </nav>
    </>
  );
};

export default GuestNavbar;
