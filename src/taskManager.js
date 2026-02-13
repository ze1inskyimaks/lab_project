export class TaskManager {
  constructor() {
    this.tasks = [];
    this.nextId = 1;
  }

  addTask(title, description = '', deadline = null) {
    if (!title || title.trim() === '') {
      throw new Error('Task title cannot be empty');
    }

    const task = {
      id: this.nextId++,
      title: title.trim(),
      description: description.trim(),
      deadline: deadline ? new Date(deadline).getTime() : null,
      completed: false,
      expanded: false,
      createdAt: new Date()
    };

    this.tasks.push(task);
    return task;
  }

  removeTask(id) {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    return this.tasks.splice(index, 1)[0];
  }

  toggleTask(id) {
    const task = this.tasks.find(task => task.id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    task.completed = !task.completed;
    return task;
  }

  getTasks() {
    return [...this.tasks];
  }

  getTaskById(id) {
    return this.tasks.find(task => task.id === id);
  }

  clearCompleted() {
    const removedTasks = this.tasks.filter(task => task.completed);
    this.tasks = this.tasks.filter(task => !task.completed);
    return removedTasks;
  }

  getStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(task => task.completed).length;
    const pending = total - completed;

    return { total, completed, pending };
  }

  toggleTaskExpanded(id) {
    const task = this.tasks.find(task => task.id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    task.expanded = !task.expanded;
    return task;
  }

  isTaskOverdue(id) {
    const task = this.tasks.find(task => task.id === id);
    if (!task || !task.deadline) return false;
    return Date.now() > task.deadline;
  }
}