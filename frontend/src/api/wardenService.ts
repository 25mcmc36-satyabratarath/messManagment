import { apiClient } from './apiClient'
import type {
  WardenActiveCard,
  WardenMessSummary,
  WardenStaff,
} from './types'

export async function wardenAddStaff(body: {
  name: string
  email: string
  role: string
  hostel_id: number
}): Promise<{ message: string; staff_id?: number }> {
  const res = await apiClient.post<{ message?: string; staff_id?: number }>(
    '/api/warden/add-staff',
    body,
  )
  return {
    message: res.data?.message ?? '',
    staff_id: res.data?.staff_id,
  }
}

export async function wardenGetAllStaff(): Promise<WardenStaff[]> {
  const res = await apiClient.get<{ staff?: WardenStaff[] }>(
    '/api/warden/get-all-staff',
  )
  return res.data?.staff ?? []
}

export async function wardenRemoveStaff(id: number): Promise<string> {
  const res = await apiClient.delete<{ message?: string }>(
    `/api/warden/remove-staff/${id}`,
  )
  return res.data?.message ?? 'Removed'
}

export async function wardenMessSummary(): Promise<WardenMessSummary | null> {
  const res = await apiClient.get<{ summary?: WardenMessSummary }>(
    '/api/warden/mess-summary',
  )
  return res.data?.summary ?? null
}

export async function wardenAllMessActiveCards(): Promise<WardenActiveCard[]> {
  const res = await apiClient.get<{ cards?: WardenActiveCard[] }>(
    '/api/warden/all-mess-active-cards',
  )
  return res.data?.cards ?? []
}

export async function wardenUpdateEmail(
  messId: number,
  body: { email: string },
): Promise<string> {
  const res = await apiClient.post<{ message?: string }>(
    `/api/warden/update-email/${messId}`,
    body,
  )
  return res.data?.message ?? 'Updated'
}
