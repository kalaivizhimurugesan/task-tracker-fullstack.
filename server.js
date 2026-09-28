const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let tasks = [
  { id: 1, title: "Review Java basics", completed: false },
  { id: 2, title: "Practice JavaScript", completed: true }
];

let nextId = 3;

app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/api/tasks", (req, res) => {
  const title = String(req.body.title || "").trim();

  if (!title) {
    return res.status(400).json({ error: "Task title is required." });
  }

  const task = { id: nextId++, title, completed: false };
  tasks.push(task);
  res.status(201).json(task);
});

app.patch("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((item) => item.id === id);

  if (!task) {
    return res.status(404).json({ error: "Task not found." });
  }

  task.completed = Boolean(req.body.completed);
  res.json(task);
});

app.delete("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const originalLength = tasks.length;
  tasks = tasks.filter((item) => item.id !== id);

  if (tasks.length === originalLength) {
    return res.status(404).json({ error: "Task not found." });
  }

  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Task Tracker running at http://localhost:${PORT}`);
});
