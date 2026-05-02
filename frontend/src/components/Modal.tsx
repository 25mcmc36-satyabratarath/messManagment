import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import styles from './Modal.module.css'

type Props = {
  isOpen: boolean
  title?: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}

export function Modal({ isOpen, title, onClose, children, footer }: Props) {
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div className={styles.backdrop} role="presentation" onClick={onClose}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.header}>
          {title ? <h2 className={styles.title}>{title}</h2> : null}
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </header>
        <div className={styles.content}>{children}</div>
        {footer ? <footer className={styles.footer}>{footer}</footer> : null}
      </div>
    </div>,
    document.body,
  )
}
