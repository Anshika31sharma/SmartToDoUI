import { useMemo } from "react";

export default function useTaskBuckets(tasks = []) {
  const now = new Date();

  return useMemo(() => {
    const ongoing = [];
    const success = [];
    const failure = [];

    tasks.forEach((task) => {
      const deadline = new Date(task.deadline);

      if (task.isCompleted) {
        success.push(task);
      } else if (deadline > now) {
        ongoing.push(task);
      } else {
        failure.push(task);
      }
    });

    return { ongoing, success, failure };
  }, [tasks]);
}
