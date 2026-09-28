const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");
const message = document.getElementById("message");

async function loadTasks() {
  try {
    const response = await fetch("/api/tasks");
    const tasks = await response.json();
    renderTasks(tasks);
  } catch (error) {
    showError("Could not load tasks.");
  }
}

function renderTasks(tasks) {
  list.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
      <input type="checkbox" ${task.completed ? "checked" : ""}>
      <span>${escapeHtml(task.title)}</span>
      <button class="delete">Delete</button>
    `;

    li.querySelector("input").addEventListener("change", () =>
      updateTask(task.id, li.querySelector("input").checked)
    );

    li.querySelector(".delete").addEventListener("click", () =>
      deleteTask(task.id)
    );

    list.appendChild(li);
  });
}

async function addTask(title) {
  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title })
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Unable to add task.");
  }

  await loadTasks();
}

async function updateTask(id, completed) {
  const response = await fetch(`/api/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed })
  });

  if (!response.ok) showError("Could not update task.");
  await loadTasks();
}

async function deleteTask(id) {
  const response = await fetch(`/api/tasks/${id}`, { method: "DELETE" });

  if (!response.ok) {
    showError("Could not delete task.");
    return;
  }

  await loadTasks();
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "";

  const title = input.value.trim();
  if (!title) {
    showError("Please enter a task.");
    return;
  }

  try {
    await addTask(title);
    input.value = "";
  } catch (error) {
    showError(error.message);
  }
});

function showError(text) {
  message.textContent = text;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

loadTasks();
