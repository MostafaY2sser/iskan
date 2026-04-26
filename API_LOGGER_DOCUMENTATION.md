# API Logger Documentation

## 🔧 Overview

The API Logger is a comprehensive logging system for all API requests and responses in your React application. It provides detailed information about every HTTP request, including request data, response data, headers, timing, and error handling.

## ✨ Key Features

- **Development Only**: Automatically disabled in production builds
- **Comprehensive Logging**: Logs requests, responses, headers, timing, and errors
- **Color-coded Output**: Different colors for different types of logs
- **Configurable**: Customize what gets logged
- **Security Aware**: Hides sensitive headers (Authorization, etc.)
- **Performance Tracking**: Measures request duration
- **Error Handling**: Detailed error logging with stack traces
- **Interactive Control Panel**: Visual interface to control logging behavior

## 🚀 Quick Start

The API Logger is automatically integrated into your API client. No additional setup required!

### In Development Mode:
- All API requests are automatically logged
- Control panel appears in bottom-right corner
- Detailed logs in browser console

### In Production Mode:
- No logging occurs
- No performance impact
- No console output

## 📊 What Gets Logged

### Request Information:
- HTTP Method (GET, POST, PUT, DELETE, etc.)
- Full URL and endpoint
- Request headers (sensitive ones hidden)
- Request body/data
- Timestamp

### Response Information:
- HTTP Status code and status text
- Response headers
- Response data
- Request duration
- Timestamp

### Error Information:
- Error type and message
- HTTP status code
- Error response data
- Stack trace (if available)
- Request duration

## 🎨 Console Output Examples

### Successful Request:
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

## 🎛️ Control Panel

In development mode, you'll see a "🔧 API Logger" button in the bottom-right corner. Click it to open the control panel.

### Quick Actions:
- **Enable Detailed Logging**: Shows all data with increased limits
- **Disable Sensitive Data**: Hides headers and limits data length
- **Show Errors Only**: Only logs errors and timing
- **Reset to Default**: Restores default configuration

### Configuration Options:
- **Enabled**: Turn logging on/off
- **Show Request Data**: Include request body in logs
- **Show Response Data**: Include response body in logs
- **Show Headers**: Include HTTP headers in logs
- **Show Timing**: Include request duration
- **Max Data Length**: Limit data length to prevent console spam
- **Log Level**: Set minimum log level (debug, info, warn, error)

## 💻 Programmatic Usage

### Basic Usage:
```typescript
import { apiLogger, devHelpers } from '@/utils/apiLogger';

// Enable detailed logging
devHelpers.enableDetailedLogging();

// Disable sensitive data logging
devHelpers.disableSensitiveLogging();

// Show only errors
devHelpers.showErrorsOnly();

// Reset to default
devHelpers.resetToDefault();

// Get current configuration
const config = devHelpers.getConfig();
console.log(config);
```

### Advanced Configuration:
```typescript
import { apiLogger } from '@/utils/apiLogger';

// Update specific settings
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

// Clear stored request times
apiLogger.clear();
```

## 🔒 Security Features

### Sensitive Data Protection:
- Authorization headers are automatically hidden (shown as `***`)
- Cookie headers are hidden
- API key headers are hidden
- Long data is truncated to prevent console spam

### Production Safety:
- Completely disabled in production builds
- No performance impact in production
- No sensitive data exposure in production

## 📱 Browser Console Integration

The logger integrates seamlessly with browser dev tools:

### Console Groups:
- Each request/response is grouped for easy navigation
- Collapsible sections for better organization
- Color-coded for quick identification

### Console Methods:
- Uses `console.group()` for organization
- Uses `console.log()` for data
- Uses `console.error()` for errors
- Uses `console.groupEnd()` for cleanup

## 🎯 Use Cases

### Development:
- Debug API integration issues
- Monitor request/response data
- Track performance metrics
- Identify authentication problems
- Debug error responses

### Testing:
- Verify API calls are made correctly
- Check request payloads
- Validate response data
- Monitor error handling

### Performance Analysis:
- Track request durations
- Identify slow endpoints
- Monitor timeout issues
- Analyze network patterns

## 🛠️ Customization

### Custom Logger Configuration:
```typescript
import { ApiLogger } from '@/utils/apiLogger';

// Create custom logger instance
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

### Custom Log Formatting:
The logger automatically handles:
- JSON formatting with proper indentation
- FormData parsing and display
- File object information
- Circular reference detection
- Data truncation for long responses

## 🚨 Error Handling

The logger handles various error scenarios:

### Network Errors:
- Connection timeouts
- Network failures
- DNS resolution errors
- CORS issues

### HTTP Errors:
- 4xx client errors
- 5xx server errors
- Custom error responses
- Validation errors

### Parsing Errors:
- Invalid JSON responses
- Malformed data
- Encoding issues

## 📈 Performance Impact

### Development Mode:
- Minimal performance impact
- Efficient data processing
- Smart truncation prevents memory issues
- Automatic cleanup of stored data

### Production Mode:
- Zero performance impact
- No code execution
- No memory usage
- No console output

## 🔧 Troubleshooting

### Logger Not Working:
1. Check if you're in development mode
2. Verify the logger is enabled in control panel
3. Check browser console for any errors
4. Ensure API calls are going through the main API client

### Too Much Logging:
1. Use "Show Errors Only" quick action
2. Reduce max data length
3. Disable request/response data
4. Increase log level to 'warn' or 'error'

### Missing Data:
1. Enable "Show Request Data" and "Show Response Data"
2. Increase max data length
3. Check if data is being truncated
4. Verify API endpoints are returning data

## 🎉 Benefits

1. **Faster Debugging**: See exactly what's being sent and received
2. **Better Error Handling**: Detailed error information with context
3. **Performance Monitoring**: Track request durations and identify bottlenecks
4. **Security Awareness**: Automatic hiding of sensitive data
5. **Production Safety**: Zero impact on production builds
6. **Easy Configuration**: Visual control panel for quick adjustments
7. **Comprehensive Coverage**: Logs all API interactions automatically

## 📝 Notes

- The logger is automatically integrated into your existing API client
- No changes needed to your existing API calls
- Works with all HTTP methods (GET, POST, PUT, DELETE, PATCH)
- Supports file uploads and FormData
- Handles both JSON and text responses
- Automatically manages request timing and cleanup

This API Logger provides a powerful debugging and monitoring tool that will significantly improve your development experience while maintaining security and performance in production.
