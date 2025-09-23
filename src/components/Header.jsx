import { BarChart3 } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 bg-white border-b">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-gray-700" />
          <h1 className="text-lg font-semibold">EV Analytics Dashboard</h1>
        </div>
        <div className="text-xs text-gray-500">
          Clean rebuild • React + Vite + Tailwind
        </div>
      </div>
    </header>
  );
}

