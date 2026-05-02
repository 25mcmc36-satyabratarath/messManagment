import { apiClient } from './apiClient'
import type {
  MessCardInterval,
  MessCardViewSummary,
  StudentFeedbackItem,
  StudentMessCardView,
  StudentMonthlyBillRow,
  StudentSpecialMealHistoryItem,
  StudentYearlyBill,
} from './types'

function toNum(v: unknown, fallback: number): number {
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'string') {
    const n = parseInt(v, 10)
    return Number.isFinite(n) ? n : fallback
  }
  return fallback
}

/** Parses money from API (number or decimal string). */
function parseMoneyField(v: unknown): number {
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'string') {
    const n = parseFloat(v)
    return Number.isFinite(n) ? n : 0
  }
  return 0
}

function normalizeInterval(row: unknown): MessCardInterval {
  const r = row as Record<string, unknown>
  const close = r.close_date
  return {
    student_id: Number(r.student_id ?? 0),
    open_date: String(r.open_date ?? ''),
    close_date:
      close === null || close === undefined ? null : String(close),
    days: Number(r.days ?? 0),
  }
}

export async function messGetCardView(params: {
  month: number
  year: number
}): Promise<StudentMessCardView | null> {
  const res = await apiClient.get<Record<string, unknown>>(
    '/api/mess/get-card-view',
    { params },
  )
  const d = res.data
  if (!d || typeof d !== 'object') return null

  const month = toNum(d.month, params.month)
  const year = toNum(d.year, params.year)

  const intervalsRaw = d.intervals
  const intervals: MessCardInterval[] = Array.isArray(intervalsRaw)
    ? intervalsRaw.map(normalizeInterval)
    : []

  const summaryRaw =
    d.summary && typeof d.summary === 'object'
      ? (d.summary as Record<string, unknown>)
      : null

  let summary: MessCardViewSummary | null = null
  if (summaryRaw) {
    const totalActiveRaw = summaryRaw.total_active_days
    const totalActiveParsed =
      typeof totalActiveRaw === 'string'
        ? parseFloat(totalActiveRaw)
        : Number(totalActiveRaw ?? 0)
    summary = {
      total_active_days: Number.isFinite(totalActiveParsed)
        ? totalActiveParsed
        : 0,
      total_open_intervals: Number(summaryRaw.total_open_intervals ?? 0),
    }
  }

  const n = (v: unknown) =>
    v != null && v !== '' ? Number(v) : undefined
  const card_id = n(d.card_id)
  const student_id = n(d.student_id)
  const active_days = n(d.active_days)
  const special_meals = n(d.special_meals)
  const subscriptions = n(d.subscriptions)
  const total_amount = n(d.total_amount)

  return {
    month,
    year,
    intervals,
    summary,
    card_id,
    student_id,
    active_days,
    special_meals,
    subscriptions,
    total_amount,
  }
}

export async function messGetYearlyBill(year: number): Promise<StudentYearlyBill | null> {
  const res = await apiClient.get<Record<string, unknown>>(
    '/api/mess/get-yearly-bill',
    { params: { year } },
  )
  const d = res.data
  if (!d || typeof d !== 'object') return null

  const root = d as Record<string, unknown>
  const payload =
    root.data && typeof root.data === 'object'
      ? (root.data as Record<string, unknown>)
      : root

  const nestedSummary =
    payload.summary && typeof payload.summary === 'object'
      ? (payload.summary as Record<string, unknown>)
      : null
  const src = nestedSummary ?? payload

  const y = Number(payload.year ?? src.year ?? year)

  const totalBills = parseMoneyField(
    payload.totalAmount ??
      src.totalAmount ??
      src.total_bills ??
      src.total_bill ??
      src.total_bill_amount ??
      src.bill_total ??
      src.total_amount ??
      src.grand_total ??
      payload.total_bills ??
      payload.total_bill,
  )

  const billCount = Number(
    payload.billCount ??
      payload.bill_count ??
      src.billCount ??
      src.bill_count ??
      0,
  )
  const totalPaid = parseMoneyField(
    src.total_paid ??
      src.paid_amount ??
      src.total_paid_amount ??
      src.paid ??
      src.amount_paid ??
      payload.total_paid,
  )
  const balanceDue = parseMoneyField(
    src.balance_due ??
      src.balance ??
      src.due ??
      src.outstanding ??
      src.pending ??
      payload.balance_due,
  )

  const mbRaw =
    payload.monthly_breakdown ??
    src.monthly_breakdown ??
    nestedSummary?.monthly_breakdown
  let monthly_breakdown: Array<{ month: number; amount: number }> = []
  if (Array.isArray(mbRaw)) {
    monthly_breakdown = mbRaw.map((item) => {
      if (!item || typeof item !== 'object') {
        return { month: 0, amount: 0 }
      }
      const o = item as Record<string, unknown>
      return {
        month: Number(o.month ?? 0),
        amount: parseMoneyField(
          o.amount ?? o.total ?? o.bill_amount ?? o.value,
        ),
      }
    })
  }

  return {
    year: Number.isFinite(y) ? y : year,
    total_bills: totalBills,
    bill_count: Number.isFinite(billCount) ? billCount : 0,
    total_paid: totalPaid,
    balance_due: balanceDue,
    monthly_breakdown,
  }
}

