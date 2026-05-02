import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './HomePage.module.css'

const UOH_LOGO_SRC = '/uoh-logo.png'

const WIKIMEDIA_LOGO_SOURCE =
  'https://upload.wikimedia.org/wikipedia/ta/9/9e/University_of_Hyderabad_Logo.png'

const features = [
  {
    title: 'Students',
    text: 'Mess cards, bills, feedback, subscriptions, and special meals in one place.',
    icon: 'card',
  },
  {
    title: 'Mess office',
    text: 'Secretary tools for cards, ration, weekly spend, and special meal polls.',
    icon: 'chart',
  },
  {
    title: 'Supervisor & caretaker',
    text: 'Ration items, consumption logs, student intake, and daily hostel expenses.',
    icon: 'clipboard',
  },
  {
    title: 'Warden',
    text: 'Staff visibility and mess summaries across your hostel.',
    icon: 'shield',
  },
] as const

const team = [
  {
    name: 'Adarsh Kumar Pandey',
    regNo: '25MCMC29',
    vibe: 'Debugs mess bills before breakfast.',
  },
  {
    name: 'Ajit Tiwari',
    regNo: '25MCMC39',
    vibe: 'Thali enjoyer · deploy on green.',
  },
  {
    name: 'Aditi Mitra',
    regNo: '25MCMC40',
    vibe: 'UI sparkle · no soggy sambar.',
  },
  {
    name: 'Satya',
    regNo: '25MCMC36',
    vibe: 'Logs errors · never the extra rice.',
  },
] as const

function Icon({ name }: { name: (typeof features)[number]['icon'] }) {
  const common = { className: styles.featureIconSvg, viewBox: '0 0 48 48', fill: 'none' as const }
  switch (name) {
    case 'card':
      return (
        <svg {...common} aria-hidden>
          <rect x="8" y="12" width="32" height="24" rx="3" stroke="currentColor" strokeWidth="2" />
          <path d="M8 20h32" stroke="currentColor" strokeWidth="2" />
          <circle cx="16" cy="28" r="2" fill="currentColor" />
        </svg>
      )
    case 'chart':
      return (
        <svg {...common} aria-hidden>
          <path d="M10 38V18l8 10 8-14 8 8 6-6v22H10z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      )
    case 'clipboard':
      return (
        <svg {...common} aria-hidden>
          <path d="M16 8h16v4H16V8zm-4 4h24v28H12V12z" stroke="currentColor" strokeWidth="2" />
          <path d="M18 22h12M18 28h12M18 34h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    case 'shield':
      return (
        <svg {...common} aria-hidden>
          <path d="M24 6l14 6v12c0 10-6 16-14 20-8-4-14-10-14-20V12l14-6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M18 24l4 4 8-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    default:
      return null
  }
}

export function HomePage() {
  const { isAuthenticated } = useAuth()

  return (
    <div className={styles.page}>
      <header className={styles.nav}>
        <span className={styles.logo}>Mess Management</span>
        <div className={styles.navActions}>
          {isAuthenticated ? (
            <Link className={styles.navLink} to="/dashboard">
              Dashboard
            </Link>
          ) : null}
          <Link className={styles.navBtn} to="/login">
            Sign in
          </Link>
        </div>
      </header>

      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Hostel dining</p>
          <h1 id="hero-title" className={styles.headline}>
            Run the mess with clarity
          </h1>
          <p className={styles.lead}>
            Cards, expenses, ration, and staff workflows in one place for your campus
            hostels.
          </p>
          <div className={styles.heroCtas}>
            <Link className={styles.primaryCta} to="/login">
              {isAuthenticated ? 'Switch account' : 'Sign in with email'}
            </Link>
            {isAuthenticated ? (
              <Link className={styles.secondaryCta} to="/dashboard">
                Open dashboard
              </Link>
            ) : (
              <span className={styles.secondaryHint}>
                OTP verification · Role-based access
              </span>
            )}
          </div>
        </div>
      </section>

      <section className={styles.team} aria-labelledby="team-title">
        <div className={styles.builtBy} aria-label="Project credits">
          <img
            className={styles.builtByLogo}
            src={UOH_LOGO_SRC}
            alt="University of Hyderabad"
            width={72}
            height={72}
            decoding="async"
          />
          <div className={styles.builtByText}>
            <p className={styles.builtByTitle}>Built by MCA</p>
            <p className={styles.builtBySub}>
              University of Hyderabad · Batch 2025–27
            </p>
          </div>
        </div>

        <div className={styles.sectionHead}>
          <h2 id="team-title" className={styles.sectionTitle}>
            Team
          </h2>
          <p className={styles.sectionSub}>
            We ship features between meals.
          </p>
        </div>
        <ul className={styles.teamGrid}>
          {team.map((member, i) => (
            <li
              key={member.regNo}
              className={`${styles.teamCard} ${i % 2 === 0 ? styles.teamCardTiltL : styles.teamCardTiltR}`}
            >
              <div className={styles.teamCardInner}>
                <h3 className={styles.teamName}>{member.name}</h3>
                <p className={styles.teamReg}>Reg. No. {member.regNo}</p>
                <p className={styles.teamVibe}>{member.vibe}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.features} aria-labelledby="features-title">
        <div className={styles.sectionHead}>
          <h2 id="features-title" className={styles.sectionTitle}>
            Built for every role
          </h2>
          <p className={styles.sectionSub}>
            From students to wardens—each view shows only what matters.
          </p>
        </div>
        <ul className={styles.featureGrid}>
          {features.map((f) => (
            <li key={f.title} className={styles.featureCard}>
              <div className={styles.featureIcon} aria-hidden>
                <Icon name={f.icon} />
              </div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureText}>{f.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.strip}>
        <div className={styles.stripInner}>
          <p className={styles.stripText}>
            Ready to manage meals and expenses without spreadsheet chaos?
          </p>
          <Link className={styles.stripCta} to="/login">
            Get started
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <p className={styles.footerNote}>
          Mess Management · Secure sign-in
        </p>
        <p className={styles.footerAttr}>
          University of Hyderabad logo:{' '}
          <a href={WIKIMEDIA_LOGO_SOURCE} target="_blank" rel="noreferrer">
            Wikimedia
          </a>
        </p>
      </footer>
    </div>
  )
}
