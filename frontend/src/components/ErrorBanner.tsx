import styles from './ErrorBanner.module.css'

type Props = {
  message: string | null
  onDismiss?: () => void
}

export function ErrorBanner({ message, onDismiss }: Props) {
  if (!message) return null
  return (
    <div className={styles.banner} role="alert">
      <span className={styles.text}>{message}</span>
      {onDismiss ? (
        <button type="button" className={styles.dismiss} onClick={onDismiss}>
          Dismiss
        </button>
      ) : null}
    </div>
  )
}
