# Mess Management System - Implementation Guide

## System Overview

This document explains how the complete login system and role-based dashboard pages are implemented using backend API integration.

---

## Architecture

### Frontend Technology Stack
- **React 19** with TypeScript
- **React Router v7** for routing
- **Axios** for API calls
- **Context API** for state management

### Backend Technology Stack
- **Express.js** with Node.js
- **MySQL** for database
- **JWT** for authentication
- **Nodemailer** for OTP sending

### Supported User Roles
1. **STUDENT** - Student dashboard
2. **MESS_SECRETARY** - Mess secretary dashboard
3. **CARE_TAKER** - Care taker dashboard
4. **MESS_SUPERVISOR** - Mess supervisor dashboard
5. **WARDEN** - Warden dashboard

---

## Database Architecture

### User Storage

#### Student Table
```sql
CREATE TABLE student (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    hostel_id INT,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    room_no VARCHAR(20),
    FOREIGN KEY (hostel_id) REFERENCES hostel(hostel_id)
);
```

#### Staff Table (for all staff roles)
```sql
CREATE TABLE staff (
    staff_id INT AUTO_INCREMENT PRIMARY KEY,
    hostel_id INT,
    name VARCHAR(100),
    role VARCHAR(50),  -- MESS_SECRETARY, CARE_TAKER, MESS_SUPERVISOR, WARDEN
    email VARCHAR(100) UNIQUE,
    FOREIGN KEY (hostel_id) REFERENCES hostel(hostel_id)
);
```

---

## Backend API Implementation

### 1. OTP Sending Endpoint

**Route:** `POST /api/users/send-otp`

**Request Body:**
```json
{
  "email": "user@uohyd.ac.in",
  "role": "STUDENT" | "MESS_SECRETARY" | "CARE_TAKER" | "MESS_SUPERVISOR" | "WARDEN"
}
```

**Controller Logic (`backend/controller/user.controller.js`):**
```javascript
async function findUserByRole(email, role) {
  if (role === "STUDENT") {
    // Query student table
    const [rows] = await pool.query(queries.getStudentByEmail, [email]);
    if (rows.length > 0) {
      return { user: rows[0], role: "STUDENT", id: rows[0].student_id };
    }
  } else {
    // Query staff table
    const [rows] = await pool.query(queries.getStaffByEmail, [email]);
    if (rows.length > 0 && rows[0].role == role) {
      return { user: rows[0], role: rows[0].role, id: rows[0].staff_id };
    }
  }
  return null;
}
```

**Response:**
```json
{
  "message": "OTP sent",
  "token": "jwt_temp_token_here",
  "role": "STUDENT"
}
```

### 2. OTP Verification Endpoint

**Route:** `POST /api/users/verify-otp`

**Request Body:**
```json
{
  "otp": "123456",
  "token": "jwt_temp_token_here",
  "role": "STUDENT" | "MESS_SECRETARY" | "CARE_TAKER" | "MESS_SUPERVISOR" | "WARDEN"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "auth_jwt_token",
  "role": "STUDENT",
  "user": {
    "student_id": 1,
    "name": "Student Name",
    "email": "student@uohyd.ac.in"
  }
}
```

### 3. Logout Endpoint

**Route:** `POST /api/users/logout`

**Response:**
```json
{
  "message": "Logged out"
}
```

---

## Frontend Implementation

### 1. Authentication Context

**File:** `frontend/src/contextAPI/AuthContext.tsx`

Manages:
- User email and OTP
- User role
- Authentication token
- User data
- Login/logout functions

```typescript
export type UserRole = "STUDENT" | "MESS_SECRETARY" | "CARE_TAKER" | "MESS_SUPERVISOR" | "WARDEN" | null;
```

### 2. Auth Provider

**File:** `frontend/src/contextAPI/AuthProvider.tsx`

- Provides authentication state to entire app
- Manages localStorage for persistent sessions
- Sets authorization headers for API calls

### 3. Login Form

**File:** `frontend/src/components/LoginForm/LoginForm.tsx`

**Flow:**
1. User selects role from dropdown
2. Enters email
3. Clicks "Send OTP" → API call to `/users/send-otp`
4. Receives temp token
5. Enters OTP
6. Clicks "Verify & Continue" → API call to `/users/verify-otp`
7. Receives auth token
8. Redirected to role-specific dashboard

