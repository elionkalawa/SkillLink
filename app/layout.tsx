import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/providers/Providers";
import { ThemeBootstrap } from "@/components/ThemeBootstrap";

export const metadata: Metadata = {
  title: {
    default: "SkillLink",
    template: "%s | SkillLink",
  },
  description:
    "SkillLink — Connect with talented collaborators and build projects together.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "SkillLink",
    description: "Connect with talented collaborators and build projects together.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className="antialiased">
        <ThemeBootstrap />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
