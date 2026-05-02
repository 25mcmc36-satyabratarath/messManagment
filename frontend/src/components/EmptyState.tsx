import styles from './EmptyState.module.css'

type Props = {
  title: string
  message?: string
}

export function EmptyState({ title, message }: Props) {
  return (
    <div className={styles.wrap}>
      <div className={styles.icon} aria-hidden>
        <svg viewBox="0 0 48 48" width="48" height="48" fill="none">
          <path
            d="M14 22h20M14 30h12M10 8h28a2 2 0 012 2v28a2 2 0 01-2 2H10a2 2 0 01-2-2V10a2 2 0 012-2z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <h3 className={styles.title}>{title}</h3>
      {message ? <p className={styles.message}>{message}</p> : null}
    </div>
  )
}
