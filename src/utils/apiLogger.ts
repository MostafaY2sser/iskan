/**
 * API Logger Utility
 * Provides comprehensive logging for API requests and responses
 * Only active in development mode
 */

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';

// Logger configuration
interface LoggerConfig {
  enabled: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  showRequestData: boolean;
  showResponseData: boolean;
  showHeaders: boolean;
  showTiming: boolean;
  maxDataLength: number;
}

const defaultConfig: LoggerConfig = {
  enabled: isDevelopment,
  logLevel: 'debug',
  showRequestData: true,
  showResponseData: true,
  showHeaders: true,
  showTiming: true,
  maxDataLength: 1000, // Truncate long data
};

// Request/Response data interface
interface LogData {
  method: string;
  url: string;
  endpoint: string;
  headers?: Record<string, string>;
  requestData?: any;
  responseData?: any;
  status?: number;
  statusText?: string;
  duration?: number;
  timestamp: string;
  error?: any;
}

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
};

class ApiLogger {
  private config: LoggerConfig;
  private requestStartTimes: Map<string, number> = new Map();

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Log API request
   */
  logRequest(data: Omit<LogData, 'responseData' | 'status' | 'statusText' | 'duration' | 'error'>): void {
    if (!this.config.enabled) return;

    const requestId = this.generateRequestId(data.method, data.endpoint);
    this.requestStartTimes.set(requestId, Date.now());

    const logData: LogData = {
      ...data,
      timestamp: new Date().toISOString(),
    };

    this.log('🚀 API REQUEST', logData, 'blue');
  }

  /**
   * Log API response
   */
  logResponse(data: Omit<LogData, 'requestData' | 'error'>): void {
    if (!this.config.enabled) return;

    const requestId = this.generateRequestId(data.method, data.endpoint);
    const startTime = this.requestStartTimes.get(requestId);
    const duration = startTime ? Date.now() - startTime : undefined;
    
    // Clean up
    this.requestStartTimes.delete(requestId);

    const logData: LogData = {
      ...data,
      duration,
      timestamp: new Date().toISOString(),
    };

    const isSuccess = data.status && data.status >= 200 && data.status < 300;
    const logLevel = isSuccess ? 'green' : 'red';
    const emoji = isSuccess ? '✅' : '❌';

    this.log(`${emoji} API RESPONSE`, logData, logLevel);
  }

  /**
   * Log API error
   */
  logError(data: Omit<LogData, 'responseData' | 'status' | 'statusText' | 'duration'>): void {
    if (!this.config.enabled) return;

    const requestId = this.generateRequestId(data.method, data.endpoint);
    const startTime = this.requestStartTimes.get(requestId);
    const duration = startTime ? Date.now() - startTime : undefined;
    
    // Clean up
    this.requestStartTimes.delete(requestId);

    const logData: LogData = {
      ...data,
      duration,
      timestamp: new Date().toISOString(),
    };

    this.log('💥 API ERROR', logData, 'red');
  }

  /**
   * Internal logging method
   */
  private log(title: string, data: LogData, color: keyof typeof colors): void {
    if (!this.config.enabled) return;

    const colorCode = colors[color];
    const resetCode = colors.reset;

    console.group(`${colorCode}${colors.bright}${title}${resetCode}`);
    
    // Basic info
    console.log(`${colors.cyan}Method:${resetCode} ${colors.bright}${data.method}${resetCode}`);
    console.log(`${colors.cyan}URL:${resetCode} ${colors.bright}${data.url}${resetCode}`);
    console.log(`${colors.cyan}Endpoint:${resetCode} ${colors.bright}${data.endpoint}${resetCode}`);
    console.log(`${colors.cyan}Timestamp:${resetCode} ${colors.dim}${data.timestamp}${resetCode}`);

    // Status (for responses)
    if (data.status) {
      const statusColor = data.status >= 200 && data.status < 300 ? 'green' : 'red';
      console.log(`${colors.cyan}Status:${resetCode} ${colors[statusColor]}${data.status} ${data.statusText || ''}${resetCode}`);
    }

    // Duration
    if (data.duration !== undefined && this.config.showTiming) {
      const durationColor = data.duration < 1000 ? 'green' : data.duration < 3000 ? 'yellow' : 'red';
      console.log(`${colors.cyan}Duration:${resetCode} ${colors[durationColor]}${data.duration}ms${resetCode}`);
    }

    // Headers
    if (data.headers && this.config.showHeaders) {
      console.group(`${colors.cyan}Headers:${resetCode}`);
      Object.entries(data.headers).forEach(([key, value]) => {
        // Hide sensitive headers in logs
        const isSensitive = ['authorization', 'cookie', 'x-api-key'].includes(key.toLowerCase());
        const displayValue = isSensitive ? '***' : value;
        console.log(`${colors.dim}${key}:${resetCode} ${displayValue}`);
      });
      console.groupEnd();
    }

    // Request data
    if (data.requestData && this.config.showRequestData) {
      console.group(`${colors.cyan}Request Data:${resetCode}`);
      this.logData(data.requestData);
      console.groupEnd();
    }

    // Response data
    if (data.responseData && this.config.showResponseData) {
      console.group(`${colors.cyan}Response Data:${resetCode}`);
      this.logData(data.responseData);
      console.groupEnd();
    }

    // Error data
    if (data.error) {
      console.group(`${colors.red}Error:${resetCode}`);
      console.error(data.error);
      console.groupEnd();
    }

    console.groupEnd();
  }

