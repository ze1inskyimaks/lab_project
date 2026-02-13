import { addTask, removeTask, getTasks, isTaskOverdue } from './modules/tasks.js';

const input = document.querySelector('#taskInput');
const deadlineInput = document.querySelector('#deadlineInput');
const addBtn = document.querySelector('#addBtn');
const taskList = document.querySelector('#taskList');
const emptyState = document.querySelector('#emptyState');

function formatDeadline(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dateStr = date.toLocaleDateString('uk-UA');
  const timeStr = date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });

  return `${dateStr} at ${timeStr}`;
}

function getTimeRemaining(timestamp) {
  if (!timestamp) return '';
  const now = Date.now();
  const diff = timestamp - now;

  if (diff < 0) {
    return 'Overdue!';
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
}

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

      // Check if overdue and apply class
      if (isTaskOverdue(task)) {
        li.classList.add('task-overdue');
      }

      // Task text
      const taskText = document.createElement('div');
      taskText.className = 'task-content';

      const textSpan = document.createElement('span');
      textSpan.className = 'task-text';
      textSpan.textContent = task.text;
      taskText.appendChild(textSpan);

      // Deadline info if exists
      if (task.deadline) {
        const deadlineSpan = document.createElement('span');
        deadlineSpan.className = 'task-deadline';
        deadlineSpan.textContent = getTimeRemaining(task.deadline);
        taskText.appendChild(deadlineSpan);
      }

      li.appendChild(taskText);

      // Delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'task-delete-btn';
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => {
        removeTask(index);
        render();
      });

      li.appendChild(deleteBtn);
      taskList.appendChild(li);
    });
  }
}

function addNewTask() {
  const taskText = input.value.trim();
  const deadline = deadlineInput.value ? new Date(deadlineInput.value) : null;

  if (taskText) {
    addTask(taskText, deadline);
    input.value = '';
    deadlineInput.value = '';
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

// Update deadline displays every minute
setInterval(() => {
  render();
}, 60000);

render();
