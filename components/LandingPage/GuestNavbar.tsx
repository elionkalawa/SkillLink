"use client";

import { NavLinksType } from "@/types";
import { guestLinks } from "@/lib";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import MobileMenu from "../MobileMenu";
import { ThemeToggle } from "../ThemeToggle";
import { Logo } from "../ui/Logo";
import { useSession } from "next-auth/react";

const GuestNavbar = () => {
  const { data: session, status } = useSession();
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const isLoading = status === "loading";

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
        <div className="hidden sm:flex gap-4 items-center">
          {isLoading ? (
            <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-lg"></div>
          ) : session ? (
            <Link
              href="/dashboard"
              className="py-2 px-6 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                className="py-1 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                className="py-1 px-4 rounded-lg ring-1 ring-blue-600 text-blue-600 hover:bg-blue-50 transition"
              >
                Log In
              </Link>
            </>
          )}
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