  /**
   * Log data with truncation
   */
  private logData(data: any): void {
    const resetCode = colors.reset;
    
    if (data === null || data === undefined) {
      console.log(`${colors.dim}null${resetCode}`);
      return;
    }

    if (typeof data === 'string') {
      const truncated = data.length > this.config.maxDataLength 
        ? data.substring(0, this.config.maxDataLength) + '...' 
        : data;
      console.log(`${colors.white}${truncated}${resetCode}`);
      return;
    }

    if (data instanceof FormData) {
      console.log(`${colors.yellow}FormData:${resetCode}`);
      for (const [key, value] of data.entries()) {
        if (value instanceof File) {
          console.log(`${colors.dim}${key}:${resetCode} File(${value.name}, ${value.size} bytes, ${value.type})`);
        } else {
          console.log(`${colors.dim}${key}:${resetCode} ${value}`);
        }
      }
      return;
    }

    try {
      const jsonString = JSON.stringify(data, null, 2);
      const truncated = jsonString.length > this.config.maxDataLength 
        ? jsonString.substring(0, this.config.maxDataLength) + '...' 
        : jsonString;
      console.log(`${colors.white}${truncated}${resetCode}`);
    } catch (error) {
      console.log(`${colors.yellow}[Circular or non-serializable object]${resetCode}`);
    }
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(method: string, endpoint: string): string {
    return `${method}:${endpoint}:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Update logger configuration
   */
  updateConfig(newConfig: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Enable/disable logging
   */
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled && isDevelopment;
  }

  /**
   * Get current configuration
   */
  getConfig(): LoggerConfig {
    return { ...this.config };
  }

  /**
   * Clear all stored request times
   */
  clear(): void {
    this.requestStartTimes.clear();
  }
}

// Create singleton instance
export const apiLogger = new ApiLogger();

// Export types and class for advanced usage
export type { LoggerConfig, LogData };
export { ApiLogger };

// Development-only helper functions
export const devHelpers = {
  /**
   * Enable detailed logging
   */
  enableDetailedLogging: () => {
    if (isDevelopment) {
      apiLogger.updateConfig({
        showRequestData: true,
        showResponseData: true,
        showHeaders: true,
        showTiming: true,
        maxDataLength: 2000,
      });
      console.log('🔧 API Logger: Detailed logging enabled');
    }
  },

  /**
   * Disable sensitive data logging
   */
  disableSensitiveLogging: () => {
    if (isDevelopment) {
      apiLogger.updateConfig({
        showHeaders: false,
        maxDataLength: 500,
      });
      console.log('🔧 API Logger: Sensitive data logging disabled');
    }
  },

  /**
   * Show only errors
   */
  showErrorsOnly: () => {
    if (isDevelopment) {
      apiLogger.updateConfig({
        showRequestData: false,
        showResponseData: false,
        showHeaders: false,
        showTiming: true,
      });
      console.log('🔧 API Logger: Error-only logging enabled');
    }
  },

  /**
   * Reset to default configuration
   */
  resetToDefault: () => {
    if (isDevelopment) {
      apiLogger.updateConfig(defaultConfig);
      console.log('🔧 API Logger: Reset to default configuration');
    }
  },

  /**
   * Get current configuration
   */
  getConfig: () => {
    if (isDevelopment) {
      console.log('🔧 API Logger Configuration:', apiLogger.getConfig());
      return apiLogger.getConfig();
    }
    return null;
  },
};

// Auto-enable in development
if (isDevelopment) {
  console.log('🔧 API Logger initialized for development mode');
  console.log('💡 Use devHelpers to configure logging behavior');
  console.log('💡 Available commands: devHelpers.enableDetailedLogging(), devHelpers.disableSensitiveLogging(), etc.');
}
