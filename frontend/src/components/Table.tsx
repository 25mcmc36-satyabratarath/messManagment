import type { ReactNode } from 'react'
import styles from './Table.module.css'

export type TableColumn<T> = {
  key: string
  label: string
  render?: (row: T) => ReactNode
}

type Props<T> = {
  columns: TableColumn<T>[]
  data: T[]
  emptyMessage?: string
}

function cellValue<T>(row: T, key: string): ReactNode {
  if (row && typeof row === 'object' && key in (row as object)) {
    const v = (row as Record<string, unknown>)[key]
    if (v === null || v === undefined) return '—'
    return String(v)
  }
  return '—'
}

export function Table<T>({ columns, data, emptyMessage }: Props<T>) {
  if (!data.length) {
    return (
      <p className={styles.emptyTable}>{emptyMessage ?? 'No rows to display.'}</p>
    )
  }

  return (
    <div className={styles.scroll}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} scope="col">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row) : cellValue(row, col.key)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
