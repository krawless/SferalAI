# Health Check Endpoint

The `/health` endpoint provides comprehensive application health status including database connectivity and configuration validation. It's designed for monitoring systems, load balancers, and container orchestration platforms.

## Endpoint

```
GET /health
```

## Response Status Codes

| Status Code | Meaning |
|------------|---------|
| `200 OK` | All systems operational (database connected, configuration valid) |
| `503 Service Unavailable` | System degraded (database disconnected or configuration invalid) |

## Response Format

### Healthy Response (200 OK)

```json
{
  "status": "ok",
  "timestamp": "2025-10-14T12:00:00.000Z",
  "environment": "development",
  "checks": {
    "database": {
      "status": "ok",
      "message": "Database connection successful"
    },
    "configuration": {
      "status": "ok",
      "message": "All required environment variables are configured"
    }
  },
  "uptime": 123.456,
  "version": "v20.0.0",
  "platform": "darwin"
}
```

### Unhealthy Response (503 Service Unavailable)

#### Database Connection Failed

```json
{
  "status": "error",
  "timestamp": "2025-10-14T12:00:00.000Z",
  "environment": "production",
  "checks": {
    "database": {
      "status": "error",
      "message": "Connection refused"
    },
    "configuration": {
      "status": "ok",
      "message": "All required environment variables are configured"
    }
  },
  "uptime": 123.456
}
```

#### Configuration Invalid

```json
{
  "status": "error",
  "timestamp": "2025-10-14T12:00:00.000Z",
  "environment": "production",
  "checks": {
    "database": {
      "status": "ok",
      "message": "Database connection successful"
    },
    "configuration": {
      "status": "error",
      "message": "Missing: DATABASE_URL; Invalid: NODE_ENV (must be development, production, or test)",
      "missing": ["DATABASE_URL"]
    }
  },
  "uptime": 123.456
}
```

## Response Fields

### Root Level

| Field | Type | Description |
|-------|------|-------------|
| `status` | `"ok" \| "error"` | Overall health status |
| `timestamp` | `string` | ISO 8601 timestamp of the health check |
| `environment` | `string` | Current environment (development, production, test) |
| `checks` | `object` | Individual health check results |
| `uptime` | `number` | Process uptime in seconds |
| `version` | `string` | Node.js version (development only) |
| `platform` | `string` | OS platform (development only) |

### Database Check

| Field | Type | Description |
|-------|------|-------------|
| `status` | `"ok" \| "error"` | Database connection status |
| `message` | `string` | Human-readable status message |

### Configuration Check

| Field | Type | Description |
|-------|------|-------------|
| `status` | `"ok" \| "error"` | Configuration validation status |
| `message` | `string` | Human-readable status or error details |
| `missing` | `string[]` | List of missing environment variables (only present on error) |

## Validated Configuration

The health check validates the following environment variables:

| Variable | Validation |
|----------|-----------|
| `PORT` | Required, must be a number between 1-65535 |
| `NODE_ENV` | Required, must be one of: development, production, test |
| `DATABASE_URL` | Required, must start with `mysql://` |

## Usage Examples

### cURL

```bash
# Check health (replace {PORT} with your PORT value)
curl http://localhost:{PORT}/health

# Check health with status code
curl -w "\nHTTP Status: %{http_code}\n" http://localhost:{PORT}/health
```

### Docker Healthcheck

```dockerfile
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT}/health || exit 1
```

### Kubernetes Liveness Probe

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: YOUR_BACKEND_PORT  # Replace with your PORT value
  initialDelaySeconds: 10
  periodSeconds: 30
  timeoutSeconds: 5
  failureThreshold: 3
```

### Kubernetes Readiness Probe

```yaml
readinessProbe:
  httpGet:
    path: /health
    port: YOUR_BACKEND_PORT  # Replace with your PORT value
  initialDelaySeconds: 5
  periodSeconds: 10
  timeoutSeconds: 3
  failureThreshold: 3
```

### Load Balancer (AWS ALB)

```hcl
resource "aws_lb_target_group" "app" {
  name     = "app-target-group"
  port     = YOUR_BACKEND_PORT  # Replace with your PORT value
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id

  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 5
    path                = "/health"
    interval            = 30
    matcher             = "200"
  }
}
```

### Node.js Monitoring Script

```javascript
const fetch = require('node-fetch');

