document.addEventListener('DOMContentLoaded', () => {

```
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const priorityInput = document.getElementById('priority');
const categoryInput = document.getElementById('category');
const dueDateInput = document.getElementById('due-date');

const todoList = document.getElementById('todo-list');

const searchInput = document.getElementById('search-input');

const filterAll = document.getElementById('filter-all');
const filterActive = document.getElementById('filter-active');
const filterCompleted = document.getElementById('filter-completed');

const exportBtn = document.getElementById('export-btn');

const darkModeToggle = document.getElementById('dark-mode-toggle');

const taskCount = document.getElementById('task-count');

const yearSpan = document.getElementById('year');

if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

let todos = JSON.parse(localStorage.getItem('todos')) || [];

let currentFilter = 'all';
let searchTerm = '';

const saveTodos = () => {
    localStorage.setItem('todos', JSON.stringify(todos));
};

const updateTaskCount = () => {
    taskCount.textContent = `${todos.length} Task${todos.length !== 1 ? 's' : ''}`;
};

const renderTodos = () => {

    todoList.innerHTML = '';

    let filteredTodos = todos.filter(todo => {

        const matchesSearch =
            todo.text.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        if (currentFilter === 'active') {
            return !todo.completed;
        }

        if (currentFilter === 'completed') {
            return todo.completed;
        }

        return true;
    });

    filteredTodos.forEach((todo) => {

        const actualIndex = todos.indexOf(todo);

        const li = document.createElement('li');

        li.draggable = true;

        li.className = `
            ${todo.completed ? 'completed' : ''}
            priority-${todo.priority.toLowerCase()}
        `;

        li.dataset.index = actualIndex;

        li.innerHTML = `
            <input type="checkbox"
                ${todo.completed ? 'checked' : ''}>

            <div class="todo-content">

                <span class="todo-text">
                    ${todo.text}
                </span>

                <div class="todo-meta">

                    <span class="todo-badge">
                        ${todo.priority}
                    </span>

                    <span class="todo-badge">
                        ${todo.category}
                    </span>

                    ${
                        todo.dueDate
                            ? `<span class="todo-badge">${todo.dueDate}</span>`
                            : ''
                    }

                </div>

            </div>

            <button class="delete-btn">
                ✕
            </button>
        `;

        const checkbox =
            li.querySelector('input[type="checkbox"]');

        const text =
            li.querySelector('.todo-text');

        const deleteBtn =
            li.querySelector('.delete-btn');

        checkbox.addEventListener('change', () => {

            todos[actualIndex].completed =
                checkbox.checked;

            saveTodos();
            renderTodos();
        });

        text.addEventListener('dblclick', () => {

            const editInput =
                document.createElement('input');

            editInput.type = 'text';
            editInput.value = todo.text;
            editInput.className = 'edit-input';

            text.replaceWith(editInput);

            editInput.focus();

            editInput.addEventListener('blur', () => {

                const value =
                    editInput.value.trim();

                if (value) {
                    todos[actualIndex].text = value;
                    saveTodos();
                }

                renderTodos();
            });

            editInput.addEventListener('keypress', (e) => {

                if (e.key === 'Enter') {
                    editInput.blur();
                }
            });
        });

        deleteBtn.addEventListener('click', () => {

            todos.splice(actualIndex, 1);

            saveTodos();
            renderTodos();
        });

        li.addEventListener('dragstart', () => {
            li.classList.add('dragging');
        });

        li.addEventListener('dragend', () => {

            li.classList.remove('dragging');

            saveTodos();
        });

        todoList.appendChild(li);
    });

    updateTaskCount();
};

form.addEventListener('submit', (e) => {

    e.preventDefault();

    const text = input.value.trim();

    if (!text) return;

    todos.push({
        text,
        completed: false,
        priority: priorityInput.value,
        category: categoryInput.value,
        dueDate: dueDateInput.value
    });

    form.reset();

    saveTodos();
    renderTodos();
});

searchInput.addEventListener('input', () => {

    searchTerm = searchInput.value;

    renderTodos();
});

filterAll.addEventListener('click', () => {

    currentFilter = 'all';

    renderTodos();
});

filterActive.addEventListener('click', () => {

    currentFilter = 'active';

    renderTodos();
});

filterCompleted.addEventListener('click', () => {

    currentFilter = 'completed';

    renderTodos();
});

exportBtn.addEventListener('click', () => {

    const blob = new Blob(
        [JSON.stringify(todos, null, 2)],
        { type: 'application/json' }
    );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement('a');

    a.href = url;

    a.download = 'tasks.json';

    a.click();

    URL.revokeObjectURL(url);
});

darkModeToggle.addEventListener('click', () => {

    document.body.classList.toggle('dark-mode');

    localStorage.setItem(
        'darkMode',
        document.body.classList.contains('dark-mode')
    );
});

if (localStorage.getItem('darkMode') === 'true') {

    document.body.classList.add('dark-mode');
}

todoList.addEventListener('dragover', (e) => {

    e.preventDefault();

    const dragging =
        document.querySelector('.dragging');

    const afterElement =
        [...todoList.querySelectorAll('li:not(.dragging)')]
        .find(el => {

            const rect =
                el.getBoundingClientRect();

            return e.clientY <
                rect.top + rect.height / 2;
        });

    if (afterElement) {
        todoList.insertBefore(
            dragging,
            afterElement
        );
    } else {
        todoList.appendChild(dragging);
    }
});

todoList.addEventListener('drop', () => {

    const reordered = [];

    [...todoList.children].forEach(li => {

        reordered.push(
            todos[Number(li.dataset.index)]
        );
    });

    todos = reordered;

    saveTodos();

    renderTodos();
});

renderTodos();
```

});
