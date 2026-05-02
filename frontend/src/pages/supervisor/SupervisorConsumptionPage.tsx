/* eslint-disable react-hooks/set-state-in-effect -- mount data loads */
import { useCallback, useEffect, useState } from 'react'
import {
  supervisorAddRationConsumption,
  supervisorMonthlyConsumption,
  supervisorRationConsumptionByDate,
} from '../../api/messSupervisorService'
import type {
  SupervisorConsumptionByDateRow,
  SupervisorMonthlyConsumptionData,
} from '../../api/types'
import { Card } from '../../components/Card'
import { EmptyState } from '../../components/EmptyState'
import { ErrorBanner } from '../../components/ErrorBanner'
import { Form, type FormFieldConfig } from '../../components/Form'
import { Loader } from '../../components/Loader'
import { Table, type TableColumn } from '../../components/Table'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { getErrorMessage } from '../../utils/errors'
import styles from './SupervisorConsumptionPage.module.css'

function money(n: number) {
  return `₹${n.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`
}

const addConsumptionFields: FormFieldConfig[] = [
  {
    name: 'ration_item_id',
    label: 'Ration item ID',
    type: 'number',
    required: true,
    min: 1,
    step: 1,
  },
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
    name: 'quantity',
    label: 'Quantity',
    type: 'number',
    required: true,
    min: 0,
    step: 0.01,
  },
  {
    name: 'cost',
    label: 'Cost (₹)',
    type: 'number',
    required: true,
    min: 0,
    step: 0.01,
  },
]

const monthlyCols: TableColumn<
  SupervisorMonthlyConsumptionData['consumption'][0]
>[] = [
  { key: 'item_name', label: 'Item' },
  { key: 'unit', label: 'Unit' },
  {
    key: 'total_quantity',
    label: 'Qty',
    render: (r) => String(r.total_quantity ?? 0),
  },
  {
    key: 'total_cost',
    label: 'Cost',
    render: (r) => money(r.total_cost ?? 0),
  },
  { key: 'days_used', label: 'Days used' },
]

const byDateCols: TableColumn<SupervisorConsumptionByDateRow>[] = [
  { key: 'consumption_id', label: 'ID' },
  { key: 'ration_item_id', label: 'Item ID' },
  { key: 'item_name', label: 'Item' },
  { key: 'unit', label: 'Unit' },
  {
    key: 'quantity',
    label: 'Qty',
    render: (r) => String(r.quantity ?? 0),
  },
  {
    key: 'cost',
    label: 'Cost',
    render: (r) => money(r.cost ?? 0),
  },
  { key: 'date', label: 'Date' },
]

