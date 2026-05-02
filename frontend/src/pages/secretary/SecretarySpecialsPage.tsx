/* eslint-disable react-hooks/set-state-in-effect -- mount data loads */
import { useCallback, useEffect, useState } from 'react'
import {
  secretaryAddSpecialMealStudent,
  secretarySpecialMealPoll,
  secretarySpecialMeals,
  secretarySpecialMealSummary,
} from '../../api/messSecretaryService'
import type {
  SecretarySpecialMeal,
  SpecialMealCatalogEntry,
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
import shared from './secretaryShared.module.css'

function money(n: number) {
  return `₹${n.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`
}

function formatDate(iso: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10)
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function todayISO(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const summaryCols: TableColumn<SecretarySpecialMeal>[] = [
  { key: 'id', label: 'ID' },
  { key: 'meal_name', label: 'Meal' },
  {
    key: 'date',
    label: 'Date',
    render: (r) => formatDate(r.date),
  },
  {
    key: 'total_cost',
    label: 'Cost',
    render: (r) => money(r.total_cost ?? 0),
  },
  {
    key: 'total_plates',
    label: 'Plates',
    render: (r) => String(r.total_plates ?? 0),
  },
  {
    key: 'plates_taken',
    label: 'Taken',
    render: (r) => String(r.plates_taken ?? 0),
  },
]

const catalogCols: TableColumn<SpecialMealCatalogEntry>[] = [
  { key: 'special_id', label: 'ID' },
  { key: 'hostel_id', label: 'Hostel' },
  {
    key: 'date',
    label: 'Date',
    render: (r) => formatDate(r.date),
  },
  { key: 'meal_name', label: 'Meal' },
  {
    key: 'total_cost',
    label: 'Cost',
    render: (r) => money(r.total_cost ?? 0),
  },
  {
    key: 'total_plates',
    label: 'Plates',
    render: (r) => String(r.total_plates ?? 0),
  },
]

const pollFields: FormFieldConfig[] = [
  {
    name: 'hostel_id',
    label: 'Hostel ID',
    type: 'number',
    required: true,
    min: 1,
    step: 1,
  },
  { name: 'date', label: 'Date', type: 'date', required: true },
  { name: 'meal_name', label: 'Meal name', type: 'text', required: true },
  {
    name: 'total_cost',
    label: 'Total cost (₹)',
    type: 'number',
    required: true,
    min: 0,
    step: 0.01,
  },
  {
    name: 'total_plates',
    label: 'Total plates',
    type: 'number',
    required: true,
    min: 0,
    step: 1,
  },
]

const addStudentFields: FormFieldConfig[] = [
  {
    name: 'special_id',
    label: 'Special meal ID',
    type: 'number',
    required: true,
    min: 1,
    step: 1,
  },
  {
    name: 'student_id',
    label: 'Student ID',
    type: 'number',
    required: true,
    min: 1,
    step: 1,
  },
  {
    name: 'plates_taken',
    label: 'Plates taken',
    type: 'number',
    required: true,
    min: 0,
    step: 1,
  },
]

export function SecretarySpecialsPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [summary, setSummary] = useState<SecretarySpecialMeal[]>([])
  const [catalog, setCatalog] = useState<SpecialMealCatalogEntry[]>([])
  const [sumLoading, setSumLoading] = useState(true)
  const [catLoading, setCatLoading] = useState(true)
  const [sumError, setSumError] = useState<string | null>(null)
  const [catError, setCatError] = useState<string | null>(null)

  const defaultHostel =
    typeof user?.hostel_id === 'number' ? String(user.hostel_id) : ''

  const loadSummary = useCallback(async () => {
    setSumLoading(true)
    setSumError(null)
    try {
      setSummary(await secretarySpecialMealSummary())
    } catch (e) {
      setSumError(getErrorMessage(e, 'Could not load special meal summary'))
      setSummary([])
    } finally {
      setSumLoading(false)
    }
  }, [])

  const loadCatalog = useCallback(async () => {
    setCatLoading(true)
    setCatError(null)
    try {
      setCatalog(await secretarySpecialMeals())
    } catch (e) {
      setCatError(getErrorMessage(e, 'Could not load special meals list'))
      setCatalog([])
    } finally {
      setCatLoading(false)
    }
  }, [])

  const loadAll = useCallback(async () => {
    await Promise.all([loadSummary(), loadCatalog()])
  }, [loadCatalog, loadSummary])

  useEffect(() => {
    void loadAll()
  }, [loadAll])

  return (
    <div>
      <h1 className={shared.title}>Special meals</h1>
      <p className={shared.sub}>
        Polls and participation: summary, catalog, create a poll, and assign
        students to a special meal.
      </p>

      <div className={shared.stack}>
        <Card title="Special meal summary">
          <div className={shared.toolbar}>
            <button
              type="button"
              className={shared.refresh}
              onClick={() => void loadSummary()}
            >
              Refresh
            </button>
          </div>
          <ErrorBanner message={sumError} onDismiss={() => setSumError(null)} />
          {sumLoading ? (
            <Loader label="Loading summary…" />
          ) : summary.length === 0 ? (
            <EmptyState title="No data" message="No summary rows." />
          ) : (
            <Table columns={summaryCols} data={summary} />
          )}
        </Card>

        <Card title="All special meals (catalog)">
          <div className={shared.toolbar}>
            <button
              type="button"
              className={shared.refresh}
              onClick={() => void loadCatalog()}
            >
              Refresh
            </button>
          </div>
          <ErrorBanner message={catError} onDismiss={() => setCatError(null)} />
          {catLoading ? (
            <Loader label="Loading catalog…" />
          ) : catalog.length === 0 ? (
            <EmptyState
              title="No catalog"
              message="No special meals in catalog."
            />
          ) : (
            <Table columns={catalogCols} data={catalog} />
          )}
        </Card>

        <Card title="Create special meal poll">
          <Form
            key={defaultHostel || 'poll-form'}
            fields={pollFields}
            initialValues={{
              hostel_id: defaultHostel,
              date: todayISO(),
              meal_name: '',
              total_cost: '',
              total_plates: '',
            }}
            submitLabel="Create poll"
            onSubmit={async (v) => {
              try {
                const res = await secretarySpecialMealPoll({
                  hostel_id: Number(v.hostel_id),
                  date: v.date,
                  meal_name: v.meal_name.trim(),
                  total_cost: Number(v.total_cost),
                  total_plates: Number(v.total_plates),
                })
                showToast(res.message || 'Special meal created', 'success')
                await loadAll()
              } catch (e) {
                showToast(getErrorMessage(e, 'Could not create poll'), 'error')
              }
            }}
          />
        </Card>

        <Card title="Add student to special meal">
          <p className={shared.cardLead}>
            Use the special meal ID from the catalog table above.
          </p>
          <Form
            fields={addStudentFields}
            initialValues={{
              special_id: '',
              student_id: '',
              plates_taken: '',
            }}
            submitLabel="Add student"
            onSubmit={async (v) => {
              try {
                const msg = await secretaryAddSpecialMealStudent(
                  Number(v.special_id),
                  {
                    student_id: Number(v.student_id),
                    plates_taken: Number(v.plates_taken),
                  },
                )
                showToast(msg, 'success')
                await loadAll()
              } catch (e) {
                showToast(getErrorMessage(e, 'Could not add student'), 'error')
              }
            }}
          />
        </Card>
      </div>
    </div>
  )
}
