# Insurance Claim Submission & Tracking Portal

## 📌 Overview

The **Insurance Claim Submission and Tracking Portal** is a full-stack web application designed to streamline the lifecycle of insurance claims. It features a robust role-based architecture supporting standard users, claim officers, and administrators, ensuring secure handling of sensitive data, seamless file management, and transparent communication.

## ✨ Key Features

* **Role-Based Access Control (RBAC):** Secure authentication flows differentiate permissions for standard claimants, claim officers, and administrators. The backend enforces security via `authMiddleware.js` and `roleMiddleware.js`, while the React frontend wraps restricted views in a `ProtectedRoute.jsx` component.


* **Interactive UI & Dynamic Theming:** The interface features a custom `FloatingBackground.jsx` component that renders interactable, animated floating elements across the layout to enhance visual depth and user engagement. This is paired with a global `ThemeContext.jsx` for seamless light/dark mode toggling.


* **Secure Evidence Uploads:** Built-in multipart form handling via `uploadMiddleware.js` allows users to securely attach documents and photographic evidence when submitting their claims through the `ClaimForm.jsx` interface.


* **Asynchronous Commenting System:** Dedicated communication threads allow direct dialogue between claimants and assigned officers on specific claims, managed by the `commentController.js` and structured via the `Comment.js` entity.


* **Centralized Global State:** Uses Redux Toolkit (`store.js`, `authSlice.js`, `claimsSlice.js`) to cache user sessions and claim data, reducing redundant API fetches and ensuring UI synchronization across dashboards.


* **Centralized Error Handling:** Backend API requests are wrapped in an `asyncHandler.js` to catch promise rejections, routing them to a unified `errorHandler.js` for consistent API responses.



## 🛠️ Tech Stack

**Frontend:** React, Vite, Redux Toolkit, custom CSS UI components (`Button`, `Card`, `Input`, `FloatingBackground`).

**Backend:** Node.js, Express.js, MVC Architecture (`controllers/`, `routes/`, `entities/`).

**Database:** Relational database management (e.g., PostgreSQL) utilizing entity models (`Claim.js`, `Comment.js`, `User.js`).

## 🚀 Getting Started

To run this project locally, ensure you have **Node.js** and a local instance of **PostgreSQL** (or your designated relational database) installed and running.

### 1. Database Setup

1. Open your database management tool or terminal.
2. Create a new, empty database for the project (e.g., `xyz_db`).

### 2. Backend Setup

1. Navigate to the backend directory: `cd backend`.


2. Install the server dependencies: `npm install`.


3. Create a `.env` file in the `backend/` directory. Add your necessary environment variables based on the database and authentication setup:
```env
PORT= ?
DB_HOST= ?
DB_PORT= ?
DB_USER= ?
DB_PASS= ?
DB_NAME= ?
JWT_SECRET= ?
NODE_ENV=development

```


4. Run any required database migrations or synchronization scripts to generate the tables for `User`, `Claim`, and `Comment` entities.


5. Start the backend server: `npm start` (or `npm run dev` if using nodemon).


6. Note that admin user can be created by direct insertion in database.

### 3. Frontend Setup

1. Open a new terminal instance and navigate to the frontend directory: `cd frontend`.


2. Install the client dependencies: `npm install`.


3. Start the Vite development server: `npm run dev`.


4. Open the provided `localhost` URL in your browser to access the portal.