function todayISO(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function SupervisorConsumptionPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const now = new Date()
  const [hostelInput, setHostelInput] = useState('')
  const hid =
    Number(hostelInput.trim()) ||
    (typeof user?.hostel_id === 'number' ? user.hostel_id : 0)

  const [mYear, setMYear] = useState(now.getFullYear())
  const [mMonth, setMMonth] = useState(now.getMonth() + 1)
  const [monthlyData, setMonthlyData] =
    useState<SupervisorMonthlyConsumptionData | null>(null)
  const [monthlyLoading, setMonthlyLoading] = useState(false)
  const [monthlyError, setMonthlyError] = useState<string | null>(null)

  const [logDate, setLogDate] = useState(todayISO)
  const [byDateRows, setByDateRows] = useState<SupervisorConsumptionByDateRow[]>(
    [],
  )
  const [byDateLoading, setByDateLoading] = useState(false)
  const [byDateError, setByDateError] = useState<string | null>(null)

  const loadMonthly = useCallback(async () => {
    if (!hid) {
      setMonthlyError('Enter a hostel ID.')
      setMonthlyData(null)
      return
    }
    setMonthlyLoading(true)
    setMonthlyError(null)
    try {
      const data = await supervisorMonthlyConsumption({
        hostel_id: hid,
        year: mYear,
        month: mMonth,
      })
      setMonthlyData(data)
    } catch (e) {
      setMonthlyError(getErrorMessage(e, 'Could not load monthly consumption'))
      setMonthlyData(null)
    } finally {
      setMonthlyLoading(false)
    }
  }, [hid, mYear, mMonth])

  const loadByDate = useCallback(async () => {
    if (!hid) {
      setByDateError('Enter a hostel ID.')
      setByDateRows([])
      return
    }
    setByDateLoading(true)
    setByDateError(null)
    try {
      const rows = await supervisorRationConsumptionByDate({
        hostel_id: hid,
        date: logDate,
      })
      setByDateRows(rows)
    } catch (e) {
      setByDateError(getErrorMessage(e, 'Could not load consumption for date'))
      setByDateRows([])
    } finally {
      setByDateLoading(false)
    }
  }, [hid, logDate])

  useEffect(() => {
    void loadMonthly()
  }, [loadMonthly])

  useEffect(() => {
    void loadByDate()
  }, [loadByDate])

  const handleAddLog = async (values: Record<string, string>) => {
    try {
      const res = await supervisorAddRationConsumption({
        ration_item_id: Number(values.ration_item_id),
        hostel_id: Number(values.hostel_id),
        date: values.date,
        quantity: Number(values.quantity),
        cost: Number(values.cost),
      })
      if (res.success) {
        showToast(res.message || 'Consumption recorded', 'success')
        await loadMonthly()
        await loadByDate()
      } else {
        showToast(res.message || 'Failed', 'error')
      }
    } catch (e) {
      showToast(getErrorMessage(e, 'Save failed'), 'error')
    }
  }

  const summary = monthlyData?.summary

  return (
    <div>
      <h1 className={styles.title}>Ration consumption</h1>
      <p className={styles.sub}>
        Monthly reports, daily logging, and consumption by date (mess
        supervisor APIs).
      </p>

      <div className={styles.hostelBar}>
        <label className={styles.label}>
          Hostel ID
          <input
            className={styles.input}
            type="number"
            min={1}
            value={hostelInput}
            placeholder={
              user?.hostel_id != null ? String(user.hostel_id) : undefined
            }
            onChange={(e) => setHostelInput(e.target.value)}
          />
        </label>
        <p className={styles.hostelHint}>
          Used for all sections below. Leave empty to use your profile hostel
          when set.
        </p>
      </div>

      <div className={styles.stack}>
        <Card title="Monthly consumption report">
          <div className={styles.row}>
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
            <button
              type="button"
              className={styles.btn}
              onClick={() => void loadMonthly()}
            >
              Refresh report
            </button>
          </div>
          <ErrorBanner
            message={monthlyError}
            onDismiss={() => setMonthlyError(null)}
          />
          {monthlyLoading ? (
            <Loader label="Loading report…" />
          ) : !monthlyData ? (
            <EmptyState title="No data" message="Pick hostel, month, and refresh." />
          ) : (
            <>
              <dl className={styles.summary}>
                <div>
                  <dt>Total monthly cost</dt>
                  <dd>{money(summary?.total_monthly_cost ?? 0)}</dd>
                </div>
                <div>
                  <dt>Active days</dt>
                  <dd>{summary?.active_days ?? 0}</dd>
                </div>
                <div>
                  <dt>Items used</dt>
                  <dd>{summary?.items_used ?? 0}</dd>
                </div>
              </dl>
              {(monthlyData.consumption?.length ?? 0) === 0 ? (
                <EmptyState title="No lines" message="No consumption rows for this month." />
              ) : (
                <Table
                  columns={monthlyCols}
                  data={monthlyData.consumption ?? []}
                />
              )}
            </>
          )}
        </Card>

        <Card title="Add consumption (daily log)">
          <Form
            key={`add-consumption-${hid}`}
            id="add-consumption"
            fields={addConsumptionFields}
            initialValues={{
              hostel_id: hid ? String(hid) : '',
              date: todayISO(),
            }}
            onSubmit={handleAddLog}
            submitLabel="Save consumption"
          />
        </Card>

        <Card title="Consumption by date">
          <div className={styles.row}>
            <label className={styles.label}>
              Date
              <input
                className={styles.input}
                type="date"
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
              />
            </label>
            <button
              type="button"
              className={styles.btn}
              onClick={() => void loadByDate()}
            >
              Load
            </button>
          </div>
          <ErrorBanner
            message={byDateError}
            onDismiss={() => setByDateError(null)}
          />
          {byDateLoading ? (
            <Loader label="Loading…" />
          ) : byDateRows.length === 0 ? (
            <EmptyState title="No records" message="Nothing logged for this date." />
          ) : (
            <Table columns={byDateCols} data={byDateRows} />
          )}
        </Card>
      </div>
    </div>
  )
}
