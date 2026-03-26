import { LinkIcon } from "lucide-react";

export const Logo: React.FC<{
  size?: "sm" | "md" | "lg";
  className?: string;
}> = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: { container: "w-7 h-7", icon: 14, text: "text-lg" },
    md: { container: "w-9 h-9", icon: 18, text: "text-xl" },
    lg: { container: "w-12 h-12", icon: 24, text: "text-3xl" },
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div
        className={`${sizes[size].container} bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm shadow-indigo-400`}
      >
        <LinkIcon
          className="text-white transform -rotate-45"
          size={sizes[size].icon}
        />
      </div>
      <span
        className={`${sizes[size].text} font-black bg-clip-text text-black dark:text-white tracking-tight`}
      >
        Skill<span className="text-indigo-600">Link</span>
      </span>
    </div>
  );
};