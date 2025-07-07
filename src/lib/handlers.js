import { http, HttpResponse } from "msw";
import { getTasks, saveTasks } from "../utils/storage";

export const handlers = [
  http.get("/api/tasks", () => {
    const tasks = getTasks();
    return HttpResponse.json(tasks);
  }),

  http.post("/api/tasks", async ({ request }) => {
    const tasks = getTasks();
    const body = await request.json();

    const newTask = {
      ...body,
      id: crypto.randomUUID(),
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedTasks = [...tasks, newTask];
    saveTasks(updatedTasks);

    return HttpResponse.json(newTask, { status: 201 });
  }),

  http.put("/api/tasks/:id", async ({ params, request }) => {
    const tasks = getTasks();
    const { id } = params;
    const body = await request.json();

    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? { ...task, ...body, updatedAt: new Date().toISOString() }
        : task
    );
    saveTasks(updatedTasks);
    const updated = updatedTasks.find((task) => task.id === id);
    return HttpResponse.json(updated);
  }),

  http.delete("/api/tasks/:id", ({ params }) => {
    const tasks = getTasks();
    const updatedTasks = tasks.filter((t) => t.id !== params.id);
    saveTasks(updatedTasks);
    return new HttpResponse(null, { status: 200 });
  }),
];
