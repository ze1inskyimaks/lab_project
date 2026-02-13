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

export function addTask(taskText, description = '', deadline = null) {
  if (!taskText || !taskText.trim()) {
    return false;
  }
  
  const task = {
    text: taskText.trim(),
    description: description.trim(),
    deadline: deadline ? new Date(deadline).getTime() : null,
    createdAt: Date.now(),
    expanded: false
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

export function toggleTaskExpanded(index) {
  if (index >= 0 && index < tasks.length) {
    tasks[index].expanded = !tasks[index].expanded;
    save();
    return true;
  }
  return false;
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
