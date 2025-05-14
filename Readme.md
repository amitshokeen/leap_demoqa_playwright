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
- **CI/CD Integration:** GitHub Actions + GitHub Pages

---

## Features Tested

- **Dynamic Search:** Case-insensitive title matching
- **Negative Scenarios:** No-match handling for invalid search input (`#$%`)
- **Row Limit Configuration:** Supports 5 and 10 row views with data validation
- **Visual Elements:** Presence of thumbnails, titles, authors, and publishers
- **Pagination:** "Next" and "Previous" page navigation behavior
- **Navigation:** Clicking on a book title navigates to its detail page


---

## Project Structure
- pages/ → Page Object Model classes (BooksPage.ts)
- tests/ → Test definitions and scenarios
- .github/workflows/ → GitHub Actions pipeline (playwright.yml)
- playwright.config.ts → Playwright test configuration
- .env → Environment variables (BASE_URL, etc.)

---

## Continuous Integration (CI)

This project uses **GitHub Actions** to automatically run tests on each push and pull request to the `master` branch.

Key highlights:

- Runs tests in **headless mode**
- Collects **HTML test reports**
- Uploads reports as **build artifacts**
- Deploys HTML reports to **GitHub Pages**

---

## View Live Test Reports

Latest Playwright HTML test reports are published automatically after each successful CI run:

**[View Report on GitHub Pages](https://amitshokeen.github.io/leap_demoqa_playwright/)**

> Note: This URL always shows the latest report from the `master` branch.

---

## Setup Instructions

```bash
# Install dependencies
npm install

# Run tests in headless mode
npx playwright test

# View the HTML report locally
npx playwright show-report
```
---

## Author

Amit Shokeen  
