// Todo App Logic
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const yearSpan = document.getElementById('year');

    // Set current year in footer
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Load todos from localStorage
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    // Save todos to localStorage
    const saveTodos = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    // Render todos
    const renderTodos = () => {
        todoList.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = todo.completed ? 'completed' : '';
            li.innerHTML = `
                <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                <span class="todo-text">${todo.text}</span>
                <button class="delete-btn">✕</button>
            `;
            const checkbox = li.querySelector('input[type="checkbox"]');
            const span = li.querySelector('.todo-text');
            const deleteBtn = li.querySelector('.delete-btn');

            checkbox.addEventListener('change', () => {
                todos[index].completed = checkbox.checked;
                saveTodos();
                renderTodos();
            });

            span.addEventListener('dblclick', () => {
                // Replace span with input for editing
                const input = document.createElement('input');
                input.type = 'text';
                input.value = span.textContent;
                input.className = 'edit-input';
                li.innerHTML = '';
                li.appendChild(input);
                input.focus();
                input.addEventListener('blur', () => {
                    const newText = input.value.trim();
                    if (newText) {
                        todos[index].text = newText;
                        saveTodos();
                        renderTodos();
                    } else {
                        // If empty, keep original
                        renderTodos();
                    }
                });
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        input.blur();
                    }
                });
            });

            deleteBtn.addEventListener('click', () => {
                todos.splice(index, 1);
                saveTodos();
                renderTodos();
            });

            todoList.appendChild(li);
        });
    };

    // Add new todo
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (text) {
            todos.push({ text, completed: false });
            input.value = '';
            saveTodos();
            renderTodos();
        }
    });

    // Initial render
    renderTodos();
});