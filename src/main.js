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
year.textContent = new Date().getFullYear();

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let filter = "all";
let searchText = "";

/* SAVE */
function save() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

/* COUNT */
function updateCount() {
    taskCount.textContent = `${todos.length} Tasks`;
}

/* RENDER */
function render() {
    list.innerHTML = "";

    let filtered = todos.filter(t => {

        const matchSearch = t.text.toLowerCase().includes(searchText.toLowerCase());

        if (!matchSearch) return false;

        if (filter === "active") return !t.completed;
        if (filter === "completed") return t.completed;

        return true;
    });

    filtered.forEach((t, index) => {

        const li = document.createElement("li");

        li.innerHTML = `
            <div>
                <input type="checkbox" ${t.completed ? "checked" : ""}>

                <strong>${t.text}</strong>

                <div class="todo-meta">
                    <span>${t.priority}</span>
                    <span>${t.category}</span>
                    <span>${t.dueDate || ""}</span>
                </div>
            </div>

            <button>✕</button>
        `;

        li.querySelector("input").addEventListener("change", () => {
            todos[index].completed = !todos[index].completed;
            save();
            render();
        });

        li.querySelector("button").addEventListener("click", () => {
            todos.splice(index, 1);
            save();
            render();
        });

        list.appendChild(li);
    });

    updateCount();
}

/* ADD TASK */
form.addEventListener("submit", e => {
    e.preventDefault();

    todos.push({
        text: input.value,
        completed: false,
        priority: priority.value,
        category: category.value,
        dueDate: dueDate.value
    });

    form.reset();
    save();
    render();
});

/* SEARCH */
search.addEventListener("input", e => {
    searchText = e.target.value;
    render();
});

/* FILTERS */
filterAll.onclick = () => { filter = "all"; render(); };
filterActive.onclick = () => { filter = "active"; render(); };
filterCompleted.onclick = () => { filter = "completed"; render(); };

/* EXPORT */
exportBtn.onclick = () => {
    const blob = new Blob([JSON.stringify(todos, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "tasks.json";
    a.click();
};

/* DARK MODE */
darkToggle.onclick = () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("dark", document.body.classList.contains("dark-mode"));
};

if (localStorage.getItem("dark") === "true") {
    document.body.classList.add("dark-mode");
}

/* INIT */
render();

});
