# Service Layer

This directory contains the service layer for the todo application. The service layer separates business logic from controllers, following the best practice of separation of concerns.

## Architecture

The service layer is responsible for:

- Business logic implementation
- Data validation
- Database operations
- Error handling
- Data transformation

Controllers are now only responsible for:

- HTTP request/response handling
- Status code management
- Response formatting

## Services

### UserService

Handles all user-related business logic including:

- User registration and authentication
- Password hashing and validation
- User profile management
- User statistics calculation

**Key methods:**

- `registerUser(data)` - Register a new user
- `loginUser(data)` - Authenticate user and generate token
- `getAllUsers()` - Get all users with stats
- `getUserById(id)` - Get user by ID with stats
- `updateUser(id, data)` - Update user information
- `deleteUser(id)` - Delete user and associated data
- `getUserProfile(userId)` - Get user profile with detailed stats
- `updatePassword(userId, currentPassword, newPassword)` - Update user password

### TodoListService

Handles all todo list-related business logic including:

- Todo list creation and management
- Todo list statistics
- User-todo list relationships

**Key methods:**

- `createTodoList(data)` - Create a new todo list
- `getAllTodoLists()` - Get all todo lists with counts
- `getTodoListsByUserId(userId)` - Get todo lists by user ID
- `getTodoListById(id)` - Get todo list by ID with todos
- `updateTodoList(id, data)` - Update todo list
- `deleteTodoList(id)` - Delete todo list and its todos

### TodoService

Handles all todo-related business logic including:

- Todo creation and management
- Todo status updates
- Todo list relationships

**Key methods:**

- `getAllTodos()` - Get all todos
- `getTodosByListId(listId)` - Get todos by list ID
- `getTodoById(id)` - Get todo by ID
- `createTodo(data)` - Create a new todo
- `updateTodo(id, data)` - Update todo
- `deleteTodo(id)` - Delete todo
- `deleteAllTodosByListId(listId)` - Delete all todos by list ID

## Usage

### Importing Services

```typescript
import { UserService, TodoListService, TodoService } from "../services";
```

### Error Handling

Services throw errors that are caught by controllers and converted to appropriate HTTP responses:

```typescript
try {
  const user = await UserService.getUserById(id);
  res.status(200).json({ success: true, data: user });
} catch (error) {
  res.status(500).json({
    success: false,
    message: "Failed to fetch user",
    error: (error as Error).message,
  });
}
```

### Data Validation

Services handle all data validation internally:

```typescript
// Service handles validation
const userData = await UserService.registerUser({ username, email, password });

// Controller just handles response
res.status(201).json({
  success: true,
  data: userData,
  message: "User registered successfully",
});
```

## Benefits

1. **Separation of Concerns**: Business logic is separated from HTTP handling
2. **Reusability**: Services can be used by different controllers or other services
3. **Testability**: Business logic can be unit tested independently
4. **Maintainability**: Changes to business logic don't affect controller code
5. **Type Safety**: Strong typing with TypeScript interfaces
6. **Error Handling**: Centralized error handling in services

## Interfaces

Each service exports TypeScript interfaces for type safety:

- `UserRegistrationData`
- `UserLoginData`
- `UserUpdateData`
- `UserStats`
- `UserWithStats`
- `UserProfileData`
- `TodoListCreateData`
- `TodoListUpdateData`
- `TodoListWithCounts`
- `TodoListWithTodos`
- `TodoCreateData`
- `TodoUpdateData`
