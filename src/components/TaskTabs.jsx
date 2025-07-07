import { useState } from "react";

export default function TaskTabs({ buckets, render }) {
  const [tab, setTab] = useState("ongoing");

  return (
    <>
      <div className="flex justify-center gap-2 mb-4">
        {["ongoing", "success", "failure"].map((type) => (
          <button
            key={type}
            onClick={() => setTab(type)}
            className={`px-4 py-2 rounded ${
              tab === type ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {type === "ongoing" && `Ongoing (${buckets.ongoing.length})`}
            {type === "success" && `Completed (${buckets.success.length})`}
            {type === "failure" && `Missed (${buckets.failure.length})`}
          </button>
        ))}
      </div>

      <div>{render(buckets[tab])}</div>
    </>
  );
}
