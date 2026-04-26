# API Logger Usage Examples

## 🚀 Basic Usage

The API Logger is automatically integrated into your API client. No additional code needed!

```typescript
// This will automatically be logged
import { authApi } from '@/api';

// Login request - automatically logged
const response = await authApi.login({
  email: 'user@example.com',
  password: 'password123'
});

// Registration request - automatically logged
const registration = await authApi.registerCustomer({
  email: 'newuser@example.com',
  password: 'password123',
  user_type: 'customer',
  company_name: 'My Company'
});
```

## 🎛️ Control Panel Usage

### In Development Mode:
1. Look for the "🔧 API Logger" button in the bottom-right corner
2. Click it to open the control panel
3. Use quick actions or configure individual settings

### Quick Actions:
```typescript
// These are available in the browser console
import { devHelpers } from '@/utils/apiLogger';

// Enable detailed logging
devHelpers.enableDetailedLogging();

// Disable sensitive data logging
devHelpers.disableSensitiveLogging();

// Show only errors
devHelpers.showErrorsOnly();

// Reset to default
devHelpers.resetToDefault();
```

## 📊 Console Output Examples

### Successful Login Request:
```
🚀 API REQUEST
Method: POST
URL: https://grh.sa/api/auth/login
Endpoint: /auth/login
Timestamp: 2024-01-15T10:30:00.000Z
Headers:
  content-type: application/json
  authorization: ***
Request Data:
{
  "email": "user@example.com",
  "password": "password123"
}

✅ API RESPONSE
Method: POST
URL: https://grh.sa/api/auth/login
Endpoint: /auth/login
Status: 200 OK
Duration: 245ms
Timestamp: 2024-01-15T10:30:00.245Z
Response Data:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "user_type": "customer"
}
```

### File Upload Request:
```
🚀 API REQUEST
Method: POST
URL: https://grh.sa/api/uploads/documents/signup
Endpoint: /uploads/documents/signup
Timestamp: 2024-01-15T10:30:00.000Z
Headers:
  authorization: ***
Request Data:
FormData:
  file: File(national_id.pdf, 245760 bytes, application/pdf)
  doc_type: National ID
  expiry_date: 2025-12-31

✅ API RESPONSE
Method: POST
URL: https://grh.sa/api/uploads/documents/signup
Endpoint: /uploads/documents/signup
Status: 201 Created
Duration: 1234ms
Timestamp: 2024-01-15T10:30:01.234Z
Response Data:
{
  "id": 1,
  "file_path": "documents/signup/user_123/national_id.pdf",
  "entity_type": "documents",
  "entity_id": 1,
  "uploaded_at": "2024-01-15T10:30:01.234Z"
}
```

### Error Request:
```
🚀 API REQUEST
Method: POST
URL: https://grh.sa/api/auth/login
Endpoint: /auth/login
Timestamp: 2024-01-15T10:30:00.000Z
Request Data:
{
  "email": "invalid@example.com",
  "password": "wrongpassword"
}

❌ API RESPONSE
Method: POST
URL: https://grh.sa/api/auth/login
Endpoint: /auth/login
Status: 401 Unauthorized
Duration: 156ms
Timestamp: 2024-01-15T10:30:00.156Z
Response Data:
{
  "detail": "Invalid credentials"
}
```

## 🔧 Advanced Configuration

### Custom Logger Instance:
```typescript
import { ApiLogger } from '@/utils/apiLogger';

// Create custom logger
const customLogger = new ApiLogger({
  enabled: true,
  logLevel: 'info',
  showRequestData: true,
  showResponseData: false,
  showHeaders: true,
  showTiming: true,
  maxDataLength: 500
});
```

### Programmatic Configuration:
```typescript
import { apiLogger } from '@/utils/apiLogger';

// Update configuration
apiLogger.updateConfig({
  showRequestData: true,
  showResponseData: true,
  showHeaders: false,
  showTiming: true,
  maxDataLength: 2000,
  logLevel: 'debug'
});

// Enable/disable logging
apiLogger.setEnabled(true);

// Clear stored data
apiLogger.clear();
```

## 🎯 Use Cases

### Debugging API Issues:
```typescript
// Enable detailed logging to debug
devHelpers.enableDetailedLogging();

// Make API call
const response = await authApi.login(credentials);

// Check console for detailed request/response data
```

### Performance Monitoring:
```typescript
// Enable timing to monitor performance
apiLogger.updateConfig({
  showTiming: true,
  showRequestData: false,
  showResponseData: false
});

// Make API calls and check duration in console
```

### Error Investigation:
```typescript
// Show only errors for debugging
devHelpers.showErrorsOnly();

// Make API calls - only errors will be logged
```

### Security Testing:
```typescript
// Disable sensitive data logging
devHelpers.disableSensitiveLogging();

// Make API calls - headers and sensitive data hidden
```

## 🚨 Production Safety

### Automatic Disabling:
```typescript
// In production builds, this does nothing
import { devHelpers } from '@/utils/apiLogger';

devHelpers.enableDetailedLogging(); // No effect in production
apiLogger.setEnabled(true); // No effect in production
```

### Environment Check:
```typescript
// Check if logger is active
const isDevelopment = import.meta.env.DEV;
const isLoggerEnabled = apiLogger.getConfig().enabled;

console.log('Development mode:', isDevelopment);
console.log('Logger enabled:', isLoggerEnabled);
```

## 📱 Browser Integration

### Console Groups:
- Each request/response is grouped
- Collapsible sections for organization
- Color-coded for quick identification

### Console Methods:
- Uses native browser console methods
- Integrates with browser dev tools
- Supports console filtering and searching

## 🔍 Troubleshooting

### Logger Not Working:
1. Check if you're in development mode
2. Open browser console and look for "🔧 API Logger initialized"
3. Check if the control panel button is visible
4. Verify API calls are going through the main API client

### Too Much Logging:
1. Use "Show Errors Only" in control panel
2. Reduce max data length
3. Disable request/response data
4. Increase log level

### Missing Data:
1. Enable "Show Request Data" and "Show Response Data"
2. Increase max data length
3. Check if data is being truncated
4. Verify API endpoints are returning data

## 🎉 Benefits

1. **Zero Setup**: Works automatically with existing API calls
2. **Development Only**: No impact on production
3. **Comprehensive**: Logs everything about API interactions
4. **Configurable**: Customize what gets logged
5. **Secure**: Hides sensitive data automatically
6. **Performance**: Tracks request timing
7. **Visual**: Color-coded console output
8. **Interactive**: Control panel for easy configuration

The API Logger provides powerful debugging capabilities while maintaining security and performance in production!
