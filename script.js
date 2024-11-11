document.addEventListener('DOMContentLoaded', loadTasks);

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const dueDateInput = document.getElementById('due-date');
const priorityInput = document.getElementById('priority');
const taskList = document.getElementById('task-list');

taskForm.addEventListener('submit', addTask);

function addTask(e) {
    e.preventDefault();

    const taskText = taskInput.value;
    const dueDate = dueDateInput.value;
    const priority = priorityInput.value;

    if (taskText === '') return;

    const task = {
        id: Date.now(),
        text: taskText,
        dueDate,
        priority,
        completed: false,
    };

    saveTask(task);
    displayTask(task);

    taskForm.reset();
}

function displayTask(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.dataset.id = task.id;

    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = `${task.text} (Due: ${task.dueDate || 'No date'}) - Priority: ${task.priority}`;
    taskText.addEventListener('click', toggleTask);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', deleteTask);

    li.append(taskText, deleteBtn);
    taskList.appendChild(li);
}

function toggleTask(e) {
    const li = e.target.parentNode;
    const taskId = parseInt(li.dataset.id, 10);
    const tasks = getTasks();

    const task = tasks.find(t => t.id === taskId);
    task.completed = !task.completed;
    saveTasks(tasks);

    li.classList.toggle('completed');
}

function deleteTask(e) {
    const li = e.target.parentNode;
    const taskId = parseInt(li.dataset.id, 10);
    const tasks = getTasks().filter(t => t.id !== taskId);

    saveTasks(tasks);
    li.remove();
}

function getTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

function saveTask(task) {
    const tasks = getTasks();
    tasks.push(task);
    saveTasks(tasks);
}

function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = getTasks();
    tasks.forEach(displayTask);
}

function filterTasks(filter) {
    const tasks = getTasks();
    taskList.innerHTML = '';

    tasks
        .filter(task => {
            if (filter === 'completed') return task.completed;
            if (filter === 'uncompleted') return !task.completed;
            return true;
        })
        .forEach(displayTask);
}
