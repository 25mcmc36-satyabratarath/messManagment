import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../api/types'
import styles from './DashboardLayout.module.css'

const NAV: Record<
  UserRole,
  { to: string; label: string }[]
> = {
  STUDENT: [
    { to: '/dashboard/student/mess-card', label: 'Mess card' },
    { to: '/dashboard/student/bills', label: 'Bills' },
    { to: '/dashboard/student/feedback', label: 'Feedback' },
    { to: '/dashboard/student/special-meals', label: 'Special meals' },
    { to: '/dashboard/student/subscriptions', label: 'Subscriptions' },
  ],
  CARE_TAKER: [
    { to: '/dashboard/caretaker/students', label: 'Students' },
    { to: '/dashboard/caretaker/expenses', label: 'Daily expenses' },
  ],
  MESS_SECRETARY: [
    { to: '/dashboard/secretary/overview', label: 'Net card & active' },
    { to: '/dashboard/secretary/ration', label: 'Ration' },
    { to: '/dashboard/secretary/special-meals', label: 'Special meals' },
    { to: '/dashboard/secretary/weekly-expense', label: 'Weekly expense' },
  ],
  MESS_SUPERVISOR: [
    { to: '/dashboard/supervisor/ration-items', label: 'Ration items' },
    { to: '/dashboard/supervisor/consumption', label: 'Consumption' },
  ],
  WARDEN: [
    { to: '/dashboard/warden/staff', label: 'Staff' },
    { to: '/dashboard/warden/mess-summary', label: 'Mess summary' },
  ],
}

function roleLabel(role: UserRole): string {
  switch (role) {
    case 'MESS_SECRETARY':
      return 'Mess secretary'
    case 'CARE_TAKER':
      return 'Care taker'
    case 'MESS_SUPERVISOR':
      return 'Mess supervisor'
    default:
      return role.replace(/_/g, ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase())
  }
}

export function DashboardLayout() {
  const { user, role, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = role ? NAV[role] ?? [] : []

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className={styles.shell}>
      <button
        type="button"
        className={styles.menuBtn}
        aria-expanded={menuOpen}
        aria-controls="sidebar-nav"
        onClick={() => setMenuOpen((o) => !o)}
      >
        Menu
      </button>

      <aside
        id="sidebar-nav"
        className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ''}`}
      >
        <div className={styles.brand}>
          <span className={styles.brandTitle}>Mess Management</span>
          <span className={styles.brandSub}>Hostel</span>
        </div>
        <nav className={styles.nav} aria-label="Dashboard">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                isActive ? styles.navLinkActive : styles.navLink
              }
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {menuOpen ? (
        <button
          type="button"
          className={styles.scrim}
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      <div className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.userBlock}>
            <span className={styles.userName}>{user?.name ?? 'User'}</span>
            {role ? (
              <span className={styles.badge}>{roleLabel(role)}</span>
            ) : null}
          </div>
          <button type="button" className={styles.logout} onClick={handleLogout}>
            Log out
          </button>
        </header>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
