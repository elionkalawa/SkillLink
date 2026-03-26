"use client";

import { Search, Users, Award, BookOpen } from "lucide-react";

const features = [
  {
    icon: <Search size={36} stroke="#FF6B6B" />,
    title: "Discover Projects Quickly",
    description:
      "Browse a wide variety of real-world projects in your area of interest. Find opportunities that match your skills and grow your portfolio effortlessly.",
  },
  {
    icon: <Users size={36} stroke="#4ECDC4" />,
    title: "Collaborate Seamlessly",
    description:
      "Join teams, communicate with peers, and work together in a streamlined environment. Keep track of tasks, deadlines, and contributions in one place.",
  },
  {
    icon: <Award size={36} stroke="#FFD93D" />,
    title: "Build Your Portfolio",
    description:
      "Showcase your work, gain recognition, and get feedback from other professionals. Your completed projects automatically create a strong portfolio.",
  },
  {
    icon: <BookOpen size={36} stroke="#6A4C93" />,
    title: "Learn and Grow",
    description:
      "Access resources, tutorials, and mentorship opportunities. Improve your skills while working on live projects and collaborating with experienced developers.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-10 text-black">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 text-black dark:text-white w-full">
          Features That Empower You
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:text-white dark:bg-gray-900/30 p-6 rounded-xl ring-1 ring-gray-200 dark:ring-gray-700 shadow hover:shadow-lg transition"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
