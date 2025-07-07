import { useState } from "react";

export default function TaskTabs({ buckets, render }) {
  const [tab, setTab] = useState("ongoing");

  const tabTypes = [
    { key: "ongoing", label: "Ongoing", count: buckets?.ongoing?.length || 0 },
    { key: "success", label: "Completed", count: buckets?.success?.length || 0 },
    { key: "failure", label: "Missed", count: buckets?.failure?.length || 0 },
  ];

  return (
    <>
      <div className="flex justify-center gap-2 mb-4">
        {tabTypes.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            aria-label={`Show ${label} tasks`}
            className={`px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
              tab === key
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            {`${label} (${count})`}
          </button>
        ))}
      </div>

      <div>{render(buckets?.[tab] || [])}</div>
    </>
  );
}
