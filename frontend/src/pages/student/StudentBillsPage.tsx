/* eslint-disable react-hooks/set-state-in-effect -- mount data loads */
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  messGetMonthlyBill,
  messGetYearlyBill,
} from '../../api/messStudentService'
import type { StudentMonthlyBillRow, StudentYearlyBill } from '../../api/types'
import { Card } from '../../components/Card'
import { EmptyState } from '../../components/EmptyState'
import { ErrorBanner } from '../../components/ErrorBanner'
import { Loader } from '../../components/Loader'
import { Table, type TableColumn } from '../../components/Table'
import { getErrorMessage } from '../../utils/errors'
import styles from './StudentBillsPage.module.css'

function money(n: number) {
  return `₹${n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

const monthlyCols: TableColumn<StudentMonthlyBillRow>[] = [
  {
    key: 'bill_id',
    label: 'Bill ID',
    render: (r) => String(r.bill_id ?? r.id ?? '—'),
  },
  {
    key: 'student_id',
    label: 'Student ID',
    render: (r) => (r.student_id != null ? String(r.student_id) : '—'),
  },
  { key: 'month', label: 'Month' },
  { key: 'year', label: 'Year' },
  {
    key: 'normal_amount',
    label: 'Normal',
    render: (r) => money(r.normal_amount ?? 0),
  },
  {
    key: 'special_amount',
    label: 'Special',
    render: (r) => money(r.special_amount ?? 0),
  },
  {
    key: 'subscription_amount',
    label: 'Subscription',
    render: (r) => money(r.subscription_amount ?? 0),
  },
  {
    key: 'total_amount',
    label: 'Total',
    render: (r) => money(r.total_amount ?? 0),
  },
  {
    key: 'payment_status',
    label: 'Status',
    render: (r) => (r.payment_status ? r.payment_status : '—'),
  },
]

export function StudentBillsPage() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [yearly, setYearly] = useState<StudentYearlyBill | null>(null)
  const [yearlyLoading, setYearlyLoading] = useState(true)
  const [yearlyError, setYearlyError] = useState<string | null>(null)

  const [mMonth, setMMonth] = useState(now.getMonth() + 1)
  const [mYear, setMYear] = useState(now.getFullYear())
  const [monthlyRows, setMonthlyRows] = useState<StudentMonthlyBillRow[]>([])
  const [monthlyLoading, setMonthlyLoading] = useState(true)
  const [monthlyError, setMonthlyError] = useState<string | null>(null)

  const loadYearly = useCallback(async () => {
    setYearlyLoading(true)
    setYearlyError(null)
    try {
      const y = await messGetYearlyBill(year)
      setYearly(y)
    } catch (e) {
      setYearlyError(getErrorMessage(e, 'Could not load yearly bill'))
      setYearly(null)
    } finally {
      setYearlyLoading(false)
    }
  }, [year])

  const loadMonthly = useCallback(async () => {
    setMonthlyLoading(true)
    setMonthlyError(null)
    try {
      const rows = await messGetMonthlyBill({ month: mMonth, year: mYear })
      setMonthlyRows(rows)
    } catch (e) {
      setMonthlyError(getErrorMessage(e, 'Could not load monthly bills'))
      setMonthlyRows([])
    } finally {
      setMonthlyLoading(false)
    }
  }, [mMonth, mYear])

  useEffect(() => {
    void loadYearly()
  }, [loadYearly])

  useEffect(() => {
    void loadMonthly()
  }, [loadMonthly])

  const monthlyBreakdownSum = useMemo(() => {
    const rows = yearly?.monthly_breakdown ?? []
    return rows.reduce((s, m) => s + Number(m.amount ?? 0), 0)
  }, [yearly])

  /** When yearly totals are missing/zero but breakdown has amounts, show sum of months. */
  const yearlyKpis = useMemo(() => {
    if (!yearly) return null
    const tb =
      yearly.total_bills > 0 ? yearly.total_bills : monthlyBreakdownSum
    return {
      total_amount: tb,
      total_paid: yearly.total_paid,
      balance_due: yearly.balance_due,
      usedBreakdownFallback: yearly.total_bills <= 0 && monthlyBreakdownSum > 0,
    }
  }, [yearly, monthlyBreakdownSum])

  const showPaidBalance =
    yearly &&
    (yearly.total_paid > 0 || yearly.balance_due > 0)

  const breakdownCols: TableColumn<{ month: number; amount: number }>[] = [
    { key: 'month', label: 'Month' },
    {
      key: 'amount',
      label: 'Amount',
      render: (r) => money(r.amount ?? 0),
    },
  ]

  return (
    <div>
      <h1 className={styles.title}>Bills</h1>
      <p className={styles.sub}>
        Yearly summary and itemised monthly bills for a selected period.
      </p>

      <section className={styles.section}>
        <div className={styles.row}>
          <label className={styles.label}>
            Year (yearly bill)
            <input
              className={styles.input}
              type="number"
              min={2000}
              max={2100}
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            />
          </label>
          <button
            type="button"
            className={styles.btn}
            onClick={() => void loadYearly()}
          >
            Refresh yearly
          </button>
        </div>
        <ErrorBanner
          message={yearlyError}
          onDismiss={() => setYearlyError(null)}
        />
        {yearlyLoading ? (
          <Loader label="Loading yearly bill…" />
        ) : !yearly || !yearlyKpis ? (
          <EmptyState title="No yearly data" />
        ) : (
          <>
            <Card title={`Year ${yearly.year}`}>
              {yearlyKpis.usedBreakdownFallback ? (
                <p className={styles.fallbackNote}>
                  Top-level yearly totals were not returned; &quot;Total
                  bills&quot; shows the sum of the monthly breakdown below.
                </p>
              ) : null}
              <dl
                className={`${styles.kpis} ${showPaidBalance ? styles.kpisFour : styles.kpisTwo}`}
              >
                <div>
                  <dt>Total amount</dt>
                  <dd>{money(yearlyKpis.total_amount ?? 0)}</dd>
                </div>
                <div>
                  <dt>Bills (count)</dt>
                  <dd>{yearly.bill_count}</dd>
                </div>
                {showPaidBalance ? (
                  <>
                    <div>
                      <dt>Total paid</dt>
                      <dd>{money(yearlyKpis.total_paid ?? 0)}</dd>
                    </div>
                    <div>
                      <dt>Balance due</dt>
                      <dd>{money(yearlyKpis.balance_due ?? 0)}</dd>
                    </div>
                  </>
                ) : null}
              </dl>
            </Card>
            {(yearly.monthly_breakdown?.length ?? 0) > 0 ? (
              <Card title="Monthly breakdown">
                <Table
                  columns={breakdownCols}
                  data={yearly.monthly_breakdown ?? []}
                />
              </Card>
            ) : null}
          </>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>Monthly bill detail</h2>
        <div className={styles.row}>
          <label className={styles.label}>
            Month
            <select
              className={styles.input}
              value={mMonth}
              onChange={(e) => setMMonth(Number(e.target.value))}
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
          <label className={styles.label}>
            Year
            <input
              className={styles.input}
              type="number"
              min={2000}
              max={2100}
              value={mYear}
              onChange={(e) => setMYear(Number(e.target.value))}
            />
          </label>
          <button
            type="button"
            className={styles.btn}
            onClick={() => void loadMonthly()}
          >
            Refresh monthly
          </button>
        </div>
        <ErrorBanner
          message={monthlyError}
          onDismiss={() => setMonthlyError(null)}
        />
        {monthlyLoading ? (
          <Loader label="Loading monthly bills…" />
        ) : monthlyRows.length === 0 ? (
          <EmptyState title="No bills" message="No rows for this month/year." />
        ) : (
          <Card title="Bills">
            <Table columns={monthlyCols} data={monthlyRows} />
          </Card>
        )}
      </section>
    </div>
  )
}
