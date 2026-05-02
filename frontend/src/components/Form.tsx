import { useState, type FormEvent } from 'react'
import styles from './Form.module.css'

export type FormFieldConfig = {
  name: string
  label: string
  type:
    | 'text'
    | 'email'
    | 'number'
    | 'password'
    | 'select'
    | 'textarea'
    | 'date'
  required?: boolean
  placeholder?: string
  options?: { value: string; label: string }[]
  min?: number
  max?: number
  step?: number
  rows?: number
}

type Props = {
  fields: FormFieldConfig[]
  initialValues?: Record<string, string>
  onSubmit: (values: Record<string, string>) => void | Promise<void>
  submitLabel?: string
  disabled?: boolean
  id?: string
}

export function Form({
  fields,
  initialValues = {},
  onSubmit,
  submitLabel = 'Submit',
  disabled,
  id,
}: Props) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const v: Record<string, string> = {}
    for (const f of fields) {
      v[f.name] = initialValues[f.name] ?? ''
    }
    return v
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const setField = (name: string, val: string) => {
    setValues((prev) => ({ ...prev, [name]: val }))
  }

  const validate = (): boolean => {
    const next: Record<string, string> = {}
    for (const f of fields) {
      if (f.required && !String(values[f.name] ?? '').trim()) {
        next[f.name] = `${f.label} is required`
      }
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await onSubmit({ ...values })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form id={id} className={styles.form} onSubmit={handleSubmit} noValidate>
      {fields.map((f) => (
        <div key={f.name} className={styles.field}>
          <label className={styles.label} htmlFor={`${id ?? 'f'}-${f.name}`}>
            {f.label}
            {f.required ? <span className={styles.req}> *</span> : null}
          </label>
          {f.type === 'select' ? (
            <select
              id={`${id ?? 'f'}-${f.name}`}
              className={styles.input}
              value={values[f.name] ?? ''}
              disabled={disabled || submitting}
              onChange={(e) => setField(f.name, e.target.value)}
            >
              <option value="">Select…</option>
              {(f.options ?? []).map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ) : f.type === 'textarea' ? (
            <textarea
              id={`${id ?? 'f'}-${f.name}`}
              className={styles.textarea}
              rows={f.rows ?? 3}
              placeholder={f.placeholder}
              value={values[f.name] ?? ''}
              disabled={disabled || submitting}
              onChange={(e) => setField(f.name, e.target.value)}
            />
          ) : (
            <input
              id={`${id ?? 'f'}-${f.name}`}
              className={styles.input}
              type={f.type}
              placeholder={f.placeholder}
              min={f.min}
              max={f.max}
              step={f.step}
              value={values[f.name] ?? ''}
              disabled={disabled || submitting}
              onChange={(e) => setField(f.name, e.target.value)}
            />
          )}
          {errors[f.name] ? (
            <p className={styles.error} role="alert">
              {errors[f.name]}
            </p>
          ) : null}
        </div>
      ))}
      <div className={styles.actions}>
        <button
          type="submit"
          className={styles.primary}
          disabled={disabled || submitting}
        >
          {submitting ? 'Please wait…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
