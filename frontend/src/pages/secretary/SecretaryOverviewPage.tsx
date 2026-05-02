/* eslint-disable react-hooks/set-state-in-effect -- mount data loads */
import { useCallback, useEffect, useState } from 'react'
import {
  secretaryActiveCardsByDate,
  secretaryNetCard,
} from '../../api/messSecretaryService'
import type { SecretaryActiveCardsByDate, SecretaryNetCard } from '../../api/types'
import { Card } from '../../components/Card'
import { ErrorBanner } from '../../components/ErrorBanner'
import { Loader } from '../../components/Loader'
import { getErrorMessage } from '../../utils/errors'
import styles from './SecretaryOverviewPage.module.css'

function todayISO(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function SecretaryOverviewPage() {
  const [net, setNet] = useState<SecretaryNetCard | null>(null)
  const [netLoading, setNetLoading] = useState(true)
  const [netError, setNetError] = useState<string | null>(null)

  const [date, setDate] = useState(todayISO)
  const [byDate, setByDate] = useState<SecretaryActiveCardsByDate | null>(null)
  const [dateLoading, setDateLoading] = useState(true)
  const [dateError, setDateError] = useState<string | null>(null)

  const loadNet = useCallback(async () => {
    setNetLoading(true)
    setNetError(null)
    try {
      const n = await secretaryNetCard()
      setNet(n)
    } catch (e) {
      setNetError(getErrorMessage(e, 'Could not load net card status'))
      setNet(null)
    } finally {
      setNetLoading(false)
    }
  }, [])

  const loadByDate = useCallback(async () => {
    setDateLoading(true)
    setDateError(null)
    try {
      const r = await secretaryActiveCardsByDate(date)
      setByDate(r)
    } catch (e) {
      setDateError(getErrorMessage(e, 'Could not load active cards for date'))
      setByDate(null)
    } finally {
      setDateLoading(false)
    }
  }, [date])

  useEffect(() => {
    void loadNet()
  }, [loadNet])

  useEffect(() => {
    void loadByDate()
  }, [loadByDate])

  return (
    <div>
      <h1 className={styles.title}>Net card & active cards</h1>
      <p className={styles.sub}>
        Overall mess card counts and active cards for a selected date.
      </p>

      <div className={styles.grid}>
        <Card title="Net card status">
          <ErrorBanner message={netError} onDismiss={() => setNetError(null)} />
          {netLoading ? (
            <Loader label="Loading net card…" />
          ) : !net ? (
            <p className={styles.muted}>No summary available.</p>
          ) : (
            <dl className={styles.stats}>
              <div>
                <dt>Total cards</dt>
                <dd>{net.total_cards ?? 0}</dd>
              </div>
              <div>
                <dt>Open</dt>
                <dd>{net.open_cards ?? 0}</dd>
              </div>
              <div>
                <dt>Closed</dt>
                <dd>{net.closed_cards ?? 0}</dd>
              </div>
            </dl>
          )}
        </Card>

        <Card title="Active cards by date">
          <div className={styles.row}>
            <label className={styles.label}>
              Date
              <input
                type="date"
                className={styles.input}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
            <button
              type="button"
              className={styles.refresh}
              onClick={() => void loadByDate()}
            >
              Refresh
            </button>
          </div>
          <ErrorBanner message={dateError} onDismiss={() => setDateError(null)} />
          {dateLoading ? (
            <Loader label="Loading date summary…" />
          ) : (
            <dl className={styles.stats}>
              <div>
                <dt>Date</dt>
                <dd>{byDate?.date ?? date}</dd>
              </div>
              <div>
                <dt>Total cards</dt>
                <dd>{byDate?.total_cards ?? '—'}</dd>
              </div>
              <div>
                <dt>Active cards</dt>
                <dd>{byDate?.active_cards ?? '—'}</dd>
              </div>
            </dl>
          )}
        </Card>
      </div>
    </div>
  )
}
