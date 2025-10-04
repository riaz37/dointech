import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/AuthContext";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { BackendWarmup } from "@/components/BackendWarmup";
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
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-slate-900 text-white overflow-x-hidden">
        <AnimatedBackground />
        <BackendWarmup />
        <div className="relative z-10">
          <AuthProvider>
            {children}
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}