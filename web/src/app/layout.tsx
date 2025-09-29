import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/AuthContext";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import "./globals.css";

export const metadata: Metadata = {
  title: "Task Management System",
  description: "A comprehensive task management system built with Next.js and NestJS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        <AnimatedBackground />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}