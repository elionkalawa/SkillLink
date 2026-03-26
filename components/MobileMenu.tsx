import React from "react";
import { NavLinksType } from "@/types";
import Link from "next/link";
interface MobileMenuProps {
  links: NavLinksType[];
  onClose?: () => void;
}

const MobileMenu = ({ links, onClose }: MobileMenuProps) => {
  return (
    <div className="w-full h-fit bg-white dark:bg-gray-900 flex flex-col">
      {links.map((link: NavLinksType, index: number) => {
        return (
          <Link
            href={link.href}
            key={index}
            className="block p-4 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
            onClick={onClose}
          >
            {link.name}
          </Link>
        );
      })}
    </div>
  );
};

export default MobileMenu;
