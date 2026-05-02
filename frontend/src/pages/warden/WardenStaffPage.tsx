/* eslint-disable react-hooks/set-state-in-effect -- mount data loads */
import { useCallback, useEffect, useState } from 'react'
import {
  wardenAddStaff,
  wardenGetAllStaff,
  wardenRemoveStaff,
} from '../../api/wardenService'
import type { WardenStaff } from '../../api/types'
import { Card } from '../../components/Card'
import { EmptyState } from '../../components/EmptyState'
import { ErrorBanner } from '../../components/ErrorBanner'
import { Form, type FormFieldConfig } from '../../components/Form'
import { Loader } from '../../components/Loader'
import { Table, type TableColumn } from '../../components/Table'
import { useToast } from '../../context/ToastContext'
import { getErrorMessage } from '../../utils/errors'
import styles from './WardenStaffPage.module.css'

const STAFF_ROLE_OPTIONS = [
  { value: 'MESS_SECRETARY', label: 'Mess secretary' },
  { value: 'CARE_TAKER', label: 'Care taker' },
  { value: 'MESS_SUPERVISOR', label: 'Mess supervisor' },
  { value: 'WARDEN', label: 'Warden' },
]

const fields: FormFieldConfig[] = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  {
    name: 'role',
    label: 'Staff role',
    type: 'select',
    required: true,
    options: STAFF_ROLE_OPTIONS,
  },
  {
    name: 'hostel_id',
    label: 'Hostel ID',
    type: 'number',
    required: true,
    min: 1,
    step: 1,
  },
]

export function WardenStaffPage() {
  const { showToast } = useToast()
  const [rows, setRows] = useState<WardenStaff[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const list = await wardenGetAllStaff()
      setRows(list)
    } catch (e) {
      setError(getErrorMessage(e, 'Could not load staff'))
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const handleAdd = async (values: Record<string, string>) => {
    try {
      const res = await wardenAddStaff({
        name: values.name.trim(),
        email: values.email.trim(),
        role: values.role,
        hostel_id: Number(values.hostel_id),
      })
      showToast(res.message || 'Staff added', 'success')
      await load()
    } catch (e) {
      showToast(getErrorMessage(e, 'Could not add staff'), 'error')
    }
  }

  const handleRemove = async (row: WardenStaff) => {
    const ok = window.confirm(
      `Remove ${row.name} (${row.email}) from staff?`,
    )
    if (!ok) return
    try {
      const msg = await wardenRemoveStaff(row.staff_id)
      showToast(msg, 'success')
      await load()
    } catch (e) {
      showToast(getErrorMessage(e, 'Remove failed'), 'error')
    }
  }

  const columns: TableColumn<WardenStaff>[] = [
    { key: 'staff_id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'hostel_id', label: 'Hostel' },
    {
      key: '_a',
      label: '',
      render: (r) => (
        <button
          type="button"
          className={styles.danger}
          onClick={() => void handleRemove(r)}
        >
          Remove
        </button>
      ),
    },
  ]

  return (
    <div>
      <h1 className={styles.title}>Staff</h1>
      <p className={styles.sub}>Add hostel staff and maintain the directory.</p>

      <ErrorBanner message={error} onDismiss={() => setError(null)} />

      <div className={styles.split}>
        <Card title="Add staff">
          <Form
            id="warden-add-staff"
            fields={fields}
            onSubmit={handleAdd}
            submitLabel="Add staff member"
          />
        </Card>
        <Card title="All staff">
          {loading ? (
            <Loader label="Loading staff…" />
          ) : rows.length === 0 ? (
            <EmptyState title="No staff" message="No staff records from the API." />
          ) : (
            <Table columns={columns} data={rows} />
          )}
        </Card>
      </div>
    </div>
  )
}
