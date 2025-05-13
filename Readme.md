# ToolsQA Book Store – Automated UI Test Suite

This project contains a professional-grade Web UI Automation Test Suite for the [ToolsQA Book Store](https://demoqa.com/books) using **Playwright** and **TypeScript**.

> **Note**: User registration and login features are intentionally excluded from the scope.

---

## Tech Stack

- **Test Framework:** [Playwright](https://playwright.dev/)
- **Language:** TypeScript
- **Runner:** Playwright Test
- **Assertion & Reporting:** Playwright built-in expect, HTML Reports
- **Design Patterns:** Page Object Model (POM), Custom Fixtures
- **CI/CD Friendly:** Headless mode, trace viewer, retry mechanism

---

## Features Tested

- **Dynamic Search:** Case-insensitive title matching
- **Negative Scenarios:** No-match handling for invalid search input (`#$%`)
- **Row Limits:** Validation for configurable row limits (e.g., 5, 10)
- **Visual Elements:** Presence of thumbnails, titles, authors, and publishers
- **Pagination:** "Next" and "Previous" page navigation behavior
- **Navigation:** Clicking on a book title navigates to its detail page


---

## Project Structure

