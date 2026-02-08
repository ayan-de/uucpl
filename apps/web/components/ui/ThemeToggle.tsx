"use client";

import { useTheme, type Theme } from "@/components/providers";

const themes: { value: Theme; label: string; icon: string }[] = [
  { value: "light", label: "Light", icon: "☀️" },
  { value: "dark", label: "Dark", icon: "🌙" },
  { value: "system", label: "System", icon: "💻" },
];

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        {themes.map((t) => (
          <button
            key={t.value}
            onClick={() => setTheme(t.value)}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all
              ${
                theme === t.value
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              }
            `}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Active theme: <strong>{theme}</strong> → Resolved: <strong>{resolvedTheme}</strong>
      </p>
    </div>
  );
}