function normalizeMonthlyBillRow(
  raw: Record<string, unknown>,
): StudentMonthlyBillRow {
  const bid = raw.bill_id ?? raw.id
  const idNum = Number(bid ?? 0)
  const normalRaw =
    raw.normal_amount ?? raw.base_amount ?? raw.normal
  const specialRaw =
    raw.special_amount ??
    raw.special_meals ??
    raw.special_meal_amount
  const subsRaw =
    raw.subscription_amount ??
    raw.subscriptions ??
    raw.subscriptions_amount
  const totalRaw =
    raw.total_amount ?? raw.total ?? raw.amount
  const payStatus = raw.payment_status ?? raw.paid ?? raw.status
  let payment_status = ''
  if (typeof payStatus === 'string') payment_status = payStatus
  else if (typeof payStatus === 'boolean')
    payment_status = payStatus ? 'PAID' : 'UNPAID'
  else if (payStatus != null) payment_status = String(payStatus)

  return {
    bill_id: idNum,
    id: idNum,
    student_id:
      raw.student_id != null ? Number(raw.student_id) : undefined,
    month: Number(raw.month ?? 0),
    year: Number(raw.year ?? 0),
    normal_amount: parseMoneyField(normalRaw),
    special_amount: parseMoneyField(specialRaw),
    subscription_amount: parseMoneyField(subsRaw),
    total_amount: parseMoneyField(totalRaw),
    payment_status,
  }
}

export async function messGetMonthlyBill(params: {
  month: number
  year: number
}): Promise<StudentMonthlyBillRow[]> {
  const res = await apiClient.get<{
    success?: boolean
    bills?: unknown[]
  }>('/api/mess/get-monthly-bill', { params })
  const raw = res.data?.bills
  if (!Array.isArray(raw)) return []
  return raw.map((item) =>
    normalizeMonthlyBillRow(
      item && typeof item === 'object'
        ? (item as Record<string, unknown>)
        : {},
    ),
  )
}

export async function messPostFeedback(body: {
  food_rating: number
  hygiene_rating: number
  comments?: string
}): Promise<{ success: boolean; message: string }> {
  const res = await apiClient.post<{
    success?: boolean
    message?: string
  }>('/api/mess/feedback', body)
  return {
    success: Boolean(res.data?.success),
    message: res.data?.message ?? '',
  }
}

function normalizeFeedbackRow(
  raw: Record<string, unknown>,
): StudentFeedbackItem {
  const fid = raw.feedback_id ?? raw.id
  const idNum = Number(fid ?? 0)
  return {
    feedback_id: idNum,
    id: idNum,
    student_id:
      raw.student_id != null ? Number(raw.student_id) : undefined,
    food_rating: Number(raw.food_rating ?? 0),
    hygiene_rating: Number(raw.hygiene_rating ?? 0),
    comments: typeof raw.comments === 'string' ? raw.comments : '',
    date: typeof raw.date === 'string' ? raw.date : undefined,
    created_at:
      typeof raw.created_at === 'string'
        ? raw.created_at
        : typeof raw.date === 'string'
          ? raw.date
          : '',
  }
}

export async function messGetFeedback(): Promise<StudentFeedbackItem[]> {
  const res = await apiClient.get<{
    success?: boolean
    feedback?: unknown[]
  }>('/api/mess/feedback')
  const raw = res.data?.feedback
  if (!Array.isArray(raw)) return []
  return raw.map((item) =>
    normalizeFeedbackRow(
      item && typeof item === 'object'
        ? (item as Record<string, unknown>)
        : {},
    ),
  )
}

export async function messGetSpecialMealHistory(): Promise<
  StudentSpecialMealHistoryItem[]
> {
  const res = await apiClient.get<{
    success?: boolean
    history?: StudentSpecialMealHistoryItem[]
  }>('/api/mess/get-special-meal-history')
  return res.data?.history ?? []
}

export async function messJoinSpecialMeal(body: {
  special_id: number
}): Promise<{
  success: boolean
  message: string
}> {
  const res = await apiClient.post<{
    success?: boolean
    message?: string
  }>('/api/mess/join-special-meal', body)
  return {
    success: Boolean(res.data?.success),
    message: res.data?.message ?? '',
  }
}

export async function messAddSubscription(body: {
  item_name: string
  cost: number
  start_date: string
  end_date: string
}): Promise<{
  success: boolean
  message: string
}> {
  const res = await apiClient.post<{
    success?: boolean
    message?: string
  }>('/api/mess/add-subscription', body)
  return {
    success: Boolean(res.data?.success),
    message: res.data?.message ?? '',
  }
}

export async function messOpenMessCard(): Promise<{
  success: boolean
  message: string
  card_id?: number
}> {
  const res = await apiClient.post<{
    success?: boolean
    message?: string
    card_id?: number
  }>('/api/mess/open-mess-card')
  return {
    success: Boolean(res.data?.success),
    message: res.data?.message ?? '',
    card_id: res.data?.card_id,
  }
}

export async function messCloseMessCard(): Promise<{
  success: boolean
  message: string
}> {
  const res = await apiClient.post<{
    success?: boolean
    message?: string
  }>('/api/mess/close-mess-card')
  return {
    success: Boolean(res.data?.success),
    message: res.data?.message ?? '',
  }
}
