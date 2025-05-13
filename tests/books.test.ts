import { test } from '../pages/fixtures/basePage';

test('search feature', async ({ booksPage }) => {
    await booksPage.searchBooks('JavaScript');
    await booksPage.searchBooks('Git');
    await booksPage.searchBooks('eloquent javascript'); // case insensitive search
    await booksPage.assertNoSearchResults('#$%'); // should not crash or match anything
});

test('row limit', async ({ booksPage }) => {
    await booksPage.bookSearchWithRowLimit(5);
    await booksPage.bookSearchWithRowLimit(10);
});

test('pagination works when clicking next', async ({ booksPage }) => {
    await booksPage.page.goto(process.env.BASE_URL!);
    await booksPage.setRowsPerPage(5);
    await booksPage.assertPaginationWorks();
});

test('book title click navigates to detail page', async ({ booksPage }) => {
    await booksPage.page.goto(process.env.BASE_URL!);
    await booksPage.clickFirstBookAndVerifyNavigationByUrl();
});