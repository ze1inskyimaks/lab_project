import './style.css';
import { TaskManager } from './taskManager.js';

// Environment status
const appStatus = import.meta.env.VITE_APP_STATUS || 'Unknown';
console.log(`%c Task Manager - ${appStatus}`, 'color: #4f46e5; font-weight: bold; font-size: 14px;');

// Set status in HTML data attribute for debugging
document.documentElement.setAttribute('data-app-status', appStatus);

// Display status on page
const statusElement = document.querySelector('#appStatus');
if (statusElement) {
  statusElement.textContent = `[${appStatus}]`;
}

const taskManager = new TaskManager();

// Load tasks from localStorage
try {
  const stored = localStorage.getItem('tasks');
  if (stored) {
    const tasks = JSON.parse(stored);
    tasks.forEach(task => {
      const newTask = taskManager.addTask(
        task.title || task.text, 
        task.description || '', 
        task.deadline ? new Date(task.deadline) : null
      );
      newTask.id = task.id;
      newTask.completed = task.completed || false;
      newTask.expanded = task.expanded || false;
      taskManager.nextId = Math.max(taskManager.nextId, task.id + 1);
    });
  }
} catch (e) {
  console.error('Error loading tasks:', e);
}

const input = document.querySelector('#taskInput');
const descriptionInput = document.querySelector('#descriptionInput');
const deadlineInput = document.querySelector('#deadlineInput');
const addBtn = document.querySelector('#addBtn');
const taskList = document.querySelector('#taskList');
const emptyState = document.querySelector('#emptyState');
const statsDiv = document.querySelector('#stats');
const clearCompletedBtn = document.querySelector('#clearCompletedBtn');

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

function updateStats() {
  if (statsDiv) {
    const stats = taskManager.getStats();
    statsDiv.textContent = `Total: ${stats.total} | Completed: ${stats.completed} | Pending: ${stats.pending}`;
  }
}

function saveTasks() {
  const tasksToSave = taskManager.getTasks().map(task => ({
    id: task.id,
    title: task.title,
    description: task.description,
    deadline: task.deadline,
    completed: task.completed,
    expanded: task.expanded,
    createdAt: task.createdAt
  }));
  localStorage.setItem('tasks', JSON.stringify(tasksToSave));
}

function render() {
  const tasks = taskManager.getTasks();
  taskList.innerHTML = '';

  if (tasks.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
    tasks.forEach((task) => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;
      if (taskManager.isTaskOverdue(task.id)) {
        li.classList.add('task-overdue');
      }
      li.dataset.id = task.id;

      // Main container
      const mainContainer = document.createElement('div');
      mainContainer.className = 'task-main';

      // Checkbox and text
      const taskContent = document.createElement('div');
      taskContent.className = 'task-content';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;
      checkbox.addEventListener('change', () => {
        taskManager.toggleTask(task.id);
        saveTasks();
        render();
        updateStats();
      });

      const span = document.createElement('span');
      span.className = 'task-text';
      span.textContent = task.title;
      
      taskContent.appendChild(checkbox);
      taskContent.appendChild(span);

      // Deadline info if exists
      if (task.deadline) {
        const deadlineSpan = document.createElement('span');
        deadlineSpan.className = 'task-deadline';
        deadlineSpan.textContent = getTimeRemaining(task.deadline);
        taskContent.appendChild(deadlineSpan);
      }

      mainContainer.appendChild(taskContent);

      // View button (if has description)
      if (task.description) {
        const viewBtn = document.createElement('button');
        viewBtn.className = 'task-view-btn';
        viewBtn.textContent = task.expanded ? 'Hide' : 'View';
        viewBtn.addEventListener('click', () => {
          taskManager.toggleTaskExpanded(task.id);
          saveTasks();
          render();
        });
        mainContainer.appendChild(viewBtn);
      }

      // Delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.className = 'task-delete-btn';
      deleteBtn.addEventListener('click', () => {
        taskManager.removeTask(task.id);
        saveTasks();
        render();
        updateStats();
      });

      mainContainer.appendChild(deleteBtn);
      li.appendChild(mainContainer);

      // Description section (if expanded)
      if (task.expanded && task.description) {
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

  updateStats();
}

function addNewTask() {
  const taskText = input.value.trim();
  const description = descriptionInput.value.trim();
  const deadline = deadlineInput.value ? new Date(deadlineInput.value) : null;

  if (taskText) {
    try {
      taskManager.addTask(taskText, description, deadline);
      saveTasks();
      input.value = '';
      descriptionInput.value = '';
      deadlineInput.value = '';
      input.focus();
      render();
    } catch (error) {
      alert(error.message);
    }
  }
}

addBtn.addEventListener('click', addNewTask);

input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addNewTask();
  }
});

if (clearCompletedBtn) {
  clearCompletedBtn.addEventListener('click', () => {
    taskManager.clearCompleted();
    saveTasks();
    render();
  });
}

// Update deadline displays every minute
setInterval(() => {
  render();
}, 60000);

render();
