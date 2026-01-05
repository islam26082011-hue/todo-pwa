const input = document.getElementById("task_input");
const button = document.getElementById("create");
const warning = document.getElementById("text_warning");
const tasks_element = document.getElementById("tasks");

const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// input listener
input.addEventListener("input", (e) => {
  warning.style.visibility = e.target.value.trim()
    ? "hidden"
    : "visible";
});

function renderTasks() {
  tasks_element.innerHTML = "";

  tasks.forEach((item, index) => {
    const li = document.createElement("li");
    li.dataset.index = index;

    // чекбокс
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.completed;

    checkbox.addEventListener("change", () => {
      item.completed = checkbox.checked;
      localStorage.setItem("tasks", JSON.stringify(tasks));
    });

    // текст задачи
    const text = document.createElement("span");
    text.textContent = item.text;

    const len = text.textContent.length;
    if (len <= 10) text.style.fontSize = "30px";
    else if (len <= 22) text.style.fontSize = "25px";
    else if (len <= 27) text.style.fontSize = "20px";
    else if (len <= 34) text.style.fontSize = "15px";
    else text.style.fontSize = "10px";

    // кнопки
    const actions = document.createElement("div");
    actions.className = "actions";

    // удалить
    const removeButton = document.createElement("button");
    removeButton.className = "delete";
    removeButton.textContent = "Удалить";

    removeButton.addEventListener("click", () => {
      tasks.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
    });

    // изменить
    const editButton = document.createElement("button");
    editButton.className = "edit";
    editButton.textContent = "Изменить";

    editButton.addEventListener("click", () => {
      const newTask = prompt("Введите новое значение задачи", item.text);
      if (!newTask || !newTask.trim()) {
        alert("Задача не может быть пустой");
        return;
      }
      item.text = newTask;
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
    });

    actions.append(editButton, removeButton);
    li.append(checkbox, text, actions);
    tasks_element.append(li);
  });
}

renderTasks();

button.addEventListener("click", () => {
  if (!input.value.trim()) {
    warning.style.visibility = "visible";
    warning.style.animation = "warning-blink 0.5s";
    return;
  }

  tasks.push({
    text: input.value,
    completed: false,
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
  input.value = "";
  warning.style.visibility = "hidden";

  renderTasks();

  // анимация ТОЛЬКО нового элемента
  const newTaskElement = tasks_element.lastElementChild;
  newTaskElement.classList.add("task-animate");

  input.focus();
});









if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js")
    .then(() => console.log("Service Worker зарегистрирован"))
    .catch(err => console.log("Ошибка SW", err));
}
