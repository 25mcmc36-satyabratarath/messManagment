/* eslint-disable react-hooks/set-state-in-effect -- mount data loads */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { secretarySpecialMeals } from '../../api/messSecretaryService'
import {
  messGetSpecialMealHistory,
  messGetYearlyBill,
  messJoinSpecialMeal,
} from '../../api/messStudentService'
import type {
  SpecialMealCatalogEntry,
  StudentSpecialMealHistoryItem,
  StudentYearlyBill,
} from '../../api/types'
import { Card } from '../../components/Card'
import { EmptyState } from '../../components/EmptyState'
import { ErrorBanner } from '../../components/ErrorBanner'
import { Form, type FormFieldConfig } from '../../components/Form'
import { Loader } from '../../components/Loader'
import { Table, type TableColumn } from '../../components/Table'
import { useToast } from '../../context/ToastContext'
import { getErrorMessage } from '../../utils/errors'
import styles from './StudentSpecialMealsPage.module.css'

const joinFields: FormFieldConfig[] = [
  {
    name: 'special_id',
    label: 'Special meal ID',
    type: 'number',
    required: true,
    min: 1,
    step: 1,
    placeholder: 'Or pick from the table above',
  },
]

/** One page in the month pager (from yearly `monthly_breakdown` or catalog dates). */
type MonthPage = {
  year: number
  month: number
  /** From `get-yearly-bill` monthly_breakdown, or sum of special meal costs in that month */
  billAmount?: number
}

function formatDate(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
}

function money(n: number) {
  return `₹${n.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`
}

function monthYearLabel(month: number, year: number): string {
  return new Date(year, month - 1, 1).toLocaleString(undefined, {
    month: 'long',
    year: 'numeric',
  })
}

/** When yearly bill has no breakdown, derive months from catalog (newest first). */
function monthPagesFromCatalog(
  catalog: SpecialMealCatalogEntry[],
): MonthPage[] {
  const byKey = new Map<
    string,
    { year: number; month: number; sum: number }
  >()
  for (const row of catalog) {
    const d = new Date(row.date)
    if (Number.isNaN(d.getTime())) continue
    const y = d.getFullYear()
    const m = d.getMonth() + 1
    const key = `${y}-${String(m).padStart(2, '0')}`
    const prev = byKey.get(key)
    const cost = Number(row.total_cost ?? 0)
    if (prev) {
      byKey.set(key, {
        year: y,
        month: m,
        sum: prev.sum + (Number.isFinite(cost) ? cost : 0),
      })
    } else {
      byKey.set(key, { year: y, month: m, sum: Number.isFinite(cost) ? cost : 0 })
    }
  }
  return [...byKey.values()]
    .sort((a, b) =>
      b.year !== a.year ? b.year - a.year : b.month - a.month,
    )
    .map(({ year, month, sum }) => ({
      year,
      month,
      billAmount: sum,
    }))
}

function monthPagesFromBreakdown(
  billYear: number,
  breakdown: Array<{ month: number; amount: number }>,
): MonthPage[] {
  return [...breakdown]
    .sort((a, b) => b.month - a.month)
    .map((r) => ({
      year: billYear,
      month: r.month,
      billAmount: r.amount,
    }))
}

