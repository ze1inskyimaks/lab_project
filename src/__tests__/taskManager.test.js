// src/__tests__/taskManager.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { TaskManager } from '../taskManager.js';

describe('TaskManager', () => {
  let taskManager;

  beforeEach(() => {
    taskManager = new TaskManager();
  });

  describe('addTask', () => {
    it('should add a task with valid title', () => {
      const task = taskManager.addTask('Buy groceries');
      
      expect(task).toBeDefined();
      expect(task.title).toBe('Buy groceries');
      expect(task.completed).toBe(false);
      expect(task.id).toBe(1);
    });

    it('should trim whitespace from task title', () => {
      const task = taskManager.addTask('  Learn testing  ');
      expect(task.title).toBe('Learn testing');
    });

    it('should throw error when title is empty', () => {
      expect(() => taskManager.addTask('')).toThrow('Task title cannot be empty');
    });

    it('should throw error when title is only whitespace', () => {
      expect(() => taskManager.addTask('   ')).toThrow('Task title cannot be empty');
    });

    it('should increment task IDs correctly', () => {
      const task1 = taskManager.addTask('Task 1');
      const task2 = taskManager.addTask('Task 2');
      
      expect(task1.id).toBe(1);
      expect(task2.id).toBe(2);
    });
  });

  describe('removeTask', () => {
    it('should remove existing task', () => {
      const task = taskManager.addTask('Task to remove');
      const removed = taskManager.removeTask(task.id);
      
      expect(removed).toEqual(task);
      expect(taskManager.getTasks()).toHaveLength(0);
    });

    it('should throw error when removing non-existent task', () => {
      expect(() => taskManager.removeTask(999)).toThrow('Task not found');
    });
  });

  describe('toggleTask', () => {
    it('should toggle task completion status', () => {
      const task = taskManager.addTask('Task to toggle');
      
      expect(task.completed).toBe(false);
      
      const toggled = taskManager.toggleTask(task.id);
      expect(toggled.completed).toBe(true);
      
      taskManager.toggleTask(task.id);
      expect(toggled.completed).toBe(false);
    });

    it('should throw error when toggling non-existent task', () => {
      expect(() => taskManager.toggleTask(999)).toThrow('Task not found');
    });
  });

  describe('getTasks', () => {
    it('should return all tasks', () => {
      taskManager.addTask('Task 1');
      taskManager.addTask('Task 2');
      
      const tasks = taskManager.getTasks();
      expect(tasks).toHaveLength(2);
    });

    it('should return copy of tasks array', () => {
      taskManager.addTask('Task 1');
      const tasks = taskManager.getTasks();
      
      tasks.push({ id: 999, title: 'Fake task' });
      
      expect(taskManager.getTasks()).toHaveLength(1);
    });
  });

  describe('clearCompleted', () => {
    it('should remove all completed tasks', () => {
      const task1 = taskManager.addTask('Task 1');
      const task2 = taskManager.addTask('Task 2');
      const task3 = taskManager.addTask('Task 3');
      
      taskManager.toggleTask(task1.id);
      taskManager.toggleTask(task3.id);
      
      const removed = taskManager.clearCompleted();
      
      expect(removed).toHaveLength(2);
      expect(taskManager.getTasks()).toHaveLength(1);
      expect(taskManager.getTasks()[0].id).toBe(task2.id);
    });
  });

  describe('getStats', () => {
    it('should return correct statistics', () => {
      taskManager.addTask('Task 1');
      taskManager.addTask('Task 2');
      const task3 = taskManager.addTask('Task 3');
      
      taskManager.toggleTask(task3.id);
      
      const stats = taskManager.getStats();
      
      expect(stats.total).toBe(3);
      expect(stats.completed).toBe(1);
      expect(stats.pending).toBe(2);
    });
  });
});
