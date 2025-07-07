import  { useState, useEffect } from "react";
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
  return (
    <div className="flex flex-col items-center justify-center mt-20 text-gray-600">
      <div className="w-10 h-10 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-base font-medium">Loading tasks...</p>
    </div>
  );

  return (
    <>
      <div className="flex justify-center items-center mb-4 gap-2">
        <input
          type="search"
          placeholder="Search tasks..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border bg-white text-black rounded w-full sm:w-1/2"
          aria-label="Search tasks"
        />
     
      </div>
      <TaskTabs
        buckets={buckets}
        render={(tasks) =>
          tasks.length === 0 ? (
            <p className="text-center text-gray-500 text-lg mt-10">
              📝 No tasks found.
              <br />
              <span className="inline-block mt-2">
                Click the{" "}
                <span className="text-indigo-600 font-semibold text-xl">+</span>{" "}
                button on the
                <span className="font-semibold"> bottom-right </span> corner to
                add a new task.
              </span>
            </p>
          ) : (
           <div className="space-y-4">
  {tasks.map((task) => (
    <TaskCard key={task.id} task={task} />
  ))}
</div>

          )
        }
      />
    </>
  );
}
