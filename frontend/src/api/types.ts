/** Role values sent to and returned from the API */
export type UserRole =
  | 'STUDENT'
  | 'MESS_SECRETARY'
  | 'CARE_TAKER'
  | 'MESS_SUPERVISOR'
  | 'WARDEN'

/** Normalised user for the app (API may use student_id / staff_id) */
export interface AuthUser {
  id: number
  name: string
  email: string
  hostel_id?: number | null
  /** Original role-specific id if different from id */
  raw_student_id?: number
  raw_staff_id?: number
}

export interface SendOtpResult {
  message: string
  token: string
  role: UserRole
}

export interface VerifyOtpResult {
  message: string
  token: string
  role: UserRole
  user: Record<string, unknown>
}

export interface WardenStaff {
  staff_id: number
  hostel_id: number
  name: string
  email: string
  role: string
}

export interface WardenMessSummary {
  total_students: number
  active_cards: number
  closed_cards: number
  total_cards: number
}

export interface WardenActiveCard {
  card_id: number
  student_id: number
  status: string
  open_date: string
  close_date: string | null
  student_name: string
  student_email: string
  room_no: string
}

export interface CaretakerStudent {
  student_id: number
  hostel_id: number
  name: string
  email: string
  room_no: string
  hostel_name: string
}

export interface CaretakerExpense {
  expense_id: number
  hostel_id: number
  date: string
  normal_expense: number
}

export interface SecretaryActiveCardsByDate {
  total_cards?: number
  active_cards?: number
  date?: string
}

export interface SecretaryNetCard {
  total_cards: number
  open_cards: number
  closed_cards: number
}

export interface SecretaryRationRow {
  date: string
  total_expense: number
}

export interface SecretarySpecialMeal {
  id: number
  meal_name: string
  date: string
  total_cost: number
  total_plates: number
  plates_taken: number
}

/** GET /api/mess-secretary/special-meal — each item in `data` */
export interface SpecialMealCatalogEntry {
  special_id: number
  hostel_id: number
  date: string
  meal_name: string
  total_cost: number
  total_plates: number
}

export interface SecretaryWeeklyRow {
  week: string
  total_expense: number
}

export interface SupervisorRationItem {
  ration_item_id: number
  hostel_id: number
  name: string
  unit: string
  unit_cost: number
  supplier_id: number
  supplier_name?: string
  created_at?: string
}

export interface SupervisorMonthlyConsumptionData {
  summary: {
    total_monthly_cost: number
    active_days: number
    items_used: number
  }
  consumption: Array<{
    item_name: string
    unit: string
    total_quantity: number
    total_cost: number
    days_used: number
  }>
}

export interface SupervisorConsumptionByDateRow {
  consumption_id: number
  ration_item_id: number
  hostel_id: number
  date: string
  quantity: number
  cost: number
  item_name: string
  unit: string
  created_at?: string
}

/** One open/close interval for mess attendance (get-card-view). */
export interface MessCardInterval {
  student_id: number
  open_date: string
  close_date: string | null
  days: number
}

export interface MessCardViewSummary {
  total_active_days: number
  total_open_intervals: number
}

/**
 * Normalised GET /api/mess/get-card-view.
 * Supports OpenAPI scalars and alternate `intervals` + `summary` payloads.
 */
export interface StudentMessCardView {
  month: number
  year: number
  card_id?: number
  student_id?: number
  active_days?: number
  special_meals?: number
  subscriptions?: number
  total_amount?: number
  intervals: MessCardInterval[]
  summary: MessCardViewSummary | null
}

export interface StudentYearlyBill {
  year: number
  /** Year total — from API `totalAmount` or legacy `total_bills` */
  total_bills: number
  /** From API `billCount` when present */
  bill_count: number
  total_paid: number
  balance_due: number
  monthly_breakdown: Array<{ month: number; amount: number }>
}

/** Normalised GET /api/mess/get-monthly-bill `bills[]` item */
export interface StudentMonthlyBillRow {
  bill_id: number
  /** Same as bill_id (for legacy `id` in older docs) */
  id: number
  student_id?: number
  month: number
  year: number
  normal_amount: number
  special_amount: number
  subscription_amount: number
  total_amount: number
  payment_status: string
}

export interface StudentFeedbackItem {
  /** API may return `feedback_id` or legacy `id` — normalised in service */
  feedback_id: number
  id: number
  student_id?: number
  food_rating: number
  hygiene_rating: number
  comments: string
  /** ISO date from API (`date` and/or `created_at`) */
  date?: string
  created_at: string
}

export interface StudentSpecialMealHistoryItem {
  id: number
  meal_name: string
  date: string
  cost: number
  status: string
}
