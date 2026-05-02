/* eslint-disable react-hooks/set-state-in-effect -- mount data loads */
import { useCallback, useEffect, useState } from 'react'
import { messGetFeedback, messPostFeedback } from '../../api/messStudentService'
import type { StudentFeedbackItem } from '../../api/types'
import { Card } from '../../components/Card'
import { EmptyState } from '../../components/EmptyState'
import { ErrorBanner } from '../../components/ErrorBanner'
import { Form, type FormFieldConfig } from '../../components/Form'
import { Loader } from '../../components/Loader'
import { Table, type TableColumn } from '../../components/Table'
import { useToast } from '../../context/ToastContext'
import { getErrorMessage } from '../../utils/errors'
import styles from './StudentFeedbackPage.module.css'

const fields: FormFieldConfig[] = [
  {
    name: 'food_rating',
    label: 'Food rating (1–5)',
    type: 'number',
    required: true,
    min: 1,
    max: 5,
    step: 1,
  },
  {
    name: 'hygiene_rating',
    label: 'Hygiene rating (1–5)',
    type: 'number',
    required: true,
    min: 1,
    max: 5,
    step: 1,
  },
  {
    name: 'comments',
    label: 'Comments',
    type: 'textarea',
    required: false,
    rows: 4,
  },
]

function formatWhen(r: StudentFeedbackItem): string {
  const iso = r.date ?? r.created_at
  if (!iso) return '—'
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
}

const columns: TableColumn<StudentFeedbackItem>[] = [
  {
    key: 'feedback_id',
    label: 'Feedback ID',
    render: (r) => String(r.feedback_id ?? r.id ?? '—'),
  },
  {
    key: 'student_id',
    label: 'Student ID',
    render: (r) => (r.student_id != null ? String(r.student_id) : '—'),
  },
  { key: 'food_rating', label: 'Food' },
  { key: 'hygiene_rating', label: 'Hygiene' },
  {
    key: 'comments',
    label: 'Comments',
    render: (r) => (r.comments ? r.comments : '—'),
  },
  {
    key: 'date',
    label: 'Submitted',
    render: (r) => formatWhen(r),
  },
]

export function StudentFeedbackPage() {
  const { showToast } = useToast()
  const [rows, setRows] = useState<StudentFeedbackItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const list = await messGetFeedback()
      setRows(list)
    } catch (e) {
      setError(getErrorMessage(e, 'Could not load feedback'))
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const res = await messPostFeedback({
        food_rating: Number(values.food_rating),
        hygiene_rating: Number(values.hygiene_rating),
        comments: values.comments?.trim() || undefined,
      })
      if (res.success) {
        showToast(res.message || 'Feedback submitted', 'success')
        await load()
      } else {
        showToast(res.message || 'Submit failed', 'error')
      }
    } catch (e) {
      showToast(getErrorMessage(e, 'Submit failed'), 'error')
    }
  }

  return (
    <div>
      <h1 className={styles.title}>Feedback</h1>
      <p className={styles.sub}>
        Rate the mess and review your previous submissions.
      </p>

      <div className={styles.split}>
        <Card title="Submit feedback">
          <Form
            id="feedback-form"
            fields={fields}
            onSubmit={handleSubmit}
            submitLabel="Submit"
          />
        </Card>
        <Card title="Your feedback">
          <ErrorBanner message={error} onDismiss={() => setError(null)} />
          {loading ? (
            <Loader label="Loading…" />
          ) : rows.length === 0 ? (
            <EmptyState title="No feedback yet" />
          ) : (
            <Table columns={columns} data={rows} />
          )}
        </Card>
      </div>
    </div>
  )
}
