# Task Management System

A full-stack task management application built with modern technologies following SOLID principles and best practices.

## 🚀 Features

### Backend (NestJS)
- **JWT Authentication** - Secure user authentication and authorization
- **MongoDB Integration** - Robust data persistence with Mongoose
- **RESTful API** - Complete CRUD operations for tasks and users
- **Task Management** - Create, update, delete, and filter tasks
- **Search & Filter** - Advanced filtering by status, user, date, and search terms
- **Swagger Documentation** - Interactive API documentation
- **Role-based Permissions** - Users can only edit/delete their own tasks
- **Data Validation** - Comprehensive input validation with class-validator

### Frontend (Next.js + React)
- **Modern React** - Built with Next.js 15 and React 19
- **TypeScript** - Full type safety throughout the application
- **Responsive Design** - Mobile-first design with Tailwind CSS
- **Authentication Flow** - Login/Register with JWT token management
- **Real-time Dashboard** - Task statistics and progress tracking
- **Advanced Filtering** - Filter tasks by status, user, date range, and search
- **Form Validation** - Client-side validation with react-hook-form
- **Custom Hooks** - Reusable logic for API calls and state management
- **Component Library** - Reusable UI components following design system principles

## 🏗️ Architecture

### Backend Architecture
```
src/
├── auth/                    # Authentication module
│   ├── strategies/          # JWT and Local strategies
│   ├── guards/             # Auth guards
│   └── decorators/         # Custom decorators
├── tasks/                  # Tasks module
├── database/               # Database schemas and models
│   └── schemas/           # Mongoose schemas
├── shared/                # Shared interfaces and DTOs
│   ├── interfaces/        # TypeScript interfaces
│   └── dto/              # Data Transfer Objects
└── main.ts               # Application entry point
```

### Frontend Architecture
```
src/
├── app/                   # Next.js app router
│   ├── dashboard/         # Dashboard page
│   ├── tasks/            # Tasks page
│   ├── login/            # Login page
│   └── register/         # Register page
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── TaskCard.tsx     # Task display component
│   ├── TaskForm.tsx     # Task creation/editing form
│   ├── TaskList.tsx     # Task list with filtering
│   └── Layout.tsx       # Application layout
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and API client
└── types/              # TypeScript type definitions
```

## 🛠️ Technology Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Passport** - Authentication middleware
- **Swagger** - API documentation
- **Class Validator** - Input validation
- **bcryptjs** - Password hashing

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Lucide React** - Icon library

## 📋 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=3001
```

5. Start the server:
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3001`
API Documentation: `http://localhost:3001/api/docs`

### Frontend Setup

1. Navigate to the web directory:
```bash
cd web
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Configure environment variables in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📖 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile
- `GET /api/auth/users` - Get all users (for task assignment)

### Task Endpoints
- `GET /api/tasks` - Get all tasks with optional filters
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get task by ID
- `PATCH /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/stats` - Get task statistics

### Query Parameters for Task Filtering
- `status` - Filter by task status (Pending, In Progress, Completed)
- `assignedUser` - Filter by assigned user ID
- `search` - Search in title and description
- `dueDateFrom` - Filter tasks due after this date
- `dueDateTo` - Filter tasks due before this date

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Passwords are hashed using bcrypt
- **Input Validation** - All inputs are validated on both client and server
- **CORS Protection** - Configured CORS for secure cross-origin requests
- **Authorization Guards** - Route-level protection for authenticated endpoints
- **Data Sanitization** - Prevents injection attacks

## 🎨 UI/UX Features

- **Responsive Design** - Works seamlessly on all device sizes
- **Modern Interface** - Clean and intuitive user interface
- **Loading States** - Proper loading indicators for better UX
- **Error Handling** - Comprehensive error handling with user-friendly messages
- **Form Validation** - Real-time form validation with helpful error messages
- **Dark Mode Ready** - Built with dark mode support in mind

## 🧪 Testing

### Backend Testing
```bash
cd server

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Frontend Testing
```bash
cd web

# Run tests (when test setup is complete)
npm run test
```

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Build the application: `npm run build`
3. Start production server: `npm run start:prod`

### Frontend Deployment
1. Set production environment variables
2. Build the application: `npm run build`
3. Start production server: `npm start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 👥 Team

Built with ❤️ by the development team following SOLID principles and modern best practices.
