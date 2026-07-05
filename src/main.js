document.addEventListener("DOMContentLoaded", () => {

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const priority = document.getElementById("priority");
const category = document.getElementById("category");
const dueDate = document.getElementById("due-date");

const list = document.getElementById("todo-list");
const search = document.getElementById("search-input");

const filterAll = document.getElementById("filter-all");
const filterActive = document.getElementById("filter-active");
const filterCompleted = document.getElementById("filter-completed");

const exportBtn = document.getElementById("export-btn");
const darkToggle = document.getElementById("dark-mode-toggle");

const taskCount = document.getElementById("task-count");
const year = document.getElementById("year");

if (year) year.textContent = new Date().getFullYear();

/* =========================
   DATA
========================= */

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let filter = "all";
let searchText = "";

/* =========================
   SAVE
========================= */

function save() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

/* =========================
   COUNT
========================= */

function updateCount() {
    if (taskCount) {
        taskCount.textContent = `${todos.length} Task${todos.length !== 1 ? "s" : ""}`;
    }
}

/* =========================
   CREATE TASK UI (IMPORTANT FIX)
========================= */

function createTaskElement(todo, index) {

    const li = document.createElement("li");

    li.className = `
        ${todo.completed ? "completed" : ""}
        priority-${(todo.priority || "low").toLowerCase()}
    `;

    li.innerHTML = `
        <input type="checkbox" ${todo.completed ? "checked" : ""}>

        <div class="todo-content">
            <span class="todo-text">${todo.text}</span>

            <div class="todo-meta">
                <span class="todo-badge">${todo.priority || "Low"}</span>
                <span class="todo-badge">${todo.category || "Personal"}</span>
                ${todo.dueDate ? `<span class="todo-badge">${todo.dueDate}</span>` : ""}
            </div>
        </div>

        <button class="delete-btn">✕</button>
    `;

    /* CHECKBOX */
    li.querySelector("input").addEventListener("change", () => {
        todos[index].completed = !todos[index].completed;
        save();
        render();
    });

    /* DELETE */
    li.querySelector(".delete-btn").addEventListener("click", () => {
        todos.splice(index, 1);
        save();
        render();
    });

    return li;
}

/* =========================
   RENDER
========================= */

function render() {

    list.innerHTML = "";

    let filtered = todos.filter(t => {

        const matchesSearch =
            t.text.toLowerCase().includes(searchText.toLowerCase());

        if (!matchesSearch) return false;

        if (filter === "active") return !t.completed;
        if (filter === "completed") return t.completed;

        return true;
    });

    filtered.forEach((todo) => {

        const index = todos.indexOf(todo);
        const el = createTaskElement(todo, index);

        list.appendChild(el);
    });

    updateCount();
}

/* =========================
   ADD TASK
========================= */

form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!input.value.trim()) return;

    todos.push({
        text: input.value.trim(),
        completed: false,
        priority: priority.value,
        category: category.value,
        dueDate: dueDate.value
    });

    form.reset();
    save();
    render();
});

/* =========================
   SEARCH
========================= */

search.addEventListener("input", (e) => {
    searchText = e.target.value;
    render();
});

/* =========================
   FILTERS
========================= */

filterAll.onclick = () => { filter = "all"; render(); };
filterActive.onclick = () => { filter = "active"; render(); };
filterCompleted.onclick = () => { filter = "completed"; render(); };

/* =========================
   EXPORT
========================= */

exportBtn.onclick = () => {
    const blob = new Blob([JSON.stringify(todos, null, 2)], {
        type: "application/json"
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "tasks.json";
    a.click();

    URL.revokeObjectURL(url);
};

/* =========================
   DARK MODE
========================= */

darkToggle.onclick = () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem(
        "dark",
        document.body.classList.contains("dark-mode")
    );
};

if (localStorage.getItem("dark") === "true") {
    document.body.classList.add("dark-mode");
}

/* =========================
   INIT
========================= */

render();

});
