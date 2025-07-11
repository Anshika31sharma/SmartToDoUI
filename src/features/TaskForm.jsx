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

  const [errors, setErrors] = useState({});

  const isEditing = selectedTask?.id;
  const queryClient = useQueryClient();

  useEffect(() => {
    if (selectedTask?.id) {
      const formattedDeadline = selectedTask.deadline
        ? new Date(selectedTask.deadline).toISOString().slice(0, 16)
        : "";

      setForm({
        title: selectedTask.title || "",
        description: selectedTask.description || "",
        deadline: formattedDeadline,
      });
    } else {
      const now = new Date();
      const formattedNow = now.toISOString().slice(0, 16);
      setForm({
        title: "",
        description: "",
        deadline: formattedNow,
      });
    }
  }, [selectedTask]);

  const validateForm = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Title is required.";
    } else if (form.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters.";
    }

    if (form.description.length > 300) {
      newErrors.description = "Description must be under 300 characters.";
    }

    const now = new Date();
    const deadline = new Date(form.deadline);
    if (!form.deadline || isNaN(deadline.getTime())) {
      newErrors.deadline = "Deadline is required.";
    } else if (deadline < now) {
      newErrors.deadline = "Deadline cannot be in the past.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createMutation = useMutation({
    mutationFn: (data) => api.post("/tasks", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setSelectedTask(null);
      toast.success("✅ Task created!", {
        autoClose: 3000,
        className: "toast-success",
      });
    },
    onError: () => {
      toast.error("❌ Failed to create task.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => api.put(`/tasks/${selectedTask.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setSelectedTask(null);
      toast.info("✏️ Task updated.", {
        autoClose: 3000,
        className: "toast-info",
      });
    },
    onError: () => {
      toast.error("❌ Failed to update task.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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

        <div>
          <input
            type="text"
            required
            placeholder="Title"
            className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-indigo-500"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <textarea
            placeholder="Description"
            className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-indigo-500"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div>
          <input
            type="datetime-local"
            required
            className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-indigo-500"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          />
          {errors.deadline && (
            <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>
          )}
        </div>

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
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition disabled:opacity-50"
            disabled={!form.title.trim() || !form.deadline}
          >
            {isEditing ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