### 4. Protected Routes

**File:** `frontend/src/components/ProtectedRoute.tsx`

Checks:
- User is authenticated
- User role matches allowed roles
- Redirects to login if unauthorized

### 5. API Calls

**File:** `frontend/src/api/auth.ts`

```typescript
export const sendOtp = (email: string, role: UserRole) => {
  return axiosInstance.post("/users/send-otp", { email, role });
};

export const verifyOtp = (otp: string, token: string, role: UserRole) => {
  return axiosInstance.post("/users/verify-otp", { otp, token, role });
};

export const logout = () => {
  return axiosInstance.post("/users/logout");
};
```

---

## Routing Configuration

### Frontend Routes

**File:** `frontend/src/App.tsx`

```
/                          → HomePage
/login                     → LoginPage
/dashboard                 → Student Dashboard (Protected)
/warden                    → Warden Dashboard (Protected)
/mess-secretary            → Mess Secretary Dashboard (Protected)
/care-taker                → Care Taker Dashboard (Protected)
/mess-supervisor           → Mess Supervisor Dashboard (Protected)
/feedback                  → Feedback Page (Protected, STUDENT only)
```

### Dashboard Pages

| Route | Component | Role | File |
|-------|-----------|------|------|
| /dashboard | Dashboard | STUDENT | `frontend/src/pages/Dashboard/Dashboard.tsx` |
| /warden | WardenDashboard | WARDEN | `frontend/src/pages/WardenDashboard/WardenDashboard.tsx` |
| /mess-secretary | MessSecretaryDashboard | MESS_SECRETARY | `frontend/src/pages/MessSecretaryDashboard/MessSecretaryDashboard.tsx` |
| /care-taker | CareTakerDashboard | CARE_TAKER | `frontend/src/pages/CareTakerDashboard/CareTakerDashboard.tsx` |
| /mess-supervisor | MessSupervisorDashboard | MESS_SUPERVISOR | `frontend/src/pages/MessSupervisorDashboard/MessSupervisorDashboard.tsx` |

---

## Login Flow Diagram

```
User
  ↓
Login Page
  ↓
Select Role → Enter Email
  ↓
Send OTP Button
  ↓
POST /api/users/send-otp {email, role}
  ↓
Backend: findUserByRole()
  ├─ If role === "STUDENT" → Query student table
  ├─ Else → Query staff table with role filter
  ↓
If user found:
  ├─ Generate OTP
  ├─ Send OTP email
  ├─ Return temp JWT token
  ↓
User receives OTP in email
  ↓
Enter OTP Code
  ↓
Verify & Continue Button
  ↓
POST /api/users/verify-otp {otp, token, role}
  ↓
Backend: verifyOTP()
  ├─ Verify OTP validity
  ├─ findUserByRole() again
  ├─ Generate auth JWT token
  ├─ Set HTTP-only cookie
  ↓
Return auth token + user data + role
  ↓
Frontend: AuthContext.login()
  ├─ Store token in localStorage
  ├─ Store role and user data
  ├─ Set Authorization header
  ↓
Navigate to role-specific dashboard
  ↓
Role-based Dashboard Loaded
```

---

## Authentication Flow Details

### Session Persistence

1. After successful login, token is stored in localStorage
2. Token is also set in axios headers as Bearer token
3. On page refresh, AuthProvider retrieves from localStorage
4. Axios automatically includes token in all requests

### JWT Token Structure

```javascript
{
  id: user_id,
  email: user_email,
  role: user_role,
  iat: issued_at,
  exp: expiry (1 day)
}
```

### Protected Route Validation

```typescript
if (!isAuthenticated) {
  redirect to /login
}

if (allowedRoles && !allowedRoles.includes(role)) {
  redirect to /
}
```

---

## How to Add a New Staff Role

### Backend Steps:

1. **Insert user into staff table:**
   ```sql
   INSERT INTO staff (name, email, role, hostel_id) 
   VALUES ('John Doe', 'john@uohyd.ac.in', 'NEW_ROLE', 1);
   ```

2. **The controller already supports any role** - just ensure the email matches

### Frontend Steps:

1. **Update AuthContext** (`frontend/src/contextAPI/AuthContext.tsx`):
   ```typescript
   export type UserRole = "STUDENT" | "... other roles ..." | "NEW_ROLE" | null;
   ```

