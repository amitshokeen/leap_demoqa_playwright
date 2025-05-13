import { Page, expect, Locator } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default class BooksPage {
    constructor(public page: Page) {}

    // ------------------- SHARED LOCATORS -------------------
    private get thumbnails(): Locator {
        return this.page.locator('.rt-tbody .rt-tr-group .rt-td:nth-child(1) img');
    }

    private get titles(): Locator {
        return this.page.locator('.rt-tbody .rt-tr-group .rt-td:nth-child(2)');
    }

    private get authors(): Locator {
        return this.page.locator('.rt-tbody .rt-tr-group .rt-td:nth-child(3)');
    }

    private get publishers(): Locator {
        return this.page.locator('.rt-tbody .rt-tr-group .rt-td:nth-child(4)');
    }

    private get nextButton() {
        return this.page.getByRole('button', { name: 'Next' });
    }

    // ------------------- PRIVATE HELPERS -------------------
    public async setRowsPerPage(count: string | number) {
        const dropdown = this.page.getByRole('combobox', { name: 'rows per page' });
        await dropdown.selectOption(String(count));
    }

    private async validateColumnText(locator: Locator, maxCount: number, label: string): Promise<string[]> {
        const texts = await locator.allTextContents();
        expect(texts.length).toBeLessThanOrEqual(maxCount);
        for (const text of texts) {
            if (text.trim().length === 0) continue;
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

    // ------------------- PUBLIC TEST METHODS -------------------
    public async bookSearchWithRowLimit(limit: number) {
        if (!process.env.BASE_URL) {
            throw new Error("BASE_URL environment variable is not set");
        }

        await this.page.goto(process.env.BASE_URL);
        await this.setRowsPerPage(limit);

        const titleTexts = await this.validateColumnText(this.titles, limit, 'Title');
        expect(titleTexts.some(t => t.trim() === 'Learning JavaScript Design Patterns')).toBe(true);

        await this.validateColumnText(this.authors, limit, 'Author');
        await this.validateColumnText(this.publishers, limit, 'Publisher');
        await this.validateThumbnails(this.thumbnails, limit);
    }

    public async searchBooks(term: string) {
        if (!process.env.BASE_URL) {
            throw new Error("BASE_URL environment variable is not set");
        }

        await this.page.goto(process.env.BASE_URL);
        const searchBox = this.page.getByPlaceholder('Type to search');
        await searchBox.fill(term);

        await expect(this.titles.first()).toBeVisible();

        const titleTexts = await this.titles.allTextContents();
        expect(titleTexts.length).toBeGreaterThan(0);

        const nonEmptyTitles = titleTexts.filter(t => t.trim().length > 0);
        expect(nonEmptyTitles.length).toBeGreaterThan(0);

        for (const title of nonEmptyTitles) {
            expect(title.toLowerCase()).toContain(term.toLowerCase());
        }

        const authorTexts = await this.authors.allTextContents();
        expect(authorTexts.filter(a => a.trim().length > 0).length).toBeGreaterThan(0);

        const publisherTexts = await this.publishers.allTextContents();
        expect(publisherTexts.filter(p => p.trim().length > 0).length).toBeGreaterThan(0);

        const imageCount = await this.thumbnails.count();
        expect(imageCount).toBe(nonEmptyTitles.length);

        for (let i = 0; i < imageCount; i++) {
            await expect(this.thumbnails.nth(i)).toBeVisible();
            const src = await this.thumbnails.nth(i).getAttribute('src');
            expect(src).toBeTruthy();
        }
    }

    public async assertNoSearchResults(term: string) {
        if (!process.env.BASE_URL) {
            throw new Error("BASE_URL environment variable is not set");
        }

        await this.page.goto(process.env.BASE_URL);
        await this.page.getByPlaceholder('Type to search').fill(term);
    
        const titles = await this.titles.allTextContents();
        const nonEmpty = titles.filter(t => t.trim().length > 0);
        expect(nonEmpty.length).toBe(0);
    }
    
    public async isNextButtonVisible(): Promise<boolean> {
        return await this.nextButton.isVisible();
    }

    public async isNextButtonEnabled(): Promise<boolean> {
        return await this.nextButton.isEnabled();
    }

    public async clickNextPageIfAvailable(): Promise<boolean> {
        const nextButton = this.nextButton;
        if (await nextButton.isVisible() && await nextButton.isEnabled()) {
            await nextButton.click();
            return true;
        }
        return false;
    }

    public async clickPreviousPageIfAvailable(): Promise<boolean> {
        const prevButton = this.page.locator('div.-previous >> button');
        if (await prevButton.isVisible() && await prevButton.isEnabled()) {
            await prevButton.click();
            return true;
        }
        return false;
    }

    public async assertPaginationWorks() {
        const titleLocator = this.page.locator('.rt-td:nth-child(2)');
        const titlesBefore = await titleLocator.allTextContents();
    
        const clickedNext = await this.clickNextPageIfAvailable();
        if (!clickedNext) {
            throw new Error('Next button was not available or enabled');
        }
    
        // Wait for the titles to change
        await expect(titleLocator).not.toHaveText(titlesBefore, {
            timeout: 5000,
        });
    
        const titlesAfterNext = await titleLocator.allTextContents();
        expect(titlesAfterNext).not.toEqual(titlesBefore);
    
        const clickedPrev = await this.clickPreviousPageIfAvailable();
        if (!clickedPrev) {
            throw new Error('Previous button was not available or enabled after going forward');
        }
    
        // Wait for titles to return to original
        await expect(titleLocator).toHaveText(titlesBefore, {
            timeout: 5000,
        });
    
        const titlesAfterPrev = await titleLocator.allTextContents();
        expect(titlesAfterPrev).toEqual(titlesBefore);
    }
    
    public async clickFirstBookAndVerifyNavigationByUrl() {
        // Locate the first book title link
        const firstBookLink = this.page.locator('.rt-td:nth-child(2) >> a').first();
    
        // Wait until it's visible
        await expect(firstBookLink).toBeVisible();
    
        // Extract the href value to get the book ID
        const href = await firstBookLink.getAttribute('href');
        if (!href) throw new Error('Book link does not have an href attribute');
    
        const url = new URL(href, this.page.url());
        const bookId = url.searchParams.get('book');
        if (!bookId) throw new Error('Book ID not found in href');
    
        // Click and wait for the navigation to complete
        await Promise.all([
            this.page.waitForURL(/books\?book=\d+$/),
            firstBookLink.click(),
        ]);
    
        // Final assertion: confirm current URL has the expected book ID
        await expect(this.page).toHaveURL(new RegExp(`\\?book=${bookId}$`));
    } 
}
