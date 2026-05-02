/* eslint-disable react-hooks/set-state-in-effect -- mount data loads */
import { useCallback, useEffect, useState } from 'react'
import {
  caretakerAddExpense,
  caretakerGetExpenses,
} from '../../api/caretakerService'
import type { CaretakerExpense } from '../../api/types'
import { Card } from '../../components/Card'
import { EmptyState } from '../../components/EmptyState'
import { ErrorBanner } from '../../components/ErrorBanner'
import { Form, type FormFieldConfig } from '../../components/Form'
import { Loader } from '../../components/Loader'
import { Table, type TableColumn } from '../../components/Table'
import { useToast } from '../../context/ToastContext'
import { getErrorMessage } from '../../utils/errors'
import styles from './CaretakerExpensePage.module.css'

function money(n: number) {
  return `₹${n.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`
}

function todayISO(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const expenseCols: TableColumn<CaretakerExpense>[] = [
  { key: 'expense_id', label: 'ID' },
  { key: 'hostel_id', label: 'Hostel' },
  { key: 'date', label: 'Date' },
  {
    key: 'normal_expense',
    label: 'Amount',
    render: (r) => money(r.normal_expense ?? 0),
  },
]

const addFields: FormFieldConfig[] = [
  { name: 'date', label: 'Date', type: 'date', required: true },
  {
    name: 'normal_expense',
    label: 'Normal expense (₹)',
    type: 'number',
    required: true,
    min: 0,
    step: 0.01,
  },
]

export function CaretakerExpensePage() {
  const { showToast } = useToast()
  const [rows, setRows] = useState<CaretakerExpense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setRows(await caretakerGetExpenses())
    } catch (e) {
      setError(getErrorMessage(e, 'Could not load expenses'))
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <div>
      <h1 className={styles.title}>Daily expenses</h1>
      <p className={styles.sub}>
        Log normal expense by date for your hostel. Totals apply to the hostel
        linked to your caretaker account.
      </p>

      <div className={styles.split}>
        <Card title="Add expense">
          <Form
            fields={addFields}
            initialValues={{ date: todayISO(), normal_expense: '' }}
            submitLabel="Save expense"
            onSubmit={async (v) => {
              try {
                const msg = await caretakerAddExpense({
                  date: v.date,
                  normal_expense: Number(v.normal_expense),
                })
                showToast(msg, 'success')
                await load()
              } catch (e) {
                showToast(getErrorMessage(e, 'Could not save expense'), 'error')
              }
            }}
          />
        </Card>
        <Card title="Expense log">
          <div className={styles.toolbar}>
            <button
              type="button"
              className={styles.refresh}
              onClick={() => void load()}
            >
              Refresh
            </button>
          </div>
          <ErrorBanner message={error} onDismiss={() => setError(null)} />
          {loading ? (
            <Loader label="Loading expenses…" />
          ) : rows.length === 0 ? (
            <EmptyState
              title="No expenses"
              message="No records returned from the server."
            />
          ) : (
            <Table columns={expenseCols} data={rows} />
          )}
        </Card>
      </div>
    </div>
  )
}
