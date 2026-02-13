let tasks = [];

// Load from localStorage
try {
  const stored = localStorage.getItem('tasks');
  if (stored) {
    tasks = JSON.parse(stored);
  }
} catch (e) {
  console.error('Error loading tasks from localStorage:', e);
  tasks = [];
}

export function addTask(taskText, deadline = null) {
  if (!taskText || !taskText.trim()) {
    return false;
  }
  
  const task = {
    text: taskText.trim(),
    deadline: deadline ? new Date(deadline).getTime() : null,
    createdAt: Date.now()
  };
  
  tasks.push(task);
  save();
  return true;
}

export function removeTask(index) {
  if (index >= 0 && index < tasks.length) {
    tasks.splice(index, 1);
    save();
    return true;
  }
  return false;
}

export function getTasks() {
  return [...tasks];
}

export function isTaskOverdue(task) {
  if (!task.deadline) return false;
  return Date.now() > task.deadline;
}

function save() {
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (e) {
    console.error('Error saving tasks to localStorage:', e);
  }
}
