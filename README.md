# 📝 Todo App - Task Management Application

A modern, full-stack todo application built with React, TypeScript, Node.js, and MongoDB. Organize your tasks efficiently with drag-and-drop functionality, custom categories, and a beautiful dark/light theme interface.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🔐 User Authentication

- **User Registration & Login** - Secure authentication with JWT tokens
- **Password Management** - Change passwords with current password verification
- **Profile Management** - Update username and email
- **Account Deletion** - Complete account and data removal

### 📚 Todo List Management

- **Multiple Lists** - Create and organize todos into different lists
- **Custom Categories** - Categorize lists (Work, Personal, Study, etc.)
- **Progress Tracking** - Visual progress bars showing completion status
- **List Statistics** - View total and completed task counts

### ✅ Todo Management

- **Create, Edit, Delete** - Full CRUD operations for todos
- **Due Dates** - Set and track task deadlines with calendar picker
- **Drag & Drop** - Reorder tasks with intuitive drag-and-drop interface
- **Status Filtering** - Filter tasks by completion status (All, Completed, Incomplete)
- **Rich Descriptions** - Add detailed descriptions to tasks

### 🎨 User Interface

- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Dark/Light Theme** - Toggle between themes with persistent preference
- **Modern UI Components** - Built with Radix UI and Tailwind CSS
- **Smooth Animations** - Enhanced user experience with CSS transitions
- **Accessible** - WCAG compliant interface elements

### 🔍 Advanced Features

- **Search & Filter** - Find tasks and lists quickly
- **Category Management** - Organize lists by custom categories
- **Completion Analytics** - Track productivity with visual indicators
- **Real-time Updates** - Instant UI updates for better user experience

## 🛠 Tech Stack

### Frontend

- **React 19** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS 4.0** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled UI components
- **React Router DOM** - Client-side routing
- **@dnd-kit** - Modern drag-and-drop library
- **Axios** - HTTP client for API requests
- **Lucide React** - Beautiful icon library
- **Date-fns** - Date manipulation utilities

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe server development
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Development Tools

- **ESLint** - Code linting and quality
- **ts-node-dev** - TypeScript development server
- **Concurrently** - Run multiple commands simultaneously

## 📸 Screenshots

<!--
TODO: Add screenshots here
You can add screenshots of:
1. Login/Register page
2. Todo Lists overview
3. Individual todo list with tasks
4. User profile page
5. Dark/Light theme comparison
6. Mobile responsive views
-->

### Login & Registration

_Secure authentication with beautiful, responsive design_

![User Registration Form](docs/images/register.png)
_Registration form with form validation and error handling_

![User Login Interface](docs/images/login.png)
_Clean login interface with remember me option_

### Todo Lists Dashboard

_Overview of all your todo lists with progress tracking_

![Todo Lists Overview](docs/images/lists.png)
_Dashboard showing multiple todo lists with categories, progress bars, and completion statistics_

### Task Management

_Individual todo list with drag-and-drop functionality_

![Task Management Interface](docs/images/tasks.png)
_Todo list view with tasks, completion checkboxes, and filtering options_

### User Profile

_Comprehensive user profile and settings management_

![User Profile Page](docs/images/profile.png)
_User profile with account settings, password management, and account statistics_

### Light Theme

_Beautiful light theme with consistent design language_

![Light Theme Dashboard](docs/images/light-lists.png)
_Todo lists in light theme showing clean, modern interface_

![Light Theme Task View](docs/images/light-profile.png)
_Task management interface in light theme with clear readability_

## 🚀 Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Clone the Repository

```bash
git clone https://github.com/notDuyLam/todo-app.git
cd todo-app
```

### Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Set up environment variables (see Environment Variables section)
cp .env.example .env

# Start development server
npm run dev
```

### Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

## 🔧 Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/todoapp
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todoapp

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Server Port
PORT=3000

# Node Environment
NODE_ENV=development
```

### Required Environment Variables:

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation (use a strong, random string)
- `PORT`: Server port (optional, defaults to 3000)
- `NODE_ENV`: Environment mode (development/production)

## 💡 Usage

### Getting Started

1. **Register Account**: Create a new account or login with existing credentials
2. **Create Todo Lists**: Start by creating your first todo list with a custom category
3. **Add Tasks**: Add tasks to your lists with optional descriptions and due dates
4. **Organize**: Use drag-and-drop to reorder tasks and categories to organize lists
5. **Track Progress**: Monitor your productivity with completion statistics

### Key Workflows

#### Creating and Managing Lists

- Click "New List" to create a todo list
- Choose from existing categories or create custom ones
- View progress and statistics for each list

#### Managing Tasks

- Click on a list to view and manage its tasks
- Add new tasks with the "+" button
- Edit tasks by clicking on them
- Use drag-and-drop to reorder tasks
- Mark tasks as complete with checkboxes

#### User Management

- Access user profile from the navigation menu
- Update profile information and password
- Toggle between dark and light themes
- Delete account if needed (with confirmation)

## 📚 API Documentation

### Authentication Endpoints

```
POST /api/users/register     # Register new user
POST /api/users/login        # Login user
POST /api/users/logout       # Logout user
GET  /api/users/profile      # Get user profile
PUT  /api/users/:id          # Update user profile
PUT  /api/users/:id/password # Update password
DELETE /api/users/:id        # Delete user account
```

### Todo Lists Endpoints

```
GET    /api/todoList              # Get all todo lists
POST   /api/todoList              # Create new todo list
GET    /api/todoList/user/:userId # Get user's todo lists
GET    /api/todoList/:id          # Get specific todo list
PUT    /api/todoList/:id          # Update todo list
DELETE /api/todoList/:id          # Delete todo list
```

### Todos Endpoints

```
GET    /api/todos                 # Get all todos
POST   /api/todos                 # Create new todo
GET    /api/todos/list/:listId    # Get todos by list
GET    /api/todos/:id             # Get specific todo
PUT    /api/todos/:id             # Update todo
DELETE /api/todos/:id             # Delete todo
```

### Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Ensure responsive design
- Follow existing code style and conventions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Radix UI](https://www.radix-ui.com/) for accessible UI components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Lucide](https://lucide.dev/) for beautiful icons
- [dnd kit](https://dndkit.com/) for drag-and-drop functionality

## 📧 Contact

**Developer**: notDuyLam  
**Repository**: [https://github.com/notDuyLam/todo-app](https://github.com/notDuyLam/todo-app)

---

Built with ❤️ using React, TypeScript, and Node.js
