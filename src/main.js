import { addTask, removeTask, getTasks } from './modules/tasks.js';

const input = document.querySelector('#taskInput');
const addBtn = document.querySelector('#addBtn');
const taskList = document.querySelector('#taskList');
const emptyState = document.querySelector('#emptyState');

function render() {
  const tasks = getTasks();
  taskList.innerHTML = '';

  if (tasks.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.className = 'task-item';

      const taskText = document.createElement('span');
      taskText.className = 'task-text';
      taskText.textContent = task;

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'task-delete-btn';
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => {
        removeTask(index);
        render();
      });

      li.appendChild(taskText);
      li.appendChild(deleteBtn);
      taskList.appendChild(li);
    });
  }
}

function addNewTask() {
  const taskText = input.value.trim();
  if (taskText) {
    addTask(taskText);
    input.value = '';
    input.focus();
    render();
  }
}

addBtn.addEventListener('click', addNewTask);

input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addNewTask();
  }
});

render();
