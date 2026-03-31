# 🏥 Health Check Endpoint Guide

## Overview

The Hostel Management System includes a `/health/` endpoint for monitoring application status and database connectivity. This is useful for:
- ✓ Cron job scheduling
- ✓ Load balancer health checks
- ✓ Monitoring systems (Render, Vercel, etc.)
- ✓ Uptime monitoring services
- ✓ Automated alerts

---

## Endpoint Details

### URL
```
GET /api/health/
```

### Base URLs

**Local Development:**
```
http://localhost:8000/api/health/
```

**Production (Render):**
```
https://hostel-management-api.onrender.com/api/health/
```

---

## Response Format

### Successful Response (HTTP 200)

```json
{
    "status": "healthy",
    "timestamp": "2024-03-31T04:58:00.123456Z",
    "database": "connected",
    "uptime": "running",
    "version": "1.0.0",
    "message": "Hostel Management System is operational"
}
```

### Unhealthy Response (HTTP 200 with unhealthy status)

```json
{
    "status": "unhealthy",
    "timestamp": "2024-03-31T04:58:00.123456Z",
    "database": "error: connection refused",
    "uptime": "running",
    "version": "1.0.0",
    "message": "Hostel Management System is operational"
}
```

---

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | `healthy` or `unhealthy` |
| `timestamp` | string | ISO 8601 timestamp |
| `database` | string | Database connection status |
| `uptime` | string | System uptime status |
| `version` | string | API version |
| `message` | string | Status message |

---

## Testing the Endpoint

### Using cURL

```bash
curl -X GET http://localhost:8000/api/health/
```

**Response:**
```bash
{
  "status": "healthy",
  "timestamp": "2024-03-31T04:58:00Z",
  "database": "connected",
  "uptime": "running",
  "version": "1.0.0"
}
```

### Using Postman

1. Create new GET request
2. URL: `http://localhost:8000/api/health/`
3. Click Send
4. Check response status and body

### Using JavaScript/Fetch

```javascript
const checkHealth = async () => {
    try {
        const response = await fetch('http://localhost:8000/api/health/');
        const data = await response.json();
        console.log('Health Status:', data);
        
        if (data.status === 'healthy') {
            console.log('✓ API is healthy');
        } else {
            console.log('✗ API is unhealthy');
        }
    } catch (error) {
        console.error('Health check failed:', error);
    }
};

checkHealth();
```

### Using Python Requests

```python
import requests
import json

response = requests.get('http://localhost:8000/api/health/')
print(response.status_code)
print(json.dumps(response.json(), indent=2))
```

---

## Cron Job Examples

### Linux/macOS Cron Job

**Add to crontab:**
```bash
crontab -e
```

**Example - Check every 5 minutes:**
```cron
*/5 * * * * curl -X GET http://localhost:8000/api/health/
```

**Example - Check every hour:**
```cron
0 * * * * curl -X GET https://hostel-management-api.onrender.com/api/health/
```

**Example - Check with notification:**
```cron
*/30 * * * * curl -s -X GET http://localhost:8000/api/health/ | mail -s "Health Check" admin@example.com
```

### Python Cron Script

**Create file: `health_check.py`**
```python
#!/usr/bin/env python3
import requests
import logging
from datetime import datetime

logging.basicConfig(
    filename='health_check.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def check_health():
    try:
        response = requests.get(
            'http://localhost:8000/api/health/',
            timeout=5
        )
        data = response.json()
        
        if data['status'] == 'healthy':
            logging.info('✓ API Health: Healthy')
        else:
            logging.warning(f'✗ API Health: Unhealthy - {data.get("database")}')
            
    except requests.exceptions.RequestException as e:
        logging.error(f'✗ Health check failed: {str(e)}')

if __name__ == '__main__':
    check_health()
```

**Add to crontab:**
```bash
*/5 * * * * /usr/bin/python3 /path/to/health_check.py
```

---

## Monitoring Service Integration

### Render Health Checks

**Already configured in `render.yaml`:**
```yaml
services:
  - type: web
    name: hostel-management-api
    healthCheckPath: /api/health/
```

The endpoint is automatically checked by Render.

### UptimeRobot

1. Set up new monitor
2. Monitor type: HTTP(s)
3. URL: `https://hostel-management-api.onrender.com/api/health/`
4. Check interval: 5 minutes
5. Expect response code: 200

### Monitoring Script Example

```bash
#!/bin/bash

API_URL="https://hostel-management-api.onrender.com/api/health/"
ALERT_EMAIL="admin@example.com"

response=$(curl -s -X GET "$API_URL")
status=$(echo "$response" | grep -o '"status":"[^"]*' | cut -d'"' -f4)

if [ "$status" != "healthy" ]; then
    echo "API is unhealthy! Response: $response" | mail -s "API Alert" "$ALERT_EMAIL"
fi
```

---

## Deployment Considerations

### Production Environment

**Environment Variables:**
```bash
DEBUG=False
DATABASE_URL=postgresql://user:password@host:5432/dbname
ALLOWED_HOSTS=yourdomain.com
```

### Health Check Frequency

**Recommended intervals:**
- Local development: Every 30 seconds
- Production monitoring: Every 5 minutes
- Uptime monitoring: Every 5-10 minutes

---

## Troubleshooting

### Issue: Connection Refused
**Cause:** Backend server not running  
**Solution:** Start backend with `python manage.py runserver`

### Issue: Database Connection Error
**Response:** `"database": "error: connection refused"`  
**Cause:** PostgreSQL/SQLite not accessible  
**Solution:** Check database configuration in `settings.py`

### Issue: 404 Not Found
**Cause:** Endpoint not registered  
**Solution:** Verify `health_check` is in `urls.py`

### Issue: CORS Error (Frontend calling endpoint)
**Solution:** Add to `CORS_ALLOWED_ORIGINS` in Django settings

---

## Code Reference

### Location
- **File:** `Backend/hostel/views.py`
- **Function:** `health_check()`
- **URL:** `Backend/hostel/urls.py`

### Implementation

```python
@api_view(['GET'])
def health_check(request):
    """Health check endpoint for monitoring and cron jobs."""
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"

    response_data = {
        "status": "healthy" if db_status == "connected" else "unhealthy",
        "timestamp": timezone.now().isoformat(),
        "database": db_status,
        "uptime": "running",
        "version": "1.0.0",
        "message": "Hostel Management System is operational"
    }
    
    return Response(response_data, status=status.HTTP_200_OK)
```

---

## Best Practices

✓ **Rate Limiting:** Consider adding rate limiting to prevent abuse  
✓ **Authentication:** Health checks are unauthenticated (intentional for monitoring)  
✓ **Logging:** Log health check results for analysis  
✓ **Alerting:** Set up alerts for unhealthy status  
✓ **Timeout:** Set reasonable timeout limits (5-10 seconds)  

---

## Future Enhancements

- [ ] Additional checks (Redis, Cache, File storage)
- [ ] Performance metrics (response time)
- [ ] Resource usage (CPU, memory)
- [ ] Application-specific health (e.g., unpaid rents count)
- [ ] Dependency health checks

---

**Last Updated:** March 31, 2026  
**API Version:** 1.0.0
