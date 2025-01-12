# Pro Manage

A project management application designed to help users create, edit, update, delete, and filter tasks. This application enables efficient task management and tracking.

## Table of Contents

*   [Getting Started](#getting-started)
*   [Features](#features)
*   [Technologies Used](#technologies-used)
*   [Project Structure](#project-structure)
    *   [Backend](#backend)
    *   [Frontend](#frontend)
*   [API Endpoints](#api-endpoints)
*   [Environment Variables](#environment-variables)
*   [Running the Application](#running-the-application)
*   [Contributing](#contributing)
*   [License](#license)

## Getting Started

To get started with Pro Manage, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/prashantpaidi/pro-manage
    ```

2.  **Navigate to the project directory:**

    ```bash
    cd pro-manage
    ```

3.  **Navigate to the backend directory:**

    ```bash
    cd backend
    ```

4.  **Install backend dependencies:**
    ```bash
    npm install
    ```

5.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend
    ```

6.  **Install frontend dependencies:**
    ```bash
    npm install
    ```
7.  **Create `.env` files:**
    - Create `.env` file in `backend` folder, add environment variable (like `PORT`, `MONGODB_URL`, `JWT_SECRET`)

    - Create `.env` file in `frontend` folder, add environment variable (like `VITE_APP_API_URL`)

8.  **Set up MongoDB:**
    - Ensure you have MongoDB installed and running.

## Features

*   **User Authentication:**
    *   Secure user registration and login.
    *   User profile update, including name and password changes.

*   **Task Management:**
    *   Create tasks with titles, priorities, checklist, task types, and due dates.
    *   Categorize tasks into "Backlog," "To do," "In progress," and "Done" lists.
    *   Move tasks between categories easily.
    *   Update task details, including status, checklist, and due date.
    *   Delete individual tasks.

*   **Task Sharing:**
    *   Option to view tasks without being logged in (view only).

*   **Task View:**
     * Ability to view a task in a separate page with all task details.

*   **Checklists:**
    *   Add checklists to each task with individual items that can be marked as done.

*   **Date Selection:**
    *   Ability to set and select due dates for tasks.
    
*  **Analytics:**
    * Dashboard to show analytics of different task categories.
    * Dashboard to show analytics of different task priorities.

*  **Filter:**
    * Filter task list based on today, this week, this month.

*   **Collapsible Task Lists:**
    *   Collapsible task lists for better UI.

*   **Responsive Design:**
    *   The application adapts to different screen sizes.

*   **Error Handling**
     *   Displays error messages for failed login/register attempts.

## Technologies Used

*   **Frontend:**
    *   React
    *   Vite
    *   React Router DOM
    *   React Hot Toast
    *  React Icons
    *   Axios

*   **Backend:**
    *   Node.js
    *   Express.js
    *   MongoDB
    *   Mongoose
    *   jsonwebtoken
    *   bcryptjs
    *   dotenv
    *   cors

## Project Structure

The project is structured into two main parts: the backend and the frontend.

### Backend

Located in the `backend` directory, the backend handles API requests and database interactions.

*   **`index.js`**: Entry point of the backend server. Handles server setup and database connection.
*   **`package.json`**: Lists the project's dependencies.
*   **`controllers/`**: Contains controllers for handling user and task-related requests.
    *   `taskController.js`: Handles operations for tasks (create, read, update, delete, analytics).
    *   `userController.js`: Manages user authentication (register, login, update profile).
*   **`middleware/`**: Includes middleware functions.
    *   `authMiddleware.js`: Verifies authentication tokens.
*  **`models/`**: Contains database models.
    * `Task.js` defines schema of the task
    * `User.js` defines schema of the User
*   **`routes/`**: Defines API routes.
    *   `taskRoutes.js`: Defines routes for task management.
    *   `userRoutes.js`: Defines routes for user authentication and profile management.

### Frontend

Located in the `frontend` directory, the frontend is built using React.

*   **`package.json`**: Lists the project's frontend dependencies.
*   **`index.html`**: Main entry point for HTML.
*   **`vite.config.js`**: Configuration file for Vite.
*   **`src/`**: Contains the project's source code.
    *   **`App.jsx`**: Main application component.
    *   **`main.jsx`**: Renders the application.
    *   **`index.css`**: Global styles.
    *   **`App.css`**: Styles specific to `App.jsx`.
    *   **`apis/`**: Contains API calls
        *  `tasks.js` handles all API calls for tasks
        *  `users.js` handles all API calls for users
    *   **`assets/`**: Contains images, icons, and other static files.
    *   **`components/`**: Reusable UI components.
          *   **`Auth/`**: Components for handling authentication (login and register forms).
          *    **`KanbanBoard/`**: Components related to kanban board.
          *   **`Task/`**: Components related to task (task form, task card).
          *   **`UI/`**: Contains reusable UI elements like `Modal` and `Priority`.
        *   **`context/`**: Contains context providers.
          *  `taskContext.jsx` provides context for task state management.

        * **`pages/`**: Contains page component for the application
             *  **`Auth/`**: Contains Auth Page
             *   **`Dashboard/`**: Contains Dashboard page
             *   **`Home/`**: Contains home page component
             *   **`Settings/`**: Contains Settings page component
             *   **`Analytics/`**: Contains Analytics page
             *   **`Task/`**: Contains task view page.
    *   **`utils/`**: Utility functions and constants.
        *  `constants.js` holds constants used in the application.
        *  `helpers.js` contains helper functions used in the application.

## API Endpoints

The following endpoints are available in the backend:

### User Routes (`/users`)

*   **`POST /users/register`**: Registers a new user.
*   **`POST /users/login`**: Logs in an existing user.
*  **`PUT /users/:userId`**: Updates the user name and password.

### Task Routes (`/tasks`)

*   **`GET /tasks/user/:userId`**: Gets all tasks for a specific user. Requires authorization.
*   **`GET /tasks/:id`**: Gets a single task by ID.
*   **`POST /tasks`**: Creates a new task. Requires authorization.
*   **`PUT /tasks/:id`**: Updates a task by ID. Requires authorization.
*   **`DELETE /tasks/:id`**: Deletes a task by ID. Requires authorization.
*   **`GET /tasks/analytics/:userId`**: Gets analytics data for a user’s tasks. Requires authorization.
*   **`GET /tasks/grouped/user/:userId`**: Gets all tasks for a specific user grouped by task type. Requires authorization.

## Environment Variables

Create `.env` files in both `backend` and `frontend` folders:

### Backend (`backend/.env`)

*   **`PORT`**: Port number to run the server on (e.g., `3000`).
*   **`MONGODB_URL`**: Connection string to MongoDB (e.g., `mongodb://localhost:27017/pro_manage`).
*   **`JWT_SECRET`**: Secret key used for JSON Web Token signing.

### Frontend (`frontend/.env`)

*  **`VITE_APP_API_URL`**: URL of the backend API server (e.g., `http://localhost:3000`).

## Running the Application

1.  **Start the backend server:**
    ```bash
    cd backend
    npm start
    ```

2.  **Start the frontend development server:**

    ```bash
    cd frontend
    npm run dev
    ```
    The frontend will typically be accessible at `http://localhost:5173`.

## Contributing

Contributions are always welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature`).
3.  Make your changes.
4.  Commit your changes (`git commit -am 'Add your feature'`).
5.  Push to the branch (`git push origin feature/your-feature`).
6.  Create a new Pull Request.

