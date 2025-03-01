# Author: Lukas Honka
This repo includes both the backend and the frontend for this MERN-Stack, MyKanban website

# Kanban-MERN-Stack Website
This website is a full-stack Kanban board website. The application allows registering and login, so that authenticated users can create their Kanban board, where they can add and remove columns, cards and reorder them with a drag and drop implementation. 
Column, card and comments can be changed with inline editing by double-clicking the text. Each card and comment comes with visible timestamps.

# Technology choices
## Backend
* NodeJS & Express are used to provide server environment and routing
* MongoDB is used as the database, to store user data, boards, columns, cards and comments. Mongoose library is used interact with MongoDB
* TypeScript is used to enable static typing for all of the code, for improved maintainability and readability.

## Frontend
* React with Vite is used to enable fast, modular and readable code for the frontend
* Tailwind CSS is used for all of the styling, for consistency and ease of use
* @hello-pangea/dnd library is used for the Drag & Drop implementation, due to it's up to date maintenance over it's root, @atlassian/react-beautiful-dnd.
* Axios library is used to simplify API call codes from the frontend
* TypScript is used in the frontend as well.

# Application Architecture
The project is divided into distinct folders:
* `backend/` folder has the Express server, REST API routes, controllers and the Mongoose/MongoDB models
* `frontend/react-ts/` folder has React application built with Vite.

# Installation Guide
## Requirements
The project was built and ran on Node v.18.20.3. NPM version used was 10.7.0. You will also need to have installed MongoDB locally (https://www.mongodb.com/try/download/community). MongoDBCompass is highly recommended for ease of use in interacting with the database manually (https://www.mongodb.com/try/download/compass).

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

# User Manual
## Registration and Authentication
New users without accents need to register via the Register page. They will need to fill out their username, email and password.
Users with accounts can use the login page and fill out their existing email and password information.

## Features
* Each person needs to make their own board, that they can name. It will default to `My New Board` if no name is chosen
* With the board created, users can create their Columns, which they must name first, then click `Add Column` button. User can create as many columns as they wish, and reorganise them by dragging and dropping.
  * Renaming columns happens by double-clicking the name, editing it and clicking save.
  * Deleting a column happens by clicking the three dots in the chosen column, and clicking `Delete Column`
* With a certain column in mind, the user can either click the three dots in the upper right corner, OR just click `+ Add New Card`, to add a new card, which they must name. User can create as many cards as they wish, and reorganise them by dragging or dropping.
  *  Renaming the cards happens by double-clicking the name, editing it and clicking save.
  *  Deleting happens by clicking the red `Delete` button next to the cards title
  *  Cards have their Creation and Updated timestamps visible
* Comments can be added to any card, by hovering over the `Add comment` section, writing the comment and clicking `Add`.
  * Editing the comment happens by double-clicking the name, editing it and clicking save.
  * Deleting happens by clicking the red `Delete` button next to the comment
  * Comments have their Creation and Updated timestamps visible
* User can search to filter out other cards, that do not have the search query in them. This happens at the top right of the page, in the `Search cards...` field, next to `Logout` button
* If the user wishes to logout, they can click the `Logout` button. 
