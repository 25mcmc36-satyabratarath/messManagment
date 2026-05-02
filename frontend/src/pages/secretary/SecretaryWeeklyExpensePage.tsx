/* eslint-disable react-hooks/set-state-in-effect -- mount data loads */
import { useCallback, useEffect, useState } from 'react'
import {
  secretaryAddWeeklyExpense,
  secretaryGetWeeklyExpense,
} from '../../api/messSecretaryService'
import type { SecretaryWeeklyRow } from '../../api/types'
import { Card } from '../../components/Card'
import { EmptyState } from '../../components/EmptyState'
import { ErrorBanner } from '../../components/ErrorBanner'
import { Form, type FormFieldConfig } from '../../components/Form'
import { Loader } from '../../components/Loader'
import { Table, type TableColumn } from '../../components/Table'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { getErrorMessage } from '../../utils/errors'
import shared from './secretaryShared.module.css'

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

const weeklyCols: TableColumn<SecretaryWeeklyRow>[] = [
  { key: 'week', label: 'Week / period' },
  {
    key: 'total_expense',
    label: 'Total expense',
    render: (r) => money(r.total_expense ?? 0),
  },
]

const expenseFields: FormFieldConfig[] = [
  {
    name: 'hostel_id',
    label: 'Hostel ID',
    type: 'number',
    required: true,
    min: 1,
    step: 1,
  },
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

export function SecretaryWeeklyExpensePage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [rows, setRows] = useState<SecretaryWeeklyRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const defaultHostel =
    typeof user?.hostel_id === 'number' ? String(user.hostel_id) : ''

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const r = await secretaryGetWeeklyExpense()
      setRows(r)
    } catch (e) {
      setError(getErrorMessage(e, 'Could not load weekly expense'))
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
      <h1 className={shared.title}>Weekly expense</h1>
      <p className={shared.sub}>
        Summary by week and add weekly expense entries for your hostel.
      </p>

      <div className={shared.stack}>
        <Card title="Weekly summary">
          <div className={shared.toolbar}>
            <button
              type="button"
              className={shared.refresh}
              onClick={() => void load()}
            >
              Refresh
            </button>
          </div>
          <ErrorBanner message={error} onDismiss={() => setError(null)} />
          {loading ? (
            <Loader label="Loading weekly expense…" />
          ) : rows.length === 0 ? (
            <EmptyState
              title="No data"
              message="No weekly rows returned."
            />
          ) : (
            <Table columns={weeklyCols} data={rows} />
          )}
        </Card>

        <Card title="Add weekly expense">
          <Form
            key={defaultHostel || 'weekly-form'}
            fields={expenseFields}
            initialValues={{
              hostel_id: defaultHostel,
              date: todayISO(),
              normal_expense: '',
            }}
            submitLabel="Save weekly expense"
            onSubmit={async (v) => {
              try {
                const msg = await secretaryAddWeeklyExpense({
                  hostel_id: Number(v.hostel_id),
                  date: v.date,
                  normal_expense: Number(v.normal_expense),
                })
                showToast(msg, 'success')
                await load()
              } catch (e) {
                showToast(getErrorMessage(e, 'Could not save'), 'error')
              }
            }}
          />
        </Card>
      </div>
    </div>
  )
}
