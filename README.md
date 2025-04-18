# MyKanban

Welcome to MyKanban, a full-stack Kanban board application built with the MERN stack. This repository contains both the backend and frontend code. Below you’ll find an overview of the tech choices, installation steps, and a quick user guide to help you get started.

# 🚀 Features

- User Authentication: Register and log in to manage your personal boards.
- Custom Boards: Create, rename, and delete boards (defaults to “My New Board”).
- Dynamic Columns & Cards: Add, rename, delete, and reorder columns and cards with easy drag-and-drop.
- Inline Editing: Double-click to edit names of columns, cards, and comments.
- Comments: Add, edit, and delete comments on any card.
- Timestamps: View creation and last-updated times on cards and comments.
- Search: Quickly filter cards using the search bar.
- Logout: Securely end your session when you’re done.

# 🛠 Tech Stack

### Backend

- Node.js & Express: REST API and server environment
- MongoDB & Mongoose: Data storage and ODM for users, boards, columns, cards, and comments
- TypeScript: Static typing for more reliable, maintainable code

### Frontend

- React & Vite: Fast, modular user interface
- Tailwind CSS: Utility-first styling for a consistent look
- @hello-pangea/dnd library is used for the Drag & Drop implementation, due to it's up to date maintenance over it's root, @atlassian/react-beautiful-dnd.
- Axios: Promise-based HTTP client
- TypeScript: Type safety in the UI

# Project Structure

The project is divided into distinct folders:

- `backend/` folder has the Express server, REST API routes, controllers and the Mongoose/MongoDB models
- `frontend/react-ts/` folder has React application built with Vite.

### Backend

- `/src/server.ts` is the main file that starts the Express server. It establishes the db connection and does initial routing for API routes.
- `/routes/` folder contains the more specific routing to the different controller functions. Each route file is grouped in relation to what that API call does, hence the names.
- `/controllers/` folder contains the actual logic for handling the requests and responses. The controllers interact with the database to create, update, delete or retrieve data.
- `/models/` folder contains the Mongoose schemas and models for the application data, so they get stored properly. Models exists for Users, Boards, Columns, Cards and Comments.
- `/middleware/` folder contains custom middleware, like `authMiddleware.ts`, which is used to protect certain routes, so that only authenticated users can access them.
- `/config/` folder contains configuration files, like `db.ts` used to establish connection to our database.

### Frontend

- `/src/` holds all the application code
- `/src/api/` folder centralizes the different API calls from the frontend to the backend
- `/src/components/` folder contains all the React components used for the site.
- `/src/context/` folder hold different global state management files. `AuthContext.tsx` manages authenticate state, `SearchContext.tsx` provides a global search query state to filter out cards.
- `/src/layouts/` folder centralizes the layouts, to wrap child routes to, to achieve consistency in the UI.
- `/src/pages/` folder holds all the different pages that can be displayed.
- `/src/types/` folder is used to centralize types for easy access throughout the code.

# ⚙️ Installation Guide

## Prerequisites

- Node.js v18.20.3 or newer
- npm v10.7.0 or newer
- MongoDB Community Edition (locally or hosted)
- MongoDB Compass (optional, for database management)

## Installing

1. First, clone the repository `git clone https://github.com/LStackH/Kanban-MERNStack-Website.git`
2. Navigate to the backend folder, once inside the repository folder, with `cd backend`
3. Install the npm modules and dependencies with `npm install`
4. You will need to create your own `.env` file in the backend folder, so `backend/.env`, with these required variables:

```
PORT={your chosen backend PORT, without the brackets} Example: 3000
MONGODB_URI={your connection string to MongoDB, without brackets}, Example: mongodb://localhost:27017/Kanban-MERN-Application
JWT_SECRET={your JWT secret used for encrypting, without brackets}, Example: SuperSecretJWTKey
```

5. Next, we need to setup the frontend. Navigate to the frontend folder `frontend/react-ts`. You can do this by backing out one step with `cd ..`, and then `cd frontend/react-ts`
6. Install the npm modules and dependencies with `npm install`
7. Create your own `.env` file in the frontend folder, so `frontend/react-ts/.env`, with these required variables:

```
VITE_API_URL=http://localhost:{backend PORT}/api
```

9. Build the frontend with `npm run build`
10. Finally, go back to the `backend/` folder, and run `npm start`. This will run the backend, that will also serve static files from the build. You should be able to visit `http://localhost:{port}` to view and interact with the website

# User Guide

## 1. Register / Log In

- New Users: Go to the Register page, enter a username, email, and password
- Returning Users: Use the Login page with your email and password.

## 2. Create & Manage Boards

- Click Create Board, give it a name (or leave default: “My New Board”).
- Rename or delete boards from your dashboard.

## 3. Columns & Cards

- Add Column: Name it and click Add Column. Double-click to rename later.
- Drag & Drop: Reorder columns by dragging.
- Add Card: Click + Add New Card or use the menu. Double-click to rename.
- Move Cards: Drag cards between columns.
- Delete: Use the delete button in the column/card menu.

## 4. Columns & Cards

- Open a card and type in the Add comment field.
- Double-click to edit, or click Delete to remove.

## 5. Search & Logout

- Search: Filter cards by keyword using the search bar at the top.
- Logout: Click Logout when you’re done.
