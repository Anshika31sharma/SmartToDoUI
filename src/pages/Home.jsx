import React from "react";
import TaskForm from "../features/TaskForm";
import TaskList from "../features/TaskList";
import { useTaskContext } from "../context/TaskContext";

export default function Home() {
  const { setSelectedTask } = useTaskContext();

  return (
    <div className="max-w-3xl mx-auto p-4 relative">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-black mb-6 drop-shadow-sm">
        🚀 Smart To-Do List
      </h1>

      <TaskForm />
      <TaskList />
      <button
        className="fixed bottom-6 right-6 bg-indigo-600 text-white w-20 h-20 flex items-center justify-center rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 text-2xl"
        onClick={() => setSelectedTask({})}
        aria-label="Add new task"
      >
        +
      </button>
    </div>
  );
}
