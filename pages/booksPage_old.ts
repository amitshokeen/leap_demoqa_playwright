//import { test, expect } from '@playwright/test';
import { Page, expect, Locator } from "@playwright/test";
import dotenv from 'dotenv';

dotenv.config();

export default class BooksPage {
    constructor(public page: Page) {}

    private async setRowsPerPage(count: string | number) {
        const dropdown = this.page.getByRole('combobox', { name: 'rows per page' });
        await dropdown.selectOption(String(count));
    }

    private async validateColumnText(locator: Locator, maxCount: number, label: string) {
        const texts = await locator.allTextContents();
        expect(texts.length).toBeLessThanOrEqual(maxCount);
        for (const text of texts) {
            if (text.trim().length === 0) continue; // skip filler rows
            expect(text.trim().length).toBeGreaterThan(0);
        }
        return texts;
    }

    private async validateThumbnails(locator: Locator, maxCount: number) {
        const count = await locator.count();
        expect(count).toBeLessThanOrEqual(maxCount);
        for (let i = 0; i < count; i++) {
            await expect(locator.nth(i)).toBeVisible();
            const src = await locator.nth(i).getAttribute('src');
            expect(src).toBeTruthy();
        }
    }

    public async bookSearchWithRowLimit(limit: number) {
        if (!'/') {
            throw new Error("BASE_URL environment variable is not set");
        }

        await this.page.goto(process.env.BASE_URL);
        await this.setRowsPerPage(limit);

        const thumbnails = this.page.locator('.rt-tbody .rt-tr-group .rt-td:nth-child(1) img');
        const titles = this.page.locator('.rt-tbody .rt-tr-group .rt-td:nth-child(2)');
        const authors = this.page.locator('.rt-tbody .rt-tr-group .rt-td:nth-child(3)');
        const publishers = this.page.locator('.rt-tbody .rt-tr-group .rt-td:nth-child(4)');

        const titleTexts = await this.validateColumnText(titles, limit, 'Title');
        expect(titleTexts.some(t => t.trim() === 'Learning JavaScript Design Patterns')).toBe(true);

        await this.validateColumnText(authors, limit, 'Author');
        await this.validateColumnText(publishers, limit, 'Publisher');
        await this.validateThumbnails(thumbnails, limit);
    }

    async searchBooks(term: string) {
        if (!'/') {
            throw new Error("BASE_URL environment variable is not set");
        }
    
        await this.page.goto(process.env.BASE_URL);
    
        // Type the dynamic search term into the search box
        const searchBox = this.page.getByPlaceholder('Type to search');
        await searchBox.fill(term);
    
        const thumbnails = this.page.locator('.rt-tbody .rt-tr-group .rt-td:nth-child(1) img');
        const titles = this.page.locator('.rt-tbody .rt-tr-group .rt-td:nth-child(2)');
        const authors = this.page.locator('.rt-tbody .rt-tr-group .rt-td:nth-child(3)');
        const publishers = this.page.locator('.rt-tbody .rt-tr-group .rt-td:nth-child(4)');
    
        // Wait for at least one visible title row
        await expect(titles.first()).toBeVisible();
    
        const titleTexts = await titles.allTextContents();
        expect(titleTexts.length).toBeGreaterThan(0);
    
        for (const title of titleTexts) {
            const trimmed = title.trim();
            if (trimmed.length === 0) continue; //skip blank row
            expect(trimmed.length).toBeGreaterThan(0);
            expect(trimmed.toLowerCase()).toContain(term.toLowerCase());
        }
    
        // Authors
        const authorTexts = await authors.allTextContents();
        const validAuthors = authorTexts.filter(a => a.trim().length > 0);
        expect(validAuthors.length).toBeGreaterThan(0);
    
        // Publishers
        const publisherTexts = await publishers.allTextContents();
        const validPublishers = publisherTexts.filter(a => a.trim().length > 0);
        expect(validPublishers.length).toBeGreaterThan(0);
    
        // Thumbnails
        const imageCount = await thumbnails.count();
        const nonEmptyTitles = titleTexts.filter(t => t.trim().length > 0);
        expect(imageCount).toBe(nonEmptyTitles.length);
        for (let i = 0; i < imageCount; i++) {
            await expect(thumbnails.nth(i)).toBeVisible();
            const src = await thumbnails.nth(i).getAttribute('src');
            expect(src).toBeTruthy();
        }
    }
    
}