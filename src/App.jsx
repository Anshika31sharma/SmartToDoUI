import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Sun, Moon } from "lucide-react";
import Home from "./pages/Home";

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark", "trouble");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("trouble");
    else setTheme("light");
  };

  const renderIcon = () => {
    if (theme === "dark") return <Moon className="w-5 h-5" />;
    return <Sun className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 trouble:from-red-100 trouble:to-yellow-200 transition-colors duration-500">
      <div className="p-4 flex justify-end">
        <button
          onClick={toggleTheme}
          className="px-3 py-2 rounded bg-indigo-500 hover:bg-indigo-600 text-white dark:bg-gray-700 dark:hover:bg-gray-600 trouble:bg-red-600 trouble:hover:bg-red-700 transition flex items-center gap-2"
          aria-label="Toggle theme"
        >
          {renderIcon()}
          <span className="sr-only">Toggle Theme</span>
        </button>
      </div>

      <ToastContainer position="top-right" />
      <Home />
    </div>
  );
}
