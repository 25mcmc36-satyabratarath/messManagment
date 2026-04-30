# Backend API Integration - Quick Reference

## 🔐 Authentication System

### Login Workflow
```
User Selects Role + Enters Email
    ↓
POST /api/users/send-otp → Get Temp Token
    ↓
User Receives OTP Email
    ↓
User Enters OTP
    ↓
POST /api/users/verify-otp → Get Auth Token
    ↓
Redirect to Dashboard
```

---

## 📁 Key Files Structure

### Backend API Routes
```
backend/
├── routes/
│   └── user.route.js          [Auth endpoints & Swagger docs]
├── controller/
│   └── user.controller.js      [Login logic & role validation]
├── db/
│   ├── db.init.js             [Database schema]
│   └── user.query.js          [SQL queries]
└── utils/
    ├── otp.js                 [OTP generation/verification]
    └── mailer.js              [Email sending]
```

### Frontend Auth Implementation
```
frontend/src/
├── api/
│   ├── auth.ts                [API calls: sendOtp, verifyOtp, logout]
│   ├── axiosInstance.ts       [Axios config & auth headers]
│   └── types.ts               [UserRole type definition]
├── contextAPI/
│   ├── AuthContext.tsx        [Auth context interface]
│   └── AuthProvider.tsx       [State management & persistence]
├── components/
│   ├── LoginForm/             [Login UI & flow]
│   └── ProtectedRoute.tsx     [Route protection]
├── pages/
│   ├── Dashboard/             [Student dashboard]
│   ├── WardenDashboard/       [Warden dashboard]
│   ├── MessSecretaryDashboard/[Mess secretary dashboard]
│   ├── CareTakerDashboard/    [Care taker dashboard]
│   └── MessSupervisorDashboard/[Mess supervisor dashboard]
└── App.tsx                    [Route configuration]
```

---

## 🔄 API Endpoints

### Send OTP
```
POST /api/users/send-otp
Body: { email: string, role: "STUDENT"|"MESS_SECRETARY"|"CARE_TAKER"|"MESS_SUPERVISOR"|"WARDEN" }
Response: { message, token, role }
```

### Verify OTP
```
POST /api/users/verify-otp
Body: { otp: string, token: string, role: string }
Response: { message, token, role, user: {...} }
```

### Logout
```
POST /api/users/logout
Response: { message }
```

---

## 🛂 Role-Based Routes

| Route | Role | Component |
|-------|------|-----------|
| /dashboard | STUDENT | Dashboard.tsx |
| /warden | WARDEN | WardenDashboard.tsx |
| /mess-secretary | MESS_SECRETARY | MessSecretaryDashboard.tsx |
| /care-taker | CARE_TAKER | CareTakerDashboard.tsx |
| /mess-supervisor | MESS_SUPERVISOR | MessSupervisorDashboard.tsx |

---

## 🔑 User Role Types

```typescript
type UserRole = 
  | "STUDENT"
  | "MESS_SECRETARY"
  | "CARE_TAKER"
  | "MESS_SUPERVISOR"
  | "WARDEN"
  | null;
```

**Students** are stored in `student` table
**Staff** (all other roles) are stored in `staff` table with `role` column

---

## 💾 Database User Lookup

### For STUDENT role:
```sql
SELECT * FROM student WHERE email = ?
```

### For Staff roles (MESS_SECRETARY, CARE_TAKER, MESS_SUPERVISOR, WARDEN):
```sql
SELECT * FROM staff WHERE email = ? AND role = ?
```

---

## 🔐 Authentication Flow Code

### Backend (user.controller.js)
```javascript
// Finds user by role
async function findUserByRole(email, role) {
  if (role === "STUDENT") {
    const [rows] = await pool.query(queries.getStudentByEmail, [email]);
    return rows[0] ? { user: rows[0], role: "STUDENT", id: rows[0].student_id } : null;
  } else {
    const [rows] = await pool.query(queries.getStaffByEmail, [email]);
    return rows[0]?.role === role ? { user: rows[0], role, id: rows[0].staff_id } : null;
  }
}

// JWT Token Creation
const authToken = jwt.sign(
  { id, email: user.email, role },
  AUTH_SECRET,
  { expiresIn: "1d" }
);
```

### Frontend (LoginForm.tsx)
```typescript
// Send OTP
const response = await sendOtp(email, role);
setTempToken(response.data.token);

// Verify OTP
const response = await verifyOtp(otp, tempToken, role);
await login({ token: response.data.token, role: response.data.role, user: response.data.user });

// Navigate to dashboard
if (verifiedRole === "WARDEN") navigate("/warden");
else if (verifiedRole === "MESS_SECRETARY") navigate("/mess-secretary");
// ... etc
```

---

## 📊 Session Persistence

```typescript
// AuthProvider.tsx
const storageKey = "messAuth";

// On load: retrieve from localStorage
const saved = localStorage.getItem(storageKey);
if (saved) setToken(parsed.token);

// On login: save to localStorage
localStorage.setItem(storageKey, JSON.stringify(authData));

// On logout: clear localStorage
localStorage.removeItem(storageKey);
```

---

## 🔗 Axios Configuration

```typescript
// axiosInstance.ts
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" }
});

// Set auth header after login
export const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
};
```

---

## 🧪 Test Users SQL

```sql
-- Student
INSERT INTO student (name, email, hostel_id, room_no)
VALUES ('Test Student', 'student@uohyd.ac.in', 1, '101');

-- Mess Secretary
INSERT INTO staff (name, email, role, hostel_id)
VALUES ('Mess Secretary', 'secretary@uohyd.ac.in', 'MESS_SECRETARY', 1);

-- Care Taker
INSERT INTO staff (name, email, role, hostel_id)
VALUES ('Care Taker', 'caretaker@uohyd.ac.in', 'CARE_TAKER', 1);

-- Mess Supervisor
INSERT INTO staff (name, email, role, hostel_id)
VALUES ('Mess Supervisor', 'supervisor@uohyd.ac.in', 'MESS_SUPERVISOR', 1);

-- Warden
INSERT INTO staff (name, email, role, hostel_id)
VALUES ('Warden', 'warden@uohyd.ac.in', 'WARDEN', 1);
```

---

## 🚀 Starting the System

```bash
# Backend + Database (Docker)
docker compose -f docker-compose.dev.yaml up --build

# Frontend
cd frontend && npm run dev

# Access
Backend API: http://localhost:5000
Frontend: http://localhost:5173
Swagger Docs: http://localhost:5000/api-docs
```

---

## 🐛 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "User not found" | User doesn't exist in DB | Insert test user with INSERT statement |
| "Invalid OTP" | OTP expired or wrong | Request new OTP (expires in 5 min) |
| CORS error | Frontend URL not in CORS whitelist | Check backend CORS config |
| Token not sent | Auth header not set | Verify `setAuthToken()` called after login |
| Role mismatch | Email in wrong table | Student in `student` table, staff in `staff` table |

---

## ✅ Verification Checklist

- [x] Backend API accepts all 5 roles
- [x] Frontend LoginForm shows all 5 roles
- [x] AuthContext stores all role types
- [x] Protected routes check allowedRoles
- [x] Each role has its own dashboard
- [x] Navigation routes to correct dashboard
- [x] Session persists on page refresh
- [x] Token in Authorization header
- [x] Database schema supports multiple staff roles
- [x] Swagger documentation updated
