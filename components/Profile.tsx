import React from "react";
import Image from "next/image";
import { useUser } from "@/hooks";

const Profile = () => {
  const { user, isLoading } = useUser();

  if (isLoading || !user) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse border border-gray-100 flex items-center justify-center">
        {!isLoading && (
          <span className="text-gray-400 text-xs text-center px-1">Log in</span>
        )}
      </div>
    );
  }

  return (
    /**
     * Circular component for the profile in the top right corner of the navbar
     */
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border border-gray-100">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name ?? "User profile"}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-500 font-medium text-sm">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
