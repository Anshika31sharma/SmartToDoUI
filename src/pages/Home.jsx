import React from "react";
import TaskForm from "../features/TaskForm";
import TaskList from "../features/TaskList";
import { useTaskContext } from "../context/TaskContext";

export default function Home() {
  const { setSelectedTask } = useTaskContext();

  return (
    <div className="max-w-3xl mx-auto p-4 relative">
      <h1 className="text-4xl sm:text-5xl font-bold text-center text-gray-900 mb-8 drop-shadow">
        🚀 <span className="text-black">Smart To-Do List</span>
      </h1>

      <TaskForm />
      <TaskList />
     <button
  aria-label="Add new task"
  onClick={() => setSelectedTask({})}
  className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white text-3xl w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out"
>
  +
</button>

    </div>
  );
}
