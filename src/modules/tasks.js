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

export function addTask(task) {
  if (!task || !task.trim()) {
    return false;
  }
  tasks.push(task.trim());
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

function save() {
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (e) {
    console.error('Error saving tasks to localStorage:', e);
  }
}
