import { addTask, removeTask, getTasks, isTaskOverdue, toggleTaskExpanded } from './modules/tasks.js';

const input = document.querySelector('#taskInput');
const descriptionInput = document.querySelector('#descriptionInput');
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

      // Main task container
      const taskMainContainer = document.createElement('div');
      taskMainContainer.className = 'task-main';

      // Task text and info
      const taskContent = document.createElement('div');
      taskContent.className = 'task-content';

      const textSpan = document.createElement('span');
      textSpan.className = 'task-text';
      textSpan.textContent = task.text;
      taskContent.appendChild(textSpan);

      // Deadline info if exists
      if (task.deadline) {
        const deadlineSpan = document.createElement('span');
        deadlineSpan.className = 'task-deadline';
        deadlineSpan.textContent = getTimeRemaining(task.deadline);
        taskContent.appendChild(deadlineSpan);
      }

      taskMainContainer.appendChild(taskContent);

      // View button (if has description)
      const hasDescription = task.description;
      if (hasDescription) {
        const viewBtn = document.createElement('button');
        viewBtn.className = 'task-view-btn';
        viewBtn.textContent = task.expanded ? 'Hide' : 'View';
        viewBtn.addEventListener('click', () => {
          toggleTaskExpanded(index);
          render();
        });
        taskMainContainer.appendChild(viewBtn);
      }

      // Delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'task-delete-btn';
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => {
        removeTask(index);
        render();
      });

      taskMainContainer.appendChild(deleteBtn);
      li.appendChild(taskMainContainer);

      // Description section (if expanded)
      if (task.expanded && hasDescription) {
        const descContainer = document.createElement('div');
        descContainer.className = 'task-description-container';
        const descText = document.createElement('p');
        descText.className = 'task-description';
        descText.textContent = task.description;
        descContainer.appendChild(descText);
        li.appendChild(descContainer);
      }

      taskList.appendChild(li);
    });
  }
}

function addNewTask() {
  const taskText = input.value.trim();
  const description = descriptionInput.value.trim();
  const deadline = deadlineInput.value ? new Date(deadlineInput.value) : null;

  if (taskText) {
    addTask(taskText, description, deadline);
    input.value = '';
    descriptionInput.value = '';
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
