/* eslint-disable react-hooks/set-state-in-effect -- mount data loads */
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  messCloseMessCard,
  messGetCardView,
  messOpenMessCard,
} from '../../api/messStudentService'
import type { MessCardInterval, StudentMessCardView } from '../../api/types'
import { Card } from '../../components/Card'
import { EmptyState } from '../../components/EmptyState'
import { ErrorBanner } from '../../components/ErrorBanner'
import { Loader } from '../../components/Loader'
import { Table, type TableColumn } from '../../components/Table'
import { useToast } from '../../context/ToastContext'
import { getErrorMessage } from '../../utils/errors'
import styles from './StudentMessCardPage.module.css'

const intervalColumns: TableColumn<MessCardInterval>[] = [
  { key: 'student_id', label: 'Student ID' },
  { key: 'open_date', label: 'Open' },
  {
    key: 'close_date',
    label: 'Close',
    render: (r) => r.close_date ?? '—',
  },
  { key: 'days', label: 'Days' },
]

function formatMoney(n: number | undefined): string {
  if (n == null || Number.isNaN(n)) return '—'
  return `₹${n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function StudentMessCardPage() {
  const { showToast } = useToast()
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [data, setData] = useState<StudentMessCardView | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cardBusy, setCardBusy] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const card = await messGetCardView({ month, year })
      setData(card)
    } catch (e) {
      setError(getErrorMessage(e, 'Could not load mess card'))
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [month, year])

  useEffect(() => {
    void load()
  }, [load])

  const periodLabel = useMemo(() => {
    if (!data) return ''
    const m = String(data.month).padStart(2, '0')
    return `${m} / ${data.year}`
  }, [data])

  const hasOverview =
    data != null &&
    (data.card_id != null ||
      data.student_id != null ||
      data.active_days != null ||
      data.special_meals != null ||
      data.subscriptions != null ||
      data.total_amount != null)

  const handleOpenCard = async () => {
    setCardBusy(true)
    try {
      const r = await messOpenMessCard()
      if (r.success) {
        showToast(r.message || 'Mess card opened', 'success')
        await load()
      } else {
        showToast(r.message || 'Could not open card', 'error')
      }
    } catch (e) {
      showToast(getErrorMessage(e, 'Open card failed'), 'error')
    } finally {
      setCardBusy(false)
    }
  }

  const handleCloseCard = async () => {
    const ok = window.confirm(
      'Close your current mess card? You can open a new one later if allowed.',
    )
    if (!ok) return
    setCardBusy(true)
    try {
      const r = await messCloseMessCard()
      if (r.success) {
        showToast(r.message || 'Mess card closed', 'success')
        await load()
      } else {
        showToast(r.message || 'Could not close card', 'error')
      }
    } catch (e) {
      showToast(getErrorMessage(e, 'Close card failed'), 'error')
    } finally {
      setCardBusy(false)
    }
  }

  return (
    <div>
      <h1 className={styles.title}>Mess card</h1>
      <p className={styles.sub}>
        Monthly view (OpenAPI), interval details when returned, and open/close
        card actions.
      </p>

      <div className={styles.toolbar}>
        <label className={styles.field}>
          <span>Month</span>
          <select
            className={styles.select}
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {new Date(2000, m - 1, 1).toLocaleString(undefined, {
                  month: 'long',
                })}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span>Year</span>
          <input
            className={styles.select}
            type="number"
            min={2000}
            max={2100}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />
        </label>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primary}
            disabled={cardBusy}
            onClick={() => void handleOpenCard()}
          >
            Open mess card
          </button>
          <button
            type="button"
            className={styles.danger}
            disabled={cardBusy}
            onClick={() => void handleCloseCard()}
          >
            Close mess card
          </button>
        </div>
      </div>

      <ErrorBanner message={error} onDismiss={() => setError(null)} />

      {loading ? (
        <Loader label="Loading mess card…" />
      ) : !data ? (
        <EmptyState
          title="No mess card"
          message="No data returned for this period. Pick another month or open a mess card."
        />
      ) : (
        <div className={styles.stack}>
          <p className={styles.period}>
            Period: <strong>{periodLabel}</strong>
          </p>

          {hasOverview ? (
            <Card title="Mess overview">
              <dl className={styles.dl}>
                {data.card_id != null ? (
                  <div>
                    <dt>Card ID</dt>
                    <dd>{data.card_id}</dd>
                  </div>
                ) : null}
                {data.student_id != null ? (
                  <div>
                    <dt>Student ID</dt>
                    <dd>{data.student_id}</dd>
                  </div>
                ) : null}
                {data.active_days != null ? (
                  <div>
                    <dt>Active days</dt>
                    <dd>{data.active_days}</dd>
                  </div>
                ) : null}
                {data.special_meals != null ? (
                  <div>
                    <dt>Special meals</dt>
                    <dd>{data.special_meals}</dd>
                  </div>
                ) : null}
                {data.subscriptions != null ? (
                  <div>
                    <dt>Subscriptions</dt>
                    <dd>{data.subscriptions}</dd>
                  </div>
                ) : null}
                {data.total_amount != null ? (
                  <div>
                    <dt>Total amount</dt>
                    <dd>{formatMoney(data.total_amount)}</dd>
                  </div>
                ) : null}
              </dl>
            </Card>
          ) : null}

          {data.summary ? (
            <Card title="Interval summary">
              <dl className={styles.dl}>
                <div>
                  <dt>Total active days</dt>
                  <dd>{data.summary.total_active_days}</dd>
                </div>
                <div>
                  <dt>Open intervals</dt>
                  <dd>{data.summary.total_open_intervals}</dd>
                </div>
              </dl>
            </Card>
          ) : null}

          <Card title="Intervals">
            {data.intervals.length === 0 ? (
              <p className={styles.muted}>
                No interval rows for this month (API may only return overview
                fields).
              </p>
            ) : (
              <Table columns={intervalColumns} data={data.intervals} />
            )}
          </Card>
        </div>
      )}
    </div>
  )
}