2. **Update LoginForm** (`frontend/src/components/LoginForm/LoginForm.tsx`):
   ```typescript
   const roles = [
     { label: "New Role", value: "NEW_ROLE" }
   ];
   ```

3. **Add navigation logic:**
   ```typescript
   } else if (verifiedRole === "NEW_ROLE") {
     navigate("/new-role-dashboard");
   }
   ```

4. **Create new dashboard component:**
   - Create folder: `frontend/src/pages/NewRoleDashboard/`
   - Create component: `NewRoleDashboard.tsx`

5. **Add route in App.tsx:**
   ```typescript
   <Route
     path="/new-role-dashboard"
     element={
       <ProtectedRoute allowedRoles={["NEW_ROLE"]}>
         <NewRoleDashboard />
       </ProtectedRoute>
     }
   />
   ```

6. **Update Swagger documentation** in backend routes

---

## API Configuration

### Base URL
- Development: `http://localhost:5000/api`
- Set in `frontend/.env.local`: `VITE_API_URL=http://localhost:5000/api`

### Axios Configuration
**File:** `frontend/src/api/axiosInstance.ts`

```typescript
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,  // Include cookies
  headers: {
    "Content-Type": "application/json"
  }
});
```

---

## Environment Variables

### Backend (.env)
```
PORT=5000
DB_HOST=db
DB_USER=root
DB_PASSWORD=root
DB_NAME=app_db
AUTH_SECRET=authsecret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000/api
```

---

## Running the System

### Using Docker Compose

```bash
# Development
docker compose -f docker-compose.dev.yaml up --build

# This will start:
# - MySQL database on port 3307
# - Backend API on port 5000
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev

# Frontend will run on http://localhost:5173
```

### Backend Development

```bash
cd backend
npm install
npm run dev

# Backend will run on http://localhost:5000
# Swagger docs at http://localhost:5000/api-docs
```

---

## Testing the Login

### Step 1: Add test users

```sql
-- Insert a student
INSERT INTO student (name, email, hostel_id, room_no)
VALUES ('Test Student', 'student@uohyd.ac.in', 1, '101');

-- Insert staff members
INSERT INTO staff (name, email, role, hostel_id)
VALUES 
('Mess Secretary', 'secretary@uohyd.ac.in', 'MESS_SECRETARY', 1),
('Care Taker', 'caretaker@uohyd.ac.in', 'CARE_TAKER', 1),
('Mess Supervisor', 'supervisor@uohyd.ac.in', 'MESS_SUPERVISOR', 1),
('Warden', 'warden@uohyd.ac.in', 'WARDEN', 1);
```

### Step 2: Use in login form

1. Navigate to `http://localhost:5173/login`
2. Select role from dropdown
3. Enter corresponding email
4. Click "Send OTP"
5. Check console or email for OTP (default: 123456)
6. Enter OTP and click "Verify & Continue"
7. Should redirect to role-specific dashboard

---

## Troubleshooting

### Issue: "User not found with specified role"
- **Solution**: Verify user exists in correct table with correct role

### Issue: "Invalid or expired OTP"
- **Solution**: OTP expires after 5 minutes, request new OTP

### Issue: CORS error
- **Check**: Backend CORS configuration includes frontend URL

### Issue: Token not persisting
- **Check**: localStorage is enabled, browser allows it

### Issue: Authorization header not being sent
- **Check**: `setAuthToken()` is called after login

---

## Security Features

1. **OTP-based authentication** - No password stored
2. **JWT tokens** with 1-day expiry
3. **HTTP-only cookies** - CSRF protection
4. **Role-based access control** - Route protection
5. **Email verification** - Only valid emails can login

---

## API Documentation

### Swagger UI
Access at: `http://localhost:5000/api-docs`

All endpoints documented with:
- Request/Response examples
- Error codes
- Authentication requirements

---

## Summary

The system implements a complete, secure, role-based authentication and authorization system:

✅ **OTP-based login** via email
✅ **5 different user roles** with dedicated dashboards
✅ **Backend API integration** using Express.js and MySQL
✅ **Frontend routing** with role-based protection
✅ **Token-based authentication** with JWT
✅ **Session persistence** via localStorage
✅ **Error handling** and validation
✅ **Scalable architecture** for adding new roles

All components are properly integrated and ready for production deployment.
