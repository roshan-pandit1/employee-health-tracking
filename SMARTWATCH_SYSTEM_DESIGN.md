# Smartwatch Bluetooth Data Collection System

## Architecture Overview

This system collects health data from smartwatches via Bluetooth and stores it in the SQL database.

```
Smartwatch Device (Bluetooth)
    ↓
Bluetooth Handler (Data Validation)
    ↓
WebSocket/API Endpoint (Real-time Sync)
    ↓
Smartwatch Service (Processing & Analysis)
    ↓
SQL Database (Storage)
    ↓
Alert System (Monitoring & Alerts)
```

## Components

### 1. **Data Validation Layer** (`smartwatch-schemas.ts`)
- Zod schemas for validating incoming smartwatch data
- Ensures data integrity before storage
- Supports heart rate, blood oxygen, steps, sleep, stress, temperature, calories

### 2. **Bluetooth Handler** (`bluetooth-handler.ts`)
- Parses incoming Bluetooth data streams
- Validates payload structure
- Simulates real Bluetooth data for testing
- In production, integrates with actual Bluetooth libraries (Web Bluetooth API, react-native-ble-plx, etc.)

### 3. **Smartwatch Service** (`lib/smartwatch-service.ts`)
Core business logic:
- **processSmartwatchData()**: Main data ingestion pipeline
- **analyzeSmartwatchData()**: Real-time alert generation
- **registerSmartwatch()**: Device pairing
- **disconnectSmartwatch()**: Device management
- **getSmartwatchHistory()**: Sync logs
- **calculateHealthMetrics()**: Analytics from vital data

### 4. **API Endpoints**

#### `/api/smartwatch/sync` - Data Synchronization
```bash
# Real data from smartwatch
POST /api/smartwatch/sync
Content-Type: application/json

{
  "employeeId": "emp-001",
  "deviceId": "device-xyz",
  "readings": [
    {
      "heartRate": 72,
      "bloodOxygen": 98,
      "steps": 250,
      "stressLevel": 45,
      "temperature": 98.6,
      "caloriesBurned": 125,
      "timestamp": "2026-02-17T12:30:00Z"
    }
  ],
  "syncedAt": "2026-02-17T12:31:00Z"
}

# Simulate data (for testing)
GET /api/smartwatch/sync?employeeId=emp-001&simulate=true
```

#### `/api/smartwatch/device` - Device Management
```bash
# Register device
POST /api/smartwatch/device
{
  "employeeId": "emp-001",
  "deviceId": "device-xyz",
  "deviceName": "Apple Watch",
  "deviceModel": "Series 8",
  "firmwareVersion": "10.1.1",
  "batteryLevel": 85
}

# Get device status
GET /api/smartwatch/device?employeeId=emp-001

# Get sync history (last 7 days)
GET /api/smartwatch/device?employeeId=emp-001&action=history&days=7

# Get health metrics
GET /api/smartwatch/device?employeeId=emp-001&action=metrics&days=7

# Disconnect device
DELETE /api/smartwatch/device?employeeId=emp-001
```

## Real-Time Data Processing Flow

### 1. Data Reception
Device sends Bluetooth data → API receives POST request

### 2. Validation
```
Raw Data → Zod Schema Validation → Parsed Data
```

### 3. Storage
```
Vital Readings → Database
                    ↓
Employee LastSync Updated
                    ↓
Sync Event Logged
```

### 4. Analysis & Alerts
```
Vitals Analyzed → Thresholds Checked → Alerts Generated → Database
```

### 5. Health Metrics
```
Historical Vitals → Aggregation → Metrics Calculation → Response
```

## Integration with Actual Bluetooth Libraries

### For Web (Next.js/React)
```typescript
// Use Web Bluetooth API or WebSocket for real-time data
import { BluetoothStreamHandler } from '@/lib/bluetooth-handler'

const handler = new BluetoothStreamHandler()
const stream = handler.createStream(employeeId)

// Read from stream
const reader = stream.getReader()
while(true) {
  const { done, value } = await reader.read()
  if (done) break
  // Process value
}
```

### For Mobile (React Native)
```typescript
// Use react-native-ble-plx for BLE scanning
import BleManager from 'react-native-ble-plx'

const bleManager = new BleManager()

// Scan for devices
const subscription = bleManager.onStateChange((state) => {
  if (state === 'PoweredOn') {
    scanForDevices()
  }
}, true)

// Connect and read characteristics
bleManager.connectToDevice(deviceId).then((device) => {
  return device.discoverAllServicesAndCharacteristics()
}).then((device) => {
  // Subscribe to health data characteristics
})
```

### For Backend (Node.js)
```typescript
// Use noble library for BLE scanning
import BLE from 'noble'

ble.on('discover', (peripheral) => {
  // Found device
  peripheral.connect((error) => {
    peripheral.discoverServices([], (error, services) => {
      // Read characteristics
    })
  })
})
```

## Alert Thresholds

| Vital | Warning | Critical |
|-------|---------|----------|
| Heart Rate | > 100 bpm | > 120 bpm, < 40 bpm |
| Blood Oxygen | < 93% | < 88% |
| Temperature | > 100.4°F | > 102°F, < 95°F |
| Stress | > 65/100 | > 80/100 |
| Sleep | < 5 hours | Poor quality < 40% |

## Database Schema Integration

Tables used:
- `Employee` - Watches for `watchConnected` and `lastSync`
- `VitalReading` - Stores individual readings
- `Alert` - Stores generated alerts
- `SmartwatchSync` - Logs sync events and success/failure
- `BurnoutScore` - Calculated from aggregated vitals

## Testing

### Simulate Data Collection
```bash
# Single sync
curl "http://localhost:3000/api/smartwatch/sync?employeeId=emp-001&simulate=true"

# Repeated syncs (test alert generation)
for i in {1..10}; do
  curl "http://localhost:3000/api/smartwatch/sync?employeeId=emp-001&simulate=true"
  sleep 5
done
```

### Send Real Data
```bash
curl -X POST http://localhost:3000/api/smartwatch/sync \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "emp-001",
    "deviceId": "device-xyz",
    "readings": [{
      "heartRate": 85,
      "bloodOxygen": 97,
      "steps": 500,
      "timestamp": "2026-02-17T12:30:00Z"
    }],
    "syncedAt": "2026-02-17T12:31:00Z"
  }'
```

## Features

✅ Real-time data collection via Bluetooth
✅ Automatic alert generation based on thresholds
✅ Health metrics and trend analysis
✅ Device management (register/disconnect)
✅ Sync history and logs
✅ Data validation and error handling
✅ Scalable to multiple employees/devices
✅ Extensible alert system

## Future Enhancements

- WebSocket for continuous real-time streaming
- Batch data processing for Bluetooth sync
- Machine learning for anomaly detection
- Push notifications for critical alerts
- Data export and reporting
- Mobile app integration
- Multi-device support per employee
- Battery optimization strategies
