# Todo App

A full-stack todo application with user authentication, project management, and priority-based task tracking.

## Features

- 🔐 User authentication (register/login with JWT)
- 📁 Project management (create, delete, switch between projects)
- ✅ Todo CRUD operations
- 🎯 Priority system (Low, Medium, High)
- 📅 Creation and completion date tracking
- 🔄 Smart sorting (incomplete todos first, oldest first)
- 🎨 Modern, responsive UI with Tailwind CSS

## Tech Stack

### Backend

- Node.js + Express
- SQLite database with Knex.js
- JWT authentication
- bcrypt for password hashing

### Frontend

- Vue 3 + Vite
- Tailwind CSS
- Pinia (state management)
- Vue Router
- Lucide Vue (icons)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. **Clone the repository** (or navigate to the project directory)

2. **Install backend dependencies**

```bash
cd backend
npm install
```

3. **Install frontend dependencies**

```bash
cd frontend
npm install
```

### Running the Application

1. **Start the backend server**

```bash
cd backend
node server.js
```

The backend will run on `http://localhost:3000`

2. **Start the frontend development server** (in a new terminal)

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5174`

3. **Access the application**
   Open your browser and navigate to `http://localhost:5174`

## Usage

1. **Register** a new account
2. **Login** with your credentials
3. **Create a project** using the "+" button in the sidebar
4. **Add todos** to your project with the "New Todo" button
5. **Set priorities** (Low, Medium, High) when creating todos
6. **Mark todos as complete** by clicking the circle checkbox
7. **View dates** - creation and completion dates are shown for each todo

## Database Schema

The application uses SQLite with three tables:

- **users**: User accounts with hashed passwords
- **projects**: User-owned projects
- **todos**: Tasks linked to projects with priority and completion tracking

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Projects

- `GET /api/projects` - Get all user projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Todos

- `GET /api/todos?project_id=X` - Get todos for a project
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo (including mark as complete)
- `DELETE /api/todos/:id` - Delete todo

## Testing

Run the backend test script:

```bash
cd /home/blinkerboy/todo
./test-backend.sh
```

## Deployment

For production deployment:

1. Set environment variables (create `.env` in backend):

```
JWT_SECRET=your-secure-random-secret
PORT=3000
```

2. Build the frontend:

```bash
cd frontend
npm run build
```

3. Use a process manager like PM2 to run the backend
4. Configure a reverse proxy (nginx) to serve the application

## License

MIT
