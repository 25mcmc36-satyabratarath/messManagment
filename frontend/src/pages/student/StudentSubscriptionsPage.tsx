import { messAddSubscription } from '../../api/messStudentService'
import { Card } from '../../components/Card'
import { Form, type FormFieldConfig } from '../../components/Form'
import { useToast } from '../../context/ToastContext'
import { getErrorMessage } from '../../utils/errors'
import styles from './StudentSubscriptionsPage.module.css'

const fields: FormFieldConfig[] = [
  { name: 'item_name', label: 'Item name', type: 'text', required: true },
  {
    name: 'cost',
    label: 'Cost (₹)',
    type: 'number',
    required: true,
    min: 0,
    step: 0.01,
  },
  {
    name: 'start_date',
    label: 'Start date',
    type: 'date',
    required: true,
  },
  {
    name: 'end_date',
    label: 'End date',
    type: 'date',
    required: true,
  },
]

export function StudentSubscriptionsPage() {
  const { showToast } = useToast()

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const res = await messAddSubscription({
        item_name: values.item_name.trim(),
        cost: Number(values.cost),
        start_date: values.start_date,
        end_date: values.end_date,
      })
      if (res.success) {
        showToast(res.message || 'Subscription added', 'success')
      } else {
        showToast(res.message || 'Could not add subscription', 'error')
      }
    } catch (e) {
      showToast(getErrorMessage(e, 'Request failed'), 'error')
    }
  }

  return (
    <div>
      <h1 className={styles.title}>Subscriptions</h1>
      <p className={styles.sub}>
        Add an extra mess subscription for the selected date range.
      </p>
      <Card title="New subscription">
        <Form
          id="sub-form"
          fields={fields}
          onSubmit={handleSubmit}
          submitLabel="Add subscription"
        />
      </Card>
    </div>
  )
}
