"use client";

import { UserPlus, FolderSearch, Users, Send } from "lucide-react";

const steps = [
  {
    icon: <UserPlus size={60} stroke="#FF6B6B" />,
    title: "Sign Up",
    desc: "Create your free account in seconds to get started.",
  },
  {
    icon: <FolderSearch size={60} stroke="#4ECDC4" />,
    title: "Browse Projects",
    desc: "Find projects that match your skills and interests.",
  },
  {
    icon: <Users size={60} stroke="#FFD93D" />,
    title: "Join a Team",
    desc: "Collaborate seamlessly with peers on exciting projects.",
  },
  {
    icon: <Send size={60} stroke="#6A4C93" />,
    title: "Share Your Work",
    desc: "Showcase completed projects and grow your portfolio.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 text-black dark:text-white dark:bg-gray-900/20">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-16">How It Works</h2>
        <div className="relative">
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center space-y-16 md:space-y-0">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-col items-center md:w-1/4 relative"
              >
                <div className="bg-white dark:bg-blue-primary/20 p-6 rounded-full shadow-md mb-4 z-10">
                  {step.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-center">{`${idx + 1}. ${step.title}`}</h3>
                <p className="text-gray-500 dark:text-gray-300 text-center mt-2 text-sm sm:text-base">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