// Replace YOUR_BACKEND_PORT with your PORT value
const PORT = process.env.PORT || 'YOUR_BACKEND_PORT';

async function checkHealth() {
  try {
    const response = await fetch(`http://localhost:${PORT}/health`);
    const data = await response.json();
    
    if (data.status === 'ok') {
      console.log('✅ Service is healthy');
      return true;
    } else {
      console.error('❌ Service is unhealthy:', data);
      return false;
    }
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
}

// Check every 30 seconds
setInterval(checkHealth, 30000);
```

### Shell Script Monitoring

```bash
#!/bin/bash

# Replace YOUR_BACKEND_PORT with your PORT value
ENDPOINT="http://localhost:YOUR_BACKEND_PORT/health"
MAX_RETRIES=3
RETRY_DELAY=5

for i in $(seq 1 $MAX_RETRIES); do
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$ENDPOINT")
  
  if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Health check passed"
    exit 0
  fi
  
  echo "❌ Health check failed (attempt $i/$MAX_RETRIES)"
  
  if [ $i -lt $MAX_RETRIES ]; then
    sleep $RETRY_DELAY
  fi
done

echo "❌ Health check failed after $MAX_RETRIES attempts"
exit 1
```

## Monitoring Best Practices

### 1. Check Frequency

- **Development:** Every 30-60 seconds
- **Production:** Every 10-30 seconds
- **Critical Services:** Every 5-10 seconds

### 2. Timeout Configuration

- Set timeout to 3-5 seconds
- Ensure it's shorter than check interval
- Consider network latency

### 3. Failure Thresholds

- Require 2-3 consecutive failures before marking unhealthy
- Prevents false positives from transient issues
- Balance between quick detection and stability

### 4. Startup Period

- Allow 5-10 seconds for application startup
- Don't check health during initialization
- Prevents premature restarts

### 5. Alerting

Alert on:

- ✅ Multiple consecutive failures (3+)
- ✅ Database connectivity issues
- ✅ Configuration errors
- ✅ High response times (>1s)

Don't alert on:

- ❌ Single failures (could be transient)
- ❌ During deployments
- ❌ Planned maintenance windows

### 6. Logging

Log health check failures including:

- Timestamp
- Failed checks (database, configuration)
- Error messages
- Request/response details

## Troubleshooting

### Health Check Returns 503

**Possible Causes:**

1. **Database Connection Failed**

   ```json
   "database": { "status": "error", "message": "Connection refused" }
   ```

   - Check database is running
   - Verify DATABASE_URL is correct
   - Check network connectivity
   - Verify database credentials

2. **Configuration Invalid**

   ```json
   "configuration": { 
     "status": "error", 
     "message": "Missing: DATABASE_URL" 
   }
   ```

   - Check .env file exists
   - Verify all required variables are set
   - Restart application after fixing

### Health Check Timeout

- Check server is running: `curl http://localhost:{PORT}/api`
- Increase timeout in monitoring system
- Check server logs for blocking operations
- Verify database isn't overloaded

### Intermittent Failures

- Database connection pool exhausted
- Network issues between app and database
- Server under heavy load
- Consider increasing connection pool size

## Security Considerations

### Production Environment

The health check:

- ✅ Does NOT expose sensitive data (passwords, keys)
- ✅ Only shows generic error messages
- ✅ Validates configuration without revealing values
- ❌ Does NOT include version/platform info in production

### Development Environment

Additional debug information included:

- Node.js version
- OS platform
- Detailed error messages

### Recommendations

1. **Don't expose to public internet** - Use internal load balancer
2. **Rate limit if public** - Prevent abuse
3. **Monitor for excessive calls** - Could indicate attack
4. **Use authentication if needed** - Add API key validation

## Related Documentation

- [ENV_VALIDATION.md](./ENV_VALIDATION.md) - Environment variable validation details
- [../frontend/env.example](../frontend/env.example) and [../env.example](../env.example) - Environment templates
- [../server/index.ts](../server/index.ts) - Health check implementation

## Changes from Previous Version

### ✨ New Features

- ✅ Configuration validation (all required env vars)
- ✅ Detailed validation messages
- ✅ Missing variable tracking
- ✅ Uptime reporting
- ✅ Development-only debug info

### 🔧 Breaking Changes

- Response format changed (added `checks` object)
- Returns 503 on configuration errors (previously didn't check)

---

**Last Updated:** October 2025  
**Version:** 2.0
