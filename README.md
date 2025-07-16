# Expense Tracker API Details :

## AuthRoute :(API Folder)=>(`api/auth/route.js`)

- `/login`

- `/signUp`

- `/logout`

## UserRoute :(`api/user/route.js`)

- `user/profile`

- `user/profile/update`

## Expense API (`api/expense/route.js`)

- `GET /api/expenses:` Get all expenses for logged-in user

- `POST /api/expenses:` Add a new expense

- `PUT /api/expenses/:id:` Update an expense

- `DELETE /api/expenses/:id:` Delete an expense

- `GET /api/expenses/stats:` Summary for graphs

## Income API (`api/income/route.js`)

- `GET /api/income:` Get all income for logged-in user

- `POST /api/income:` Add a new income

- `PUT /api/income/:id:` Update an income

- `DELETE /api/income/:id:` Delete an income

- `GET /api/income/stats:` Summary for graphs

## category API(`api/category/route.js`)

- `GET /api/category` Get all the category

- `POST /api/category` Create category

- `DELETE /api/category` Delete category

- `PUT /api/category` Update category

# `Stack Justification :`

- `Nextjs` - To Build the Fullstack
- `JWT` - authentication
- `TailwindCss`- Styling
- `mongoDB` - database to store all the data
- `React hook form and Zod` - for validating the form
- `Rechart` - To show chart view(It is simple and responsive)
- `useContext or Zustand` - Global store
