import { apiClient } from './apiClient'
import type {
  SupervisorConsumptionByDateRow,
  SupervisorMonthlyConsumptionData,
  SupervisorRationItem,
} from './types'

export async function supervisorAddRationItem(body: {
  name: string
  unit: string
  unit_cost: number
  supplier_id: number
  hostel_id: number
}): Promise<{
  success: boolean
  message: string
  data: SupervisorRationItem | null
}> {
  const res = await apiClient.post<{
    success?: boolean
    message?: string
    data?: SupervisorRationItem
  }>('/api/mess-supervisor/add-ration-item', body)
  return {
    success: Boolean(res.data?.success),
    message: res.data?.message ?? '',
    data: res.data?.data ?? null,
  }
}

export async function supervisorGetRationItems(
  hostelId: number,
): Promise<SupervisorRationItem[]> {
  const res = await apiClient.get<{
    success?: boolean
    data?: SupervisorRationItem[]
  }>('/api/mess-supervisor/get-ration-items', {
    params: { hostel_id: hostelId },
  })
  const raw = res.data?.data
  return Array.isArray(raw) ? raw : []
}

export async function supervisorUpdateRationItem(
  id: number,
  body: Partial<{
    name: string
    unit: string
    unit_cost: number
    supplier_id: number
    hostel_id: number
  }>,
): Promise<{ success: boolean; message: string; data: SupervisorRationItem | null }> {
  const res = await apiClient.post<{
    success?: boolean
    message?: string
    data?: SupervisorRationItem
  }>(`/api/mess-supervisor/update-ration-item/${id}`, body)
  return {
    success: Boolean(res.data?.success),
    message: res.data?.message ?? '',
    data: res.data?.data ?? null,
  }
}

export async function supervisorDeleteRationItem(
  id: number,
  hostel_id: number,
): Promise<{ success: boolean; message: string }> {
  const res = await apiClient.delete<{
    success?: boolean
    message?: string
  }>(`/api/mess-supervisor/delete-ration-item/${id}`, {
    data: { hostel_id },
  })
  return {
    success: Boolean(res.data?.success),
    message: res.data?.message ?? '',
  }
}

export async function supervisorMonthlyConsumption(params: {
  hostel_id: number
  year: number
  month: number
}): Promise<SupervisorMonthlyConsumptionData | null> {
  const res = await apiClient.get<{
    success?: boolean
    data?: SupervisorMonthlyConsumptionData
  }>('/api/mess-supervisor/monthly-consumption', { params })
  return res.data?.data ?? null
}

export async function supervisorAddRationConsumption(body: {
  ration_item_id: number
  hostel_id: number
  date: string
  quantity: number
  cost: number
}): Promise<{ success: boolean; message: string }> {
  const res = await apiClient.post<{
    success?: boolean
    message?: string
  }>('/api/mess-supervisor/add-ration-consumption', body)
  return {
    success: Boolean(res.data?.success),
    message: res.data?.message ?? '',
  }
}

export async function supervisorRationConsumptionByDate(params: {
  hostel_id: number
  date: string
}): Promise<SupervisorConsumptionByDateRow[]> {
  const res = await apiClient.get<{
    success?: boolean
    data?: SupervisorConsumptionByDateRow[]
  }>('/api/mess-supervisor/ration-consumption-by-date', { params })
  const raw = res.data?.data
  return Array.isArray(raw) ? raw : []
}
