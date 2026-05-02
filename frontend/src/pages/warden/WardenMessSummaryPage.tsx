/* eslint-disable react-hooks/set-state-in-effect -- mount data loads */
import { useCallback, useEffect, useState } from 'react'
import {
  wardenAllMessActiveCards,
  wardenMessSummary,
} from '../../api/wardenService'
import type { WardenActiveCard, WardenMessSummary } from '../../api/types'
import { Card } from '../../components/Card'
import { EmptyState } from '../../components/EmptyState'
import { ErrorBanner } from '../../components/ErrorBanner'
import { Loader } from '../../components/Loader'
import { Table, type TableColumn } from '../../components/Table'
import { getErrorMessage } from '../../utils/errors'
import styles from './WardenMessSummaryPage.module.css'

export function WardenMessSummaryPage() {
  const [summary, setSummary] = useState<WardenMessSummary | null>(null)
  const [cards, setCards] = useState<WardenActiveCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [s, c] = await Promise.all([
        wardenMessSummary(),
        wardenAllMessActiveCards(),
      ])
      setSummary(s)
      setCards(c)
    } catch (e) {
      setError(getErrorMessage(e, 'Could not load mess overview'))
      setSummary(null)
      setCards([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const columns: TableColumn<WardenActiveCard>[] = [
    { key: 'card_id', label: 'Card' },
    { key: 'student_name', label: 'Student' },
    { key: 'student_email', label: 'Email' },
    { key: 'room_no', label: 'Room' },
    { key: 'status', label: 'Status' },
    { key: 'open_date', label: 'Opened' },
    { key: 'close_date', label: 'Closed' },
  ]

  return (
    <div>
      <h1 className={styles.title}>Mess summary</h1>
      <p className={styles.sub}>
        High-level counts and all active mess cards across hostels.
      </p>

      <ErrorBanner message={error} onDismiss={() => setError(null)} />

      {loading ? (
        <Loader label="Loading summary…" fullPage />
      ) : (
        <>
          <div className={styles.kpis}>
            <Card title="Total students">
              <p className={styles.kpi}>
                {summary?.total_students ?? '—'}
              </p>
            </Card>
            <Card title="Active cards">
              <p className={styles.kpi}>{summary?.active_cards ?? '—'}</p>
            </Card>
            <Card title="Closed cards">
              <p className={styles.kpi}>{summary?.closed_cards ?? '—'}</p>
            </Card>
            <Card title="Total cards">
              <p className={styles.kpi}>{summary?.total_cards ?? '—'}</p>
            </Card>
          </div>

          <Card title="Mess cards">
            {cards.length === 0 ? (
              <EmptyState title="No cards" message="No mess card rows returned." />
            ) : (
              <Table columns={columns} data={cards} />
            )}
          </Card>
        </>
      )}
    </div>
  )
}
