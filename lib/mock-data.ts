// Mock data export for the backend API
import { getEmployees as fetchEmployees, getAllAlerts as fetchAllAlerts } from './health-data'

// Cache employees on module load
export const employees = fetchEmployees()

// Export getAllAlerts function
export function getAllAlerts() {
  return fetchAllAlerts()
}
