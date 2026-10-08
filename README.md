# Expense Tracker

A responsive expense tracker built with React for the Syntecxhub Web Development Internship (Week 1, Project 1).

## Features
- Add and delete expenses with a name, amount, category and date
- Loads starting data from a mock API (`public/expenses.json`)
- Filter expenses by category
- Summary cards for total spent, number of expenses and top category
- Donut chart of spending by category and bar chart of daily spending
- Works on desktop and mobile

## React hooks used
- **useState** – form inputs, expenses list, loading/error state and filter
- **useEffect** – fetches data from the mock API when the app loads
- **useRef** – focuses the expense name input on load and after adding an expense
- **useMemo** – calculates the filtered list, total, category totals and daily totals only when data changes
- **useCallback** – keeps the add/delete functions the same between renders so the memoized components don't re-render

## Tech stack
React, Vite, Recharts, CSS

## Run it locally
```bash
npm install
npm run dev
```
Then open http://localhost:5173