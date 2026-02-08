"use client";

import { ThemeToggle } from "@/components/ui";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-8 transition-colors">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Theme Test
        </h1>
        <ThemeToggle />
      </div>
    </div>
  );
}
