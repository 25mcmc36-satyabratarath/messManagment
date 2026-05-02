import { apiClient } from './apiClient'
import type { CaretakerExpense, CaretakerStudent } from './types'

export async function caretakerAddStudent(body: {
  name: string
  email: string
  hostel_id: number
}): Promise<{ message: string; student_id?: number }> {
  const res = await apiClient.post<{ message?: string; student_id?: number }>(
    '/api/caretaker/add-new-student',
    body,
  )
  return {
    message: res.data?.message ?? '',
    student_id: res.data?.student_id,
  }
}

export async function caretakerGetAllStudents(): Promise<CaretakerStudent[]> {
  const res = await apiClient.get<Record<string, unknown>>(
    '/api/caretaker/get-all-student-details',
  )
  const d = res.data
  if (!d || typeof d !== 'object') return []
  const raw =
    (d as Record<string, unknown>).students ?? (d as Record<string, unknown>).data
  if (!Array.isArray(raw)) return []
  return raw as CaretakerStudent[]
}

export async function caretakerAddCard(body: {
  student_id: number
}): Promise<{ message: string; card_id?: number }> {
  const res = await apiClient.post<{ message?: string; card_id?: number }>(
    '/api/caretaker/add-new-card',
    body,
  )
  return {
    message: res.data?.message ?? '',
    card_id: res.data?.card_id,
  }
}

export async function caretakerAddExpense(body: {
  date: string
  normal_expense: number
}): Promise<string> {
  const res = await apiClient.post<{ message?: string }>(
    '/api/caretaker/add-expense',
    body,
  )
  return res.data?.message ?? 'Saved'
}

export async function caretakerGetExpenses(): Promise<CaretakerExpense[]> {
  const res = await apiClient.get<Record<string, unknown>>(
    '/api/caretaker/get-expense',
  )
  const d = res.data
  if (!d || typeof d !== 'object') return []
  const raw =
    (d as Record<string, unknown>).expenses ?? (d as Record<string, unknown>).data
  if (!Array.isArray(raw)) return []
  return raw as CaretakerExpense[]
}
