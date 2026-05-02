/* eslint-disable react-hooks/set-state-in-effect -- mount data loads */
import { useCallback, useEffect, useState } from 'react'
import {
  caretakerAddCard,
  caretakerAddStudent,
  caretakerGetAllStudents,
} from '../../api/caretakerService'
import type { CaretakerStudent } from '../../api/types'
import { Card } from '../../components/Card'
import { EmptyState } from '../../components/EmptyState'
import { ErrorBanner } from '../../components/ErrorBanner'
import { Form, type FormFieldConfig } from '../../components/Form'
import { Loader } from '../../components/Loader'
import { Table, type TableColumn } from '../../components/Table'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { getErrorMessage } from '../../utils/errors'
import styles from './CaretakerStudentsPage.module.css'

const addFields: FormFieldConfig[] = [
  { name: 'name', label: 'Full name', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  {
    name: 'hostel_id',
    label: 'Hostel ID',
    type: 'number',
    required: true,
    min: 1,
    step: 1,
  },
]

const cardFields: FormFieldConfig[] = [
  {
    name: 'student_id',
    label: 'Student ID',
    type: 'number',
    required: true,
    min: 1,
    step: 1,
  },
]

const columns: TableColumn<CaretakerStudent>[] = [
  { key: 'student_id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'room_no', label: 'Room' },
  { key: 'hostel_name', label: 'Hostel' },
  { key: 'hostel_id', label: 'Hostel ID' },
]

export function CaretakerStudentsPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [rows, setRows] = useState<CaretakerStudent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const defaultHostel =
    typeof user?.hostel_id === 'number' ? String(user.hostel_id) : ''

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const list = await caretakerGetAllStudents()
      setRows(list)
    } catch (e) {
      setError(getErrorMessage(e, 'Could not load students'))
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
      const res = await caretakerAddStudent({
        name: values.name.trim(),
        email: values.email.trim(),
        hostel_id: Number(values.hostel_id),
      })
      showToast(res.message || 'Student added', 'success')
      await load()
    } catch (e) {
      showToast(getErrorMessage(e, 'Add failed'), 'error')
    }
  }

  const handleAddCard = async (values: Record<string, string>) => {
    try {
      const res = await caretakerAddCard({
        student_id: Number(values.student_id),
      })
      showToast(res.message || 'Mess card created', 'success')
    } catch (e) {
      showToast(getErrorMessage(e, 'Could not create card'), 'error')
    }
  }

  return (
    <div>
      <h1 className={styles.title}>Students</h1>
      <p className={styles.sub}>
        Register students, create mess cards, and browse the directory for your
        hostels.
      </p>

      <ErrorBanner message={error} onDismiss={() => setError(null)} />

      <div className={styles.split}>
        <div className={styles.leftCol}>
          <Card title="Register student">
            <Form
              key={defaultHostel || 'add-student'}
              id="add-student"
              fields={addFields}
              initialValues={{
                name: '',
                email: '',
                hostel_id: defaultHostel,
              }}
              onSubmit={handleAdd}
              submitLabel="Add student"
            />
          </Card>
          <Card title="Create mess card">
            <Form
              fields={cardFields}
              initialValues={{ student_id: '' }}
              onSubmit={handleAddCard}
              submitLabel="Create card"
            />
          </Card>
        </div>
        <Card title="Directory">
          {loading ? (
            <Loader label="Loading students…" />
          ) : rows.length === 0 ? (
            <EmptyState
              title="No students"
              message="No records returned from the server."
            />
          ) : (
            <Table columns={columns} data={rows} />
          )}
        </Card>
      </div>
    </div>
  )
}
