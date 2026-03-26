"use client";

import Link from "next/link";

const CTASection = () => {
  return (
    <section
      className="py-24  dark:text-white text-black relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-black dark:text-white">
          Start Building Your Skills Today
        </h2>
        <p className="text-lg md:text-xl mb-10 text-black dark:text-gray-400">
          Discover projects, collaborate with peers, and grow your portfolio – all in one platform.
        </p>
        <div className="flex justify-center gap-4 flex-wrap text-black dark:text-white w-full md:w-auto">
          <Link
            href="/signup"
            className="bg-blue-primary w-full md:w-auto text-gray-900 dark:text-white px-8 py-4 ring-1 ring-gray-200 dark:ring-gray-700 rounded-full font-semibold shadow-lg hover:bg-blue-primary/80 transition"
          >
            Sign Up for Free
         </Link>
          <Link
            href="/dashboard" 
            className="border border-white w-full md:w-auto ring-1 ring-gray-200 dark:ring-gray-700 px-8 py-4 rounded-full hover:bg-gray-200/80 hover:text-gray-900 dark:hover:text-gray-900 transition dark:text-white"
          >
            Browse Projects
         </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
