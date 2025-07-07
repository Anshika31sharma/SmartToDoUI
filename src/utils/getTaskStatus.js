export const getTaskStatus = (task) => {
  const now = new Date();
  const deadline = new Date(task.deadline);

  if (task.isCompleted) return "success";
  if (now > deadline) return "failure";
  return "ongoing";
};
