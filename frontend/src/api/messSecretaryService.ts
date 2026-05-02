import { apiClient } from './apiClient'
import type {
  SecretaryActiveCardsByDate,
  SecretaryNetCard,
  SecretaryRationRow,
  SecretarySpecialMeal,
  SecretaryWeeklyRow,
  SpecialMealCatalogEntry,
} from './types'

function parseMoney(v: unknown): number {
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'string') {
    const n = parseFloat(v)
    return Number.isFinite(n) ? n : 0
  }
  return 0
}

export async function secretaryActiveCardsByDate(
  date: string,
): Promise<SecretaryActiveCardsByDate> {
  const res = await apiClient.get<SecretaryActiveCardsByDate>(
    '/api/mess-secretary/no-of-active-cards',
    { params: { date } },
  )
  return {
    total_cards: res.data?.total_cards,
    active_cards: res.data?.active_cards,
    date: res.data?.date ?? date,
  }
}

export async function secretaryNetCard(): Promise<SecretaryNetCard | null> {
  const res = await apiClient.get<SecretaryNetCard>(
    '/api/mess-secretary/net-card',
  )
  const d = res.data
  if (!d) return null
  return {
    total_cards: d.total_cards ?? 0,
    open_cards: d.open_cards ?? 0,
    closed_cards: d.closed_cards ?? 0,
  }
}

function normalizeRationRow(r: Record<string, unknown>): SecretaryRationRow {
  return {
    date: String(r.date ?? ''),
    total_expense: parseMoney(
      r.total_expense ?? r.normal_expense ?? r.amount,
    ),
  }
}

export async function secretaryRation(): Promise<SecretaryRationRow[]> {
  const res = await apiClient.get<Record<string, unknown>>(
    '/api/mess-secretary/ration',
  )
  const d = res.data
  if (!d || typeof d !== 'object') return []
  const raw = d.ration_summary ?? d.data
  if (!Array.isArray(raw)) return []
  return raw.map((item) =>
    normalizeRationRow(
      item && typeof item === 'object'
        ? (item as Record<string, unknown>)
        : {},
    ),
  )
}

export async function secretaryRationConsumption(body: {
  hostel_id: number
  date: string
  normal_expense: number
}): Promise<string> {
  const res = await apiClient.post<{ message?: string }>(
    '/api/mess-secretary/ration-consumption',
    body,
  )
  return res.data?.message ?? 'Saved'
}

function normalizeSpecialSummaryRow(
  r: Record<string, unknown>,
): SecretarySpecialMeal {
  return {
    id: Number(r.id ?? r.special_id ?? 0),
    meal_name: String(r.meal_name ?? ''),
    date: String(r.date ?? ''),
    total_cost: parseMoney(r.total_cost),
    total_plates: Number(r.total_plates ?? 0),
    plates_taken: Number(r.plates_taken ?? 0),
  }
}

export async function secretarySpecialMealSummary(): Promise<
  SecretarySpecialMeal[]
> {
  const res = await apiClient.get<Record<string, unknown>>(
    '/api/mess-secretary/special-meal-summary',
  )
  const d = res.data
  if (!d || typeof d !== 'object') return []
  const raw = d.special_meals ?? d.data
  if (!Array.isArray(raw)) return []
  return raw.map((item) =>
    normalizeSpecialSummaryRow(
      item && typeof item === 'object'
        ? (item as Record<string, unknown>)
        : {},
    ),
  )
}

export async function secretarySpecialMealPoll(body: {
  hostel_id: number
  date: string
  meal_name: string
  total_cost: number
  total_plates: number
}): Promise<{ message: string; meal_id?: number }> {
  const res = await apiClient.post<{ message?: string; meal_id?: number }>(
    '/api/mess-secretary/special-meal-poll',
    body,
  )
  return {
    message: res.data?.message ?? '',
    meal_id: res.data?.meal_id,
  }
}

function normalizeCatalogRow(
  row: Record<string, unknown>,
): SpecialMealCatalogEntry {
  const tc = row.total_cost
  const costNum =
    typeof tc === 'string' ? parseFloat(tc) : Number(tc ?? 0)
  return {
    special_id: Number(row.special_id ?? 0),
    hostel_id: Number(row.hostel_id ?? 0),
    date: String(row.date ?? ''),
    meal_name: String(row.meal_name ?? ''),
    total_cost: Number.isFinite(costNum) ? costNum : 0,
    total_plates: Number(row.total_plates ?? 0),
  }
}

/** GET /api/mess-secretary/special-meal — `{ success, data: [...] }` */
export async function secretarySpecialMeals(): Promise<SpecialMealCatalogEntry[]> {
  const res = await apiClient.get<{
    success?: boolean
    data?: unknown[]
  }>('/api/mess-secretary/special-meal')
  const raw = res.data?.data
  if (!Array.isArray(raw)) return []
  return raw.map((item) =>
    normalizeCatalogRow(
      item && typeof item === 'object'
        ? (item as Record<string, unknown>)
        : {},
    ),
  )
}

export async function secretaryAddSpecialMealStudent(
  specialMealId: number,
  body: { student_id: number; plates_taken: number },
): Promise<string> {
  const res = await apiClient.post<{ message?: string }>(
    `/api/mess-secretary/add-special-meal/${specialMealId}`,
    body,
  )
  return res.data?.message ?? 'Saved'
}

export async function secretaryAddWeeklyExpense(body: {
  hostel_id: number
  date: string
  normal_expense: number
}): Promise<string> {
  const res = await apiClient.post<{ message?: string }>(
    '/api/mess-secretary/add-weekly-expense',
    body,
  )
  return res.data?.message ?? 'Saved'
}

function normalizeWeeklyRow(r: Record<string, unknown>): SecretaryWeeklyRow {
  return {
    week: String(r.week ?? r.year_week ?? ''),
    total_expense: parseMoney(r.total_expense ?? r.amount),
  }
}

export async function secretaryGetWeeklyExpense(): Promise<SecretaryWeeklyRow[]> {
  const res = await apiClient.get<Record<string, unknown>>(
    '/api/mess-secretary/get-weekly-expense',
  )
  const d = res.data
  if (!d || typeof d !== 'object') return []
  const raw = d.weekly_summary ?? d.data
  if (!Array.isArray(raw)) return []
  return raw.map((item) =>
    normalizeWeeklyRow(
      item && typeof item === 'object'
        ? (item as Record<string, unknown>)
        : {},
    ),
  )
}
