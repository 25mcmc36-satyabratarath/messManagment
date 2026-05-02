import { Navigate, Route, Routes } from 'react-router-dom'
import { DashboardLayout } from './layouts/DashboardLayout'
import { CaretakerExpensePage } from './pages/caretaker/CaretakerExpensePage'
import { CaretakerStudentsPage } from './pages/caretaker/CaretakerStudentsPage'
import { ForbiddenPage } from './pages/ForbiddenPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { SecretaryOverviewPage } from './pages/secretary/SecretaryOverviewPage'
import { SecretaryRationPage } from './pages/secretary/SecretaryRationPage'
import { SecretarySpecialsPage } from './pages/secretary/SecretarySpecialsPage'
import { SecretaryWeeklyExpensePage } from './pages/secretary/SecretaryWeeklyExpensePage'
import { StudentBillsPage } from './pages/student/StudentBillsPage'
import { StudentFeedbackPage } from './pages/student/StudentFeedbackPage'
import { StudentMessCardPage } from './pages/student/StudentMessCardPage'
import { StudentSpecialMealsPage } from './pages/student/StudentSpecialMealsPage'
import { StudentSubscriptionsPage } from './pages/student/StudentSubscriptionsPage'
import { SupervisorConsumptionPage } from './pages/supervisor/SupervisorConsumptionPage'
import { SupervisorRationItemsPage } from './pages/supervisor/SupervisorRationItemsPage'
import { WardenMessSummaryPage } from './pages/warden/WardenMessSummaryPage'
import { WardenStaffPage } from './pages/warden/WardenStaffPage'
import { DashboardIndexRedirect } from './routes/DashboardIndexRedirect'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { RoleRoute } from './routes/RoleRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forbidden" element={<ForbiddenPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardIndexRedirect />} />

          <Route
            path="student"
            element={<RoleRoute allowed={['STUDENT']} />}
          >
            <Route
              index
              element={<Navigate to="mess-card" replace />}
            />
            <Route path="mess-card" element={<StudentMessCardPage />} />
            <Route path="bills" element={<StudentBillsPage />} />
            <Route path="feedback" element={<StudentFeedbackPage />} />
            <Route path="special-meals" element={<StudentSpecialMealsPage />} />
            <Route
              path="subscriptions"
              element={<StudentSubscriptionsPage />}
            />
          </Route>

          <Route
            path="caretaker"
            element={<RoleRoute allowed={['CARE_TAKER']} />}
          >
            <Route
              index
              element={<Navigate to="students" replace />}
            />
            <Route path="students" element={<CaretakerStudentsPage />} />
            <Route path="expenses" element={<CaretakerExpensePage />} />
          </Route>

          <Route
            path="secretary"
            element={<RoleRoute allowed={['MESS_SECRETARY']} />}
          >
            <Route
              index
              element={<Navigate to="overview" replace />}
            />
            <Route path="overview" element={<SecretaryOverviewPage />} />
            <Route path="ration" element={<SecretaryRationPage />} />
            <Route path="special-meals" element={<SecretarySpecialsPage />} />
            <Route
              path="weekly-expense"
              element={<SecretaryWeeklyExpensePage />}
            />
          </Route>

          <Route
            path="supervisor"
            element={<RoleRoute allowed={['MESS_SUPERVISOR']} />}
          >
            <Route
              index
              element={<Navigate to="ration-items" replace />}
            />
            <Route
              path="ration-items"
              element={<SupervisorRationItemsPage />}
            />
            <Route
              path="consumption"
              element={<SupervisorConsumptionPage />}
            />
          </Route>

          <Route path="warden" element={<RoleRoute allowed={['WARDEN']} />}>
            <Route index element={<Navigate to="staff" replace />} />
            <Route path="staff" element={<WardenStaffPage />} />
            <Route path="mess-summary" element={<WardenMessSummaryPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