export function StudentSpecialMealsPage() {
  const { showToast } = useToast()
  const now = new Date()
  const [billYear, setBillYear] = useState(now.getFullYear())
  const [yearlyBill, setYearlyBill] = useState<StudentYearlyBill | null>(null)
  const [billError, setBillError] = useState<string | null>(null)

  const [catalog, setCatalog] = useState<SpecialMealCatalogEntry[]>([])
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [catalogError, setCatalogError] = useState<string | null>(null)

  const [historyRows, setHistoryRows] = useState<StudentSpecialMealHistoryItem[]>(
    [],
  )
  const [historyLoading, setHistoryLoading] = useState(true)
  const [historyError, setHistoryError] = useState<string | null>(null)

  const [joinBusyId, setJoinBusyId] = useState<number | null>(null)
  const [monthIndex, setMonthIndex] = useState(0)

  const load = useCallback(async () => {
    setCatalogLoading(true)
    setHistoryLoading(true)
    setCatalogError(null)
    setHistoryError(null)
    setBillError(null)

    const [catRes, histRes, billRes] = await Promise.allSettled([
      secretarySpecialMeals(),
      messGetSpecialMealHistory(),
      messGetYearlyBill(billYear),
    ])

    if (catRes.status === 'fulfilled') {
      setCatalog(catRes.value)
    } else {
      setCatalog([])
      setCatalogError(
        getErrorMessage(
          catRes.reason,
          'Could not load special meals list (mess secretary).',
        ),
      )
    }
    setCatalogLoading(false)

    if (histRes.status === 'fulfilled') {
      setHistoryRows(histRes.value)
    } else {
      setHistoryRows([])
      setHistoryError(
        getErrorMessage(histRes.reason, 'Could not load your meal history.'),
      )
    }
    setHistoryLoading(false)

    if (billRes.status === 'fulfilled') {
      setYearlyBill(billRes.value)
    } else {
      setYearlyBill(null)
      setBillError(
        getErrorMessage(
          billRes.reason,
          'Could not load yearly bill (monthly breakdown).',
        ),
      )
    }
  }, [billYear])

  useEffect(() => {
    void load()
  }, [load])

  const monthPages: MonthPage[] = useMemo(() => {
    const breakdown = yearlyBill?.monthly_breakdown ?? []
    if (breakdown.length > 0) {
      return monthPagesFromBreakdown(billYear, breakdown)
    }
    return monthPagesFromCatalog(catalog)
  }, [yearlyBill?.monthly_breakdown, billYear, catalog])

  useEffect(() => {
    setMonthIndex((i) => {
      if (monthPages.length === 0) return 0
      return Math.min(i, monthPages.length - 1)
    })
  }, [monthPages.length, billYear])

  const currentPage = monthPages[monthIndex] ?? null

  const visibleCatalog = useMemo(() => {
    if (!currentPage) return []
    return catalog.filter((row) => {
      const d = new Date(row.date)
      if (Number.isNaN(d.getTime())) return false
      return (
        d.getFullYear() === currentPage.year &&
        d.getMonth() + 1 === currentPage.month
      )
    })
  }, [catalog, currentPage])

  const handleJoinId = async (special_id: number) => {
    setJoinBusyId(special_id)
    try {
      const res = await messJoinSpecialMeal({ special_id })
      if (res.success) {
        showToast(res.message || 'Joined special meal', 'success')
        await load()
      } else {
        showToast(res.message || 'Could not join', 'error')
      }
    } catch (e) {
      showToast(getErrorMessage(e, 'Join failed'), 'error')
    } finally {
      setJoinBusyId(null)
    }
  }

  const handleJoinForm = async (values: Record<string, string>) => {
    await handleJoinId(Number(values.special_id))
  }

  const catalogColumns: TableColumn<SpecialMealCatalogEntry>[] = [
    { key: 'special_id', label: 'ID' },
    { key: 'meal_name', label: 'Meal' },
    {
      key: 'date',
      label: 'Date',
      render: (r) => formatDate(r.date),
    },
    {
      key: 'total_cost',
      label: 'Total cost',
      render: (r) => money(r.total_cost ?? 0),
    },
    { key: 'total_plates', label: 'Plates' },
    { key: 'hostel_id', label: 'Hostel' },
    {
      key: '_join',
      label: '',
      render: (r) => (
        <button
          type="button"
          className={styles.joinBtn}
          disabled={joinBusyId === r.special_id}
          onClick={() => void handleJoinId(r.special_id)}
        >
          {joinBusyId === r.special_id ? 'Joining…' : 'Join'}
        </button>
      ),
    },
  ]

  const historyColumns: TableColumn<StudentSpecialMealHistoryItem>[] = [
    { key: 'id', label: 'ID' },
    { key: 'meal_name', label: 'Meal' },
    { key: 'date', label: 'Date' },
    {
      key: 'cost',
      label: 'Cost',
      render: (r) =>
        `₹${Number(r.cost ?? 0).toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })}`,
    },
    { key: 'status', label: 'Status' },
  ]

  const totalPages = monthPages.length
  const canPrev = monthIndex > 0
  const canNext = monthIndex < totalPages - 1

  return (
    <div>
      <h1 className={styles.title}>Special meals</h1>
      <p className={styles.sub}>
        Browse specials by month using your yearly bill&apos;s monthly
        breakdown; if that is unavailable, months are taken from meal dates.
      </p>

      <Card title="Special meals (catalog)">
        <p className={styles.hint}>
          Meals published for the mess. Use Join to register; your student
          account must be allowed to view this list.
        </p>
        <ErrorBanner
          message={catalogError}
          onDismiss={() => setCatalogError(null)}
        />
        <ErrorBanner message={billError} onDismiss={() => setBillError(null)} />

        <div className={styles.billBar}>
          <label className={styles.billLabel}>
            Bill year (monthly breakdown)
            <input
              className={styles.billInput}
              type="number"
              min={2000}
              max={2100}
              value={billYear}
              onChange={(e) => {
                setBillYear(Number(e.target.value))
                setMonthIndex(0)
              }}
            />
          </label>
        </div>

        {catalogLoading ? (
          <Loader label="Loading specials…" />
        ) : totalPages === 0 ? (
          <EmptyState
            title="No months to show"
            message={
              catalogError || billError
                ? 'Fix the errors above or try another bill year.'
                : 'Your yearly bill has no monthly breakdown yet, and no meal dates were found. Add data or pick another year.'
            }
          />
        ) : (
          <>
            <div className={styles.pagination} role="navigation" aria-label="Month">
              <button
                type="button"
                className={styles.pageBtn}
                disabled={!canPrev}
                onClick={() => setMonthIndex((i) => i - 1)}
              >
                Previous month
              </button>
              <div className={styles.pageInfo}>
                <span className={styles.pageTitle}>
                  {currentPage
                    ? monthYearLabel(currentPage.month, currentPage.year)
                    : '—'}
                </span>
                <span className={styles.pageMeta}>
                  {monthIndex + 1} / {totalPages}
                  {currentPage?.billAmount != null ? (
                    <>
                      {' · '}
                      Bill month: {money(currentPage.billAmount)}
                    </>
                  ) : null}
                </span>
              </div>
              <button
                type="button"
                className={styles.pageBtn}
                disabled={!canNext}
                onClick={() => setMonthIndex((i) => i + 1)}
              >
                Next month
              </button>
            </div>

            {visibleCatalog.length === 0 ? (
              <EmptyState
                title="No specials this month"
                message="No catalog rows match this month. Try another month or check the secretary list."
              />
            ) : (
              <div className={styles.tableWrap}>
                <Table columns={catalogColumns} data={visibleCatalog} />
              </div>
            )}
          </>
        )}
      </Card>

      <div className={styles.split}>
        <Card title="Join by ID">
          <Form
            id="join-special"
            fields={joinFields}
            onSubmit={handleJoinForm}
            submitLabel="Join"
            disabled={joinBusyId != null}
          />
        </Card>
        <Card title="Your history">
          <ErrorBanner
            message={historyError}
            onDismiss={() => setHistoryError(null)}
          />
          {historyLoading ? (
            <Loader label="Loading history…" />
          ) : historyRows.length === 0 ? (
            <EmptyState title="No history yet" />
          ) : (
            <Table columns={historyColumns} data={historyRows} />
          )}
        </Card>
      </div>
    </div>
  )
}
