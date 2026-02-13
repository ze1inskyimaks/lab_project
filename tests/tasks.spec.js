import { test, expect } from '@playwright/test';

test.describe('Task Manager E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
  });

  test('should display app title', async ({ page }) => {
    const title = page.locator('h1');
    await expect(title).toBeVisible();
  });

  test('should add a new task successfully', async ({ page }) => {
    const taskInput = page.locator('#taskInput');
    const addButton = page.locator('#addBtn');
    
    await taskInput.fill('Buy groceries');
    await addButton.click();
    
    const taskItems = page.locator('.task-item');
    await expect(taskItems).toHaveCount(1);
  });

  test('should toggle task completion', async ({ page }) => {
    // Add task
    await page.locator('#taskInput').fill('Complete homework');
    await page.locator('#addBtn').click();
    
    // Wait for task to appear
    await page.waitForTimeout(500);
    
    // Toggle checkbox
    const checkbox = page.locator('.task-item input[type="checkbox"]').first();
    await checkbox.click();
    
    // Verify stats updated
    const stats = page.locator('#stats');
    await expect(stats).toContainText('Completed: 1');
  });

  test('should delete a task', async ({ page }) => {
    // Add task
    await page.locator('#taskInput').fill('Task to delete');
    await page.locator('#addBtn').click();
    
    await page.waitForTimeout(500);
    
    // Delete task
    const deleteBtn = page.locator('.task-item button').first();
    await deleteBtn.click();
    
    // Verify task is removed
    const taskItems = page.locator('.task-item');
    await expect(taskItems).toHaveCount(0);
  });

  test('should clear completed tasks', async ({ page }) => {
    // Add multiple tasks
    const input = page.locator('#taskInput');
    const addBtn = page.locator('#addBtn');
    
    await input.fill('Task 1');
    await addBtn.click();
    await page.waitForTimeout(300);
    
    await input.fill('Task 2');
    await addBtn.click();
    await page.waitForTimeout(300);
    
    await input.fill('Task 3');
    await addBtn.click();
    await page.waitForTimeout(300);
    
    // Complete first and third tasks
    const checkboxes = page.locator('.task-item input[type="checkbox"]');
    await checkboxes.nth(0).click();
    await checkboxes.nth(2).click();
    
    // Clear completed
    const clearBtn = page.locator('#clearCompletedBtn');
    await clearBtn.click();
    await page.waitForTimeout(500);
    
    // Verify only one task remains
    const taskItems = page.locator('.task-item');
    await expect(taskItems).toHaveCount(1);
  });

  test('should show correct statistics', async ({ page }) => {
    const input = page.locator('#taskInput');
    const addBtn = page.locator('#addBtn');
    
    // Add tasks
    await input.fill('Task 1');
    await addBtn.click();
    await page.waitForTimeout(300);
    
    await input.fill('Task 2');
    await addBtn.click();
    await page.waitForTimeout(300);
    
    // Complete one task
    const checkbox = page.locator('.task-item input[type="checkbox"]').first();
    await checkbox.click();
    await page.waitForTimeout(500);
    
    // Check stats
    const stats = page.locator('#stats');
    await expect(stats).toContainText('Total: 2');
    await expect(stats).toContainText('Completed: 1');
    await expect(stats).toContainText('Pending: 1');
  });
});
