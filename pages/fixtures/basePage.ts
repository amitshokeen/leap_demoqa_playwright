import { test as base } from "@playwright/test";
import BooksPage from "../BooksPage";

export const test = base.extend<{
    booksPage: BooksPage;
    // just like booksPage, it is possibile to have more pages here
}>({
    //define the fixtures
    booksPage: async({ page }, use) => {await use(new BooksPage(page));},

    // just like booksPage, it is possibile to have more pages here
})