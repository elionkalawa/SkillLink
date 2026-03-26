import Link from "next/link";
import React from "react";
export type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  route: string;
  counter: number;
  activeRoute: string;
  onClick?: () => void;
};

const SidebarItem = ({
  icon,
  label,
  collapsed,
  route,
  counter,
  activeRoute,
  onClick,
}: SidebarItemProps) => {
  return (
    <Link
      href={route}
      onClick={onClick}
      className={`flex items-center p-4 font-bold rounded-2xl transition-all text-sm ${
        collapsed ? "justify-center" : ""
      } ${
        activeRoute === route
          ? "bg-blue-primary text-white"
          : "text-slate-600 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}
    >
      <span className="text-xl">{icon}</span>

      {!collapsed && (
        <div className="ml-3 w-full whitespace-nowrap flex justify-between items-center px-2">
          {label}{" "}
          <span
            className={`text-xs ${counter > 0 ? "bg-notification text-white rounded-lg px-2 py-1" : ""} `}
          >
            {counter === 0 ? "" : counter}
          </span>
        </div>
      )}
    </Link>
  );
};

export default SidebarItem;
