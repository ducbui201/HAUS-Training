import { test, expect } from '@playwright/test';

test.describe('Kärcher Training System QA Test Suite', () => {

  // Helper to ensure the loading screen has fully disappeared before any steps
  async function waitForLoadingToDisappear(page) {
    await expect(page.locator('text=Đang nạp dữ liệu vận hành HAUS...')).not.toBeVisible({ timeout: 10000 });
  }

  test('1. Page load and basic structure', async ({ page }) => {
    await page.goto('/');
    await waitForLoadingToDisappear(page);

    // Verify title/header contains Kärcher text or header title
    await expect(page.locator('h1')).toContainText('Hệ Thống Thiết Bị Làm Sạch');
    
    // Check if brand logo has KÄRCHER
    await expect(page.locator('.karcher-logo-box')).toContainText('KÄRCHER');

    // Verify that columns or main areas are visible
    await expect(page.locator('text=Khu Vực Bếp')).toBeVisible();
    await expect(page.locator('text=Puzzi 10/1')).toBeVisible();
    await expect(page.locator('text=RM 760 Powder')).toBeVisible();
  });

  test('2. AR Scan & Query Parameter Parsing', async ({ page }) => {
    await page.goto('/?selectMachine=puzzi');
    await waitForLoadingToDisappear(page);

    const infoPanel = page.locator('text=Mô tả chức năng');
    await expect(infoPanel).toBeVisible();
    await expect(page.locator('h3:has-text("Puzzi 10/1")')).toBeVisible();
    await expect(page.locator('text=Liên kết QR Code vật lý')).toBeVisible();

    await page.click('text=Đóng bảng chi tiết');
    await expect(infoPanel).not.toBeVisible();
  });

  test('3. Side-by-Side Comparison Modal', async ({ page }) => {
    await page.goto('/');
    await waitForLoadingToDisappear(page);

    const puzziCard = page.locator('#machine-puzzi');
    const puzziCompareBtn = puzziCard.locator('button[title="So sánh thiết bị này"]');
    await puzziCompareBtn.click();

    const bdsCard = page.locator('#machine-bds43');
    const bdsCompareBtn = bdsCard.locator('button[title="So sánh thiết bị này"]');
    await bdsCompareBtn.click();

    const compareModal = page.locator('text=So sánh Thiết bị chuyên dụng');
    await expect(compareModal).toBeVisible();
    await expect(page.locator('h3:has-text("Puzzi 10/1")')).toBeVisible();
    await expect(page.locator('h3:has-text("BDS 43/150")')).toBeVisible();

    await page.locator('button:has(svg.lucide-x)').click();
    await expect(compareModal).not.toBeVisible();
  });

  test('4. Auto-Flow Simulator controls and HUD Blueprint', async ({ page }) => {
    await page.goto('/');
    await waitForLoadingToDisappear(page);

    // Click Gói Chuyên Sâu package button in Header
    await page.click('button:has-text("Gói Chuyên Sâu")');

    // Verify that the Simulator Quick Launch Pill is shown
    const playBtn = page.locator('text=Bắt đầu Quy trình (Gói Chuyên Sâu)');
    await expect(playBtn).toBeVisible();

    // Click to start simulation
    await playBtn.click();

    // Verify simulator control panel is active
    const simControls = page.locator('text=Mô phỏng Gói:');
    await expect(simControls).toBeVisible();
    await expect(page.locator('text=BƯỚC 1 /')).toBeVisible();

    // Verify HUD floor map is rendered and reflecting active state
    const stairsPolygon = page.locator('svg polygon').first();
    await expect(stairsPolygon).toBeVisible();

    // Stop simulation
    const stopBtn = page.locator('button[title="Dừng mô phỏng"]');
    await stopBtn.click();

    // Verify simulator controls are gone
    await expect(simControls).not.toBeVisible();
  });

  test('5. Interactive Quiz Mode checking', async ({ page }) => {
    await page.goto('/');
    await waitForLoadingToDisappear(page);

    // Toggle Quiz Mode in header
    await page.click('button[title="Bắt đầu kiểm tra trắc nghiệm"]');

    // Verify Quiz Panel is visible
    const quizPanel = page.locator('text=Đào tạo Vận hành');
    await expect(quizPanel).toBeVisible();

    // Verify it shows first question
    await expect(page.locator('text=Câu 1 /')).toBeVisible();

    // Question 1 correct answer is Machine: Puzzi, Chemical: RM 760
    await page.click('#machine-puzzi');
    await expect(page.locator('p:has-text("Puzzi 10/1")')).toBeVisible();

    await page.click('#chemical-rm-760');
    await expect(page.locator('p:has-text("RM 760 Powder")')).toBeVisible();

    await page.click('button:has-text("Nộp bài làm")');
    await expect(page.locator('text=Đáp án chính xác!').first()).toBeVisible();

    await page.click('button:has-text("Thoát")');
    await expect(quizPanel).not.toBeVisible();
  });
});
