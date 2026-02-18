# Employee Health Tracking API

This backend provides RESTful API endpoints for the employee health tracking system.

## Endpoints

### Employees
- `GET /api/employees` - Get all employees (supports filtering by status, department)
- `GET /api/employees/[id]` - Get a specific employee
- `POST /api/employees` - Create a new employee
- `PUT /api/employees/[id]` - Update an employee
- `DELETE /api/employees/[id]` - Delete an employee

### Alerts
- `GET /api/alerts` - Get all alerts (supports filtering by severity, acknowledged status, employeeId)
- `GET /api/alerts/[id]` - Get a specific alert
- `PUT /api/alerts/[id]` - Update an alert (e.g., acknowledge it)
- `DELETE /api/alerts/[id]` - Delete an alert

### Health Data
- `GET /api/health/summary` - Get overall health summary and statistics
- `GET /api/health/vitals` - Get employee vitals (requires employeeId parameter, supports type filter)

### Departments
- `GET /api/departments` - Get department statistics and health data

## Query Parameters

### Employees
- `status` - Filter by status (healthy, warning, critical)
- `department` - Filter by department

### Alerts
- `severity` - Filter by severity (info, warning, critical)
- `acknowledged` - Filter by acknowledgement status (true/false)
- `employeeId` - Filter by employee ID

### Health Vitals
- `employeeId` (required) - The employee ID
- `type` - Vital type (heartRate, bloodOxygen, steps, sleep, stress, temperature, all)

## Response Format

All endpoints return a JSON response with the following structure:

```json
{
  "success": true,
  "data": { /* endpoint-specific data */ },
  "count": 10 /* optional, for list endpoints */
}
```

Errors return:
```json
{
  "success": false,
  "error": "Error message"
}
```

## Example Requests

### Get all employees
```
GET /api/employees
```

### Get critical alerts
```
GET /api/alerts?severity=critical&acknowledged=false
```

### Get employee vitals
```
GET /api/health/vitals?employeeId=emp-001&type=heartRate
```

### Get department stats
```
GET /api/departments
```

## Notes

- This API currently uses mock data from the health-data module
- For production use, implement proper database integration
- All timestamps are in ISO 8601 format
- IDs cannot be modified through PUT requests
