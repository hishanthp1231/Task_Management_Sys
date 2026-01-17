# Task Management API

A professional Node.js & Express-based Backend API for managing tasks with JWT authentication, MongoDB, and a fully automated CI/CD pipeline.

## 🚀 Live Demo
The API is deployed and running on Azure App Service:
[https://task-management-epfmctfgfvh4gmef.eastasia-01.azurewebsites.net/](https://task-management-epfmctfgfvh4gmef.eastasia-01.azurewebsites.net/)

## ✨ Features
- **JWT Authentication:** Secure user registration and login.
- **Task Management:** Full CRUD operations for tasks (Title, Description, Status).
- **Automated ID Generation:** Sequential numerical IDs for users and tasks using MongoDB.
- **CI/CD Pipeline:** Automated testing and deployment via GitHub Actions.
- **Testing Suite:** Comprehensive API testing using Jest, Supertest, and `mongodb-memory-server`.

## 🛠️ Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Security:** JWT (JSON Web Tokens), Bcrypt.js (Password Hashing)
- **Deployment:** Azure App Service
- **CI/CD:** GitHub Actions

## 📦 Project Structure
```text
├── .github/workflows/    # CI/CD Pipeline configuration
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # API logic handlers
│   ├── middlewares/     # Auth and error middlewares
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoint definitions
│   └── index.js         # Entry point
├── tests/               # API Integration tests
└── Dockerfile           # Docker configuration
```

## ⚙️ Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hishanthp1231/Task_Management_Sysytem.git
   cd Task_Management_Sysytem
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=production
   ```

4. **Run the application:**
   - Development mode: `npm run dev`
   - Production mode: `npm start`

## 🧪 Testing
Run the automated test suite:
```bash
npm test
```
*Tests use an in-memory database and do not affect your live data.*

## 🚀 CI/CD Pipeline
- **Continuous Integration (CI):** Every push to `main` or a Pull Request triggers an automated test run.
- **Continuous Deployment (CD):** Once tests pass on the `main` branch, the app is automatically deployed to Azure App Service.

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info (Protected)

### Tasks (All Protected)
- `GET /api/tasks` - Get all tasks for the user
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get a specific task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

---
Developed by [Hishanth](https://github.com/hishanthp1231)
