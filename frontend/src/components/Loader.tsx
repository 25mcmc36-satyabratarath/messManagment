import styles from './Loader.module.css'

type Props = {
  label?: string
  fullPage?: boolean
}

export function Loader({ label = 'Loading…', fullPage }: Props) {
  return (
    <div
      className={fullPage ? styles.fullPage : styles.inline}
      role="status"
      aria-live="polite"
    >
      <span className={styles.spinner} aria-hidden />
      <span className={styles.label}>{label}</span>
    </div>
  )
}
