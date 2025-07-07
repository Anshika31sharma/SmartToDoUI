import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import useTaskBuckets from "../hooks/useTaskBuckets";
import TaskCard from "../components/TaskCard";
import TaskTabs from "../components/TaskTabs";

export default function TaskList() {
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("deadline");
  const [localTasks, setLocalTasks] = useState([]);

  const { data, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => api.get("/tasks").then((res) => res.data),
  });
  useEffect(() => {
    if (data && Array.isArray(data)) {
      localStorage.setItem("tasks", JSON.stringify(data));
      setLocalTasks(data);
    } else {
      const stored = localStorage.getItem("tasks");
      setLocalTasks(stored ? JSON.parse(stored) : []);
    }
  }, [data]);

  const validTasks = localTasks.filter(
    (task) => task.title?.trim() && task.deadline?.trim()
  );

  const sortedTasks = [...validTasks].sort(
    (a, b) => new Date(a[sort]) - new Date(b[sort])
  );

  const filteredTasks = sortedTasks.filter((task) =>
    task.title.toLowerCase().includes(filter.toLowerCase())
  );

  const buckets = useTaskBuckets(filteredTasks);

  if (isLoading)
    return <p className="text-center mt-10 text-gray-500">Loading tasks...</p>;

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <input
          type="search"
          placeholder="Search tasks..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded w-full sm:w-1/2"
          aria-label="Search tasks"
        />
        <select
          className="p-2 border rounded sm:w-auto"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sort tasks"
        >
          <option value="deadline">Sort by Deadline</option>
          <option value="createdAt">Sort by Created At</option>
        </select>
      </div>

      <TaskTabs
        buckets={buckets}
        render={(tasks) =>
          tasks.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              📝 No tasks found. Click the <span className="font-semibold">+</span> button on the right bottom corner to add a new one!
            </div>
          ) : (
            tasks.map((task) => <TaskCard key={task.id} task={task} />)
          )
        }
      />
    </>
  );
}
