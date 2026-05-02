/* eslint-disable react-hooks/set-state-in-effect -- mount data loads */
import { useCallback, useEffect, useState } from 'react'
import {
  supervisorAddRationItem,
  supervisorDeleteRationItem,
  supervisorGetRationItems,
  supervisorUpdateRationItem,
} from '../../api/messSupervisorService'
import type { SupervisorRationItem } from '../../api/types'
import { Card } from '../../components/Card'
import { EmptyState } from '../../components/EmptyState'
import { ErrorBanner } from '../../components/ErrorBanner'
import { Form, type FormFieldConfig } from '../../components/Form'
import { Loader } from '../../components/Loader'
import { Modal } from '../../components/Modal'
import { Table, type TableColumn } from '../../components/Table'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { getErrorMessage } from '../../utils/errors'
import styles from './SupervisorRationItemsPage.module.css'

const addFields: FormFieldConfig[] = [
  { name: 'name', label: 'Item name', type: 'text', required: true },
  { name: 'unit', label: 'Unit', type: 'text', required: true, placeholder: 'kg, L, …' },
  {
    name: 'unit_cost',
    label: 'Unit cost',
    type: 'number',
    required: true,
    min: 0,
    step: 0.01,
  },
  {
    name: 'supplier_id',
    label: 'Supplier ID',
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
]

export function SupervisorRationItemsPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  /** Empty uses `user.hostel_id` when the profile includes it. */
  const [hostelInput, setHostelInput] = useState('')
  const [items, setItems] = useState<SupervisorRationItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [addOpen, setAddOpen] = useState(false)
  const [editItem, setEditItem] = useState<SupervisorRationItem | null>(null)

  const hid =
    Number(hostelInput.trim()) ||
    (typeof user?.hostel_id === 'number' ? user.hostel_id : 0)

  const load = useCallback(async () => {
    if (!hid) {
      setItems([])
      setError('Enter a valid hostel ID.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const list = await supervisorGetRationItems(hid)
      setItems(list)
    } catch (e) {
      setError(getErrorMessage(e, 'Could not load ration items'))
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [hid])

  useEffect(() => {
    void load()
  }, [load])

  const handleAdd = async (values: Record<string, string>) => {
    try {
      const res = await supervisorAddRationItem({
        name: values.name.trim(),
        unit: values.unit.trim(),
        unit_cost: Number(values.unit_cost),
        supplier_id: Number(values.supplier_id),
        hostel_id: Number(values.hostel_id),
      })
      if (res.success) {
        showToast(res.message || 'Item created', 'success')
        setAddOpen(false)
        await load()
      } else {
        showToast(res.message || 'Could not create item', 'error')
      }
    } catch (e) {
      showToast(getErrorMessage(e, 'Create failed'), 'error')
    }
  }

  const handleEdit = async (values: Record<string, string>) => {
    if (!editItem) return
    try {
      const res = await supervisorUpdateRationItem(editItem.ration_item_id, {
        name: values.name.trim(),
        unit: values.unit.trim(),
        unit_cost: Number(values.unit_cost),
        supplier_id: Number(values.supplier_id),
        hostel_id: Number(values.hostel_id),
      })
      if (res.success) {
        showToast(res.message || 'Item updated', 'success')
        setEditItem(null)
        await load()
      } else {
        showToast(res.message || 'Update failed', 'error')
      }
    } catch (e) {
      showToast(getErrorMessage(e, 'Update failed'), 'error')
    }
  }

  const handleDelete = async (row: SupervisorRationItem) => {
    const ok = window.confirm(
      `Delete ration item "${row.name}"? This cannot be undone.`,
    )
    if (!ok) return
    try {
      const res = await supervisorDeleteRationItem(row.ration_item_id, row.hostel_id)
      if (res.success) {
        showToast(res.message || 'Deleted', 'success')
        await load()
      } else {
        showToast(res.message || 'Delete failed', 'error')
      }
    } catch (e) {
      showToast(getErrorMessage(e, 'Delete failed'), 'error')
    }
  }

  const columns: TableColumn<SupervisorRationItem>[] = [
    { key: 'ration_item_id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'unit', label: 'Unit' },
    {
      key: 'unit_cost',
      label: 'Unit cost',
      render: (r) =>
        `₹${Number(r.unit_cost ?? 0).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
    },
    { key: 'supplier_id', label: 'Supplier' },
    { key: 'supplier_name', label: 'Supplier name' },
    {
      key: '_actions',
      label: '',
      render: (r) => (
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.linkBtn}
            onClick={() => setEditItem(r)}
          >
            Edit
          </button>
          <button
            type="button"
            className={styles.dangerBtn}
            onClick={() => void handleDelete(r)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <h1 className={styles.title}>Ration items</h1>
      <p className={styles.sub}>
        Manage ration catalogue for a hostel. Loads items for the hostel ID you
        set (defaults from your profile when available).
      </p>

      <div className={styles.toolbar}>
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
        <button type="button" className={styles.btn} onClick={() => void load()}>
          Reload
        </button>
        <button
          type="button"
          className={styles.primary}
          onClick={() => setAddOpen(true)}
          disabled={!hid}
        >
          Add item
        </button>
      </div>

      <ErrorBanner message={error} onDismiss={() => setError(null)} />

      <Card title="Items">
        {loading ? (
          <Loader label="Loading items…" />
        ) : items.length === 0 ? (
          <EmptyState
            title="No ration items"
            message="Add an item or verify hostel ID and permissions."
          />
        ) : (
          <Table columns={columns} data={items} />
        )}
      </Card>

      <Modal
        isOpen={addOpen}
        title="Add ration item"
        onClose={() => setAddOpen(false)}
      >
        <Form
          key={`add-${addOpen}`}
          id="add-ration"
          fields={addFields}
          initialValues={{
            hostel_id: String(hid || user?.hostel_id || ''),
          }}
          onSubmit={handleAdd}
          submitLabel="Create"
        />
      </Modal>

      <Modal
        isOpen={Boolean(editItem)}
        title="Edit ration item"
        onClose={() => setEditItem(null)}
      >
        {editItem ? (
          <Form
            key={editItem.ration_item_id}
            id="edit-ration"
            fields={addFields}
            initialValues={{
              name: editItem.name ?? '',
              unit: editItem.unit ?? '',
              unit_cost: String(editItem.unit_cost ?? ''),
              supplier_id: String(editItem.supplier_id ?? ''),
              hostel_id: String(editItem.hostel_id ?? ''),
            }}
            onSubmit={handleEdit}
            submitLabel="Save changes"
          />
        ) : null}
      </Modal>
    </div>
  )
}
