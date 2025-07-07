import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTaskContext } from "../context/TaskContext";
import { api } from "../lib/api";
import { toast } from "react-toastify";

export default function TaskForm() {
  const { selectedTask, setSelectedTask } = useTaskContext();
  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  const isEditing = selectedTask?.id;
  const queryClient = useQueryClient();

  useEffect(() => {
    if (selectedTask?.id) {
      setForm({
        title: selectedTask.title || "",
        description: selectedTask.description || "",
        deadline: selectedTask.deadline?.slice(0, 16) || "",
      });
    } else {
      setForm({ title: "", description: "", deadline: "" });
    }
  }, [selectedTask]);

  const createMutation = useMutation({
    mutationFn: (data) => api.post("/tasks", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setSelectedTask(null);
      toast.success("Task created!");
    },
    onError: () => {
      toast.error("Failed to create task!");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => api.put(`/tasks/${selectedTask.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setSelectedTask(null);
      toast.success("Task updated!");
    },
    onError: () => {
      toast.error("Failed to update task!");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form };

    isEditing ? updateMutation.mutate(payload) : createMutation.mutate(payload);
  };

  if (selectedTask === null) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md space-y-4 animate-fade-in"
      >
        <h2 className="text-xl font-bold text-gray-800">
          {isEditing ? "Edit Task" : "New Task"}
        </h2>

        <input
          type="text"
          required
          placeholder="Title"
          className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-indigo-500"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          placeholder="Description"
          className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-indigo-500"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          type="datetime-local"
          required
          className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-indigo-500"
          value={form.deadline}
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
        />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            aria-label="Cancel task creation"
            onClick={() => setSelectedTask(null)}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            aria-label={isEditing ? "Update task" : "Create task"}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition"
          >
            {isEditing ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
