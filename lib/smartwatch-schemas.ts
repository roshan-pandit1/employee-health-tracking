// Validation schemas for smartwatch data
import { z } from 'zod'

// Single vital reading schema
export const VitalReadingSchema = z.object({
  heartRate: z.number().int().min(30).max(200).optional(),
  bloodOxygen: z.number().int().min(70).max(100).optional(),
  steps: z.number().int().min(0).optional(),
  sleepHours: z.number().min(0).max(24).optional(),
  sleepQuality: z.number().int().min(0).max(100).optional(),
  stressLevel: z.number().int().min(0).max(100).optional(),
  temperature: z.number().min(95).max(105).optional(),
  caloriesBurned: z.number().int().min(0).optional(),
})

// Smartwatch sync payload schema
export const SmartwatchSyncPayloadSchema = z.object({
  employeeId: z.string().cuid(),
  deviceId: z.string(),
  readings: z.array(
    VitalReadingSchema.extend({
      timestamp: z.date().or(z.string().datetime()),
    })
  ),
  syncedAt: z.date().or(z.string().datetime()),
})

// Smartwatch device schema
export const SmartwatchDeviceSchema = z.object({
  deviceId: z.string(),
  employeeId: z.string().cuid(),
  deviceName: z.string(),
  deviceModel: z.string(),
  firmwareVersion: z.string().optional(),
  batteryLevel: z.number().int().min(0).max(100),
  lastSync: z.date().optional(),
  active: z.boolean().default(true),
})

// Single vital reading with timestamp
export const VitalWithTimestampSchema = VitalReadingSchema.extend({
  timestamp: z.date().or(z.string().datetime()),
})

export type VitalReading = z.infer<typeof VitalReadingSchema>
export type SmartwatchSyncPayload = z.infer<typeof SmartwatchSyncPayloadSchema>
export type SmartwatchDevice = z.infer<typeof SmartwatchDeviceSchema>
export type VitalWithTimestamp = z.infer<typeof VitalWithTimestampSchema>
