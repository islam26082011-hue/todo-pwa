const input = document.getElementById("task_input");
const button = document.getElementById("create");
const warning = document.getElementById("text_warning");
const tasks_element = document.getElementById("tasks");

const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const MAX_TASK_LENGTH = 20;

const createTodoBlock = document.querySelector(".create_todo__block");
const createTodoButton = document.querySelector(".create_todo__block__btn");
const descriptionInput = document.getElementById("description");

// input listener
input.addEventListener("input", (e) => {
  const trimmedValue = e.target.value.trim();
  warning.style.visibility =
    trimmedValue && trimmedValue.length <= MAX_TASK_LENGTH ? "hidden" : "visible";

  if (trimmedValue.length > MAX_TASK_LENGTH) {
    warning.textContent = `Максимальная длина задачи ${MAX_TASK_LENGTH} символов`;
  } else {
    warning.textContent = "Поле не может быть пустым";
  }
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

    const text = document.createElement("span");
    text.textContent = item.text;

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

    // просмотреть описание
    const viewDescriptionButton = document.createElement("button");
    viewDescriptionButton.className = "view-description";
    viewDescriptionButton.textContent = "Просмотреть описание";
    viewDescriptionButton.addEventListener("click", () => {
      if (item.description && item.description.trim()) {
        alert(`Описание задачи: ${item.description}`);
      } else {
        alert("Описание отсутствует");
      }
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

    actions.append(editButton, removeButton, viewDescriptionButton);
    li.append(checkbox, text, actions);
    tasks_element.append(li);
  });
}

renderTasks();

button.addEventListener("click", () => {
  createTodoBlock.style.visibility = "visible";
});

createTodoButton.addEventListener("click", () => {
  const taskText = input.value.trim();
  const taskDescription = descriptionInput.value.trim();

  if (!taskText || taskText.length > MAX_TASK_LENGTH) {
    warning.style.visibility = "visible";
    warning.style.animation = "warning-blink 0.5s";
    return;
  }

  tasks.push({
    text: taskText,
    description: taskDescription,
    completed: false,
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
  input.value = "";
  descriptionInput.value = "";
  warning.style.visibility = "hidden";

  renderTasks();

  createTodoBlock.style.visibility = "hidden";

  const newTaskElement = tasks_element.lastElementChild;
  newTaskElement.classList.add("task-animate");

  input.focus();
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then(() => console.log("Service Worker зарегистрирован"))
    .catch((err) => console.log("Ошибка SW", err));
}
