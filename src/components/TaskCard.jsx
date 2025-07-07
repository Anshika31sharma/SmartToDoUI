import React from "react";
import { motion } from "framer-motion";
import useCountdown from "../hooks/useCountdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import { useTaskContext } from "../context/TaskContext";

export default function TaskCard({ task }) {
  const label = useCountdown(task.deadline);
  const queryClient = useQueryClient();
  const { setSelectedTask } = useTaskContext();

  const updateMutation = useMutation({
    mutationFn: (updates) => api.put(`/tasks/${task.id}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task marked as completed");
    },
    onError: () => {
      toast.error("Failed to update task");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/tasks/${task.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted");
    },
    onError: () => {
      toast.error("Failed to delete task");
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      layout
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all"
    >
      <div className="flex justify-between items-start mb-1">
        <h2 className="text-lg font-semibold text-gray-800">{task.title}</h2>
        <span className="text-xs text-gray-500">{label}</span>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
      )}

      <div className="flex gap-2 text-sm">
        {!task.isCompleted && (
          <button
            onClick={() => updateMutation.mutate({ isCompleted: true })}
            className="bg-green-500 hover:bg-green-600 px-3 py-1 text-white rounded transition"
            aria-label="Mark task as completed"
          >
            Complete
          </button>
        )}
        <button
          onClick={() => setSelectedTask(task)}
          className="bg-blue-500 hover:bg-blue-600 px-3 py-1 text-white rounded transition"
          aria-label="Edit task"
        >
          Edit
        </button>
        <button
          onClick={() => deleteMutation.mutate()}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 text-white rounded transition"
          aria-label="Delete task"
        >
          Delete
        </button>
      </div>
    </motion.div>
  );
}
