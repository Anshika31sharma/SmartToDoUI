import { motion } from "framer-motion";
import React from "react";
import useCountdown from "../hooks/useCountdown";
import { useMutation, useQueryClient } from "react-query";
import { api } from "../lib/api";
import { useTaskContext } from "../context/TaskContext";

export default function TaskCard({ task }) {
  const label = useCountdown(task.deadline);
  const queryClient = useQueryClient();
  const { setSelectedTask } = useTaskContext();

  const updateMutation = useMutation(
    (updates) => api.put(`/tasks/${task.id}`, updates),
    {
      onSuccess: () => queryClient.invalidateQueries(["tasks"]),
    }
  );

  const deleteMutation = useMutation(() => api.delete(`/tasks/${task.id}`), {
    onSuccess: () => queryClient.invalidateQueries(["tasks"]),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition"
    >
      <div className="p-4 border bg-white rounded shadow-sm space-y-2">
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-semibold">{task.title}</h2>
          <span className="text-xs text-gray-500">{label}</span>
        </div>
        {task.description && <p className="text-sm">{task.description}</p>}

        <div className="flex gap-2 text-sm mt-2">
          {!task.isCompleted && (
            <button
              onClick={() => updateMutation.mutate({ isCompleted: true })}
              className="bg-green-500 px-2 py-1 text-white rounded"
              aria-label="Mark task as completed"
            >
              Complete
            </button>
          )}
          <button
            onClick={() => setSelectedTask(task)}
            className="bg-blue-500 px-2 py-1 text-white rounded"
            aria-label="Edit task"
          >
            Edit
          </button>
          <button
            onClick={() => deleteMutation.mutate()}
            className="bg-red-500 px-2 py-1 text-white rounded"
            aria-label="Delete task"
          >
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}
