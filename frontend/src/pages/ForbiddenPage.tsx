import { Link } from 'react-router-dom'
import { Card } from '../components/Card'
import styles from './ForbiddenPage.module.css'

export function ForbiddenPage() {
  return (
    <div className={styles.wrap}>
      <Card title="Access denied">
        <p className={styles.text}>
          You do not have permission to view this page (403).
        </p>
        <Link className={styles.link} to="/login">
          Back to login
        </Link>
      </Card>
    </div>
  )
}
