import React, { useState, useEffect } from 'react';
import { apiLogger, devHelpers } from '@/utils/apiLogger';

/**
 * Development-only API Logger Control Panel
 * Only renders in development mode
 */
const DevApiLogger: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [config, setConfig] = useState(apiLogger.getConfig());

  // Only render in development
  if (import.meta.env.PROD) {
    return null;
  }

  const updateConfig = (newConfig: Partial<typeof config>) => {
    apiLogger.updateConfig(newConfig);
    setConfig(apiLogger.getConfig());
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      {/* Toggle Button */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
          background: '#2E4166',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '12px',
          fontFamily: 'monospace',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          userSelect: 'none',
        }}
        onClick={toggleVisibility}
        title="API Logger Control Panel"
      >
        🔧 API Logger
      </div>

      {/* Control Panel */}
      {isVisible && (
        <div
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            width: '300px',
            background: 'white',
            border: '1px solid #E8E8E9',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            zIndex: 9998,
            fontFamily: 'monospace',
            fontSize: '12px',
          }}
        >
          <div style={{ marginBottom: '16px', fontWeight: 'bold', color: '#2E4166' }}>
            🔧 API Logger Control Panel
          </div>

          {/* Quick Actions */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Quick Actions:</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button
                onClick={() => {
                  devHelpers.enableDetailedLogging();
                  setConfig(apiLogger.getConfig());
                }}
                style={{
                  padding: '4px 8px',
                  background: '#2E4166',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px',
                }}
              >
                Enable Detailed Logging
              </button>
              <button
                onClick={() => {
                  devHelpers.disableSensitiveLogging();
                  setConfig(apiLogger.getConfig());
                }}
                style={{
                  padding: '4px 8px',
                  background: '#FF6B35',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px',
                }}
              >
                Disable Sensitive Data
              </button>
              <button
                onClick={() => {
                  devHelpers.showErrorsOnly();
                  setConfig(apiLogger.getConfig());
                }}
                style={{
                  padding: '4px 8px',
                  background: '#FF4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px',
                }}
              >
                Show Errors Only
              </button>
              <button
                onClick={() => {
                  devHelpers.resetToDefault();
                  setConfig(apiLogger.getConfig());
                }}
                style={{
                  padding: '4px 8px',
                  background: '#6B7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px',
                }}
              >
                Reset to Default
              </button>
            </div>
          </div>

          {/* Configuration */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Configuration:</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={config.enabled}
                  onChange={(e) => {
                    apiLogger.setEnabled(e.target.checked);
                    setConfig(apiLogger.getConfig());
                  }}
                />
                <span>Enabled</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={config.showRequestData}
                  onChange={(e) => updateConfig({ showRequestData: e.target.checked })}
                />
                <span>Show Request Data</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={config.showResponseData}
                  onChange={(e) => updateConfig({ showResponseData: e.target.checked })}
                />
                <span>Show Response Data</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={config.showHeaders}
                  onChange={(e) => updateConfig({ showHeaders: e.target.checked })}
                />
                <span>Show Headers</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={config.showTiming}
                  onChange={(e) => updateConfig({ showTiming: e.target.checked })}
                />
                <span>Show Timing</span>
              </label>
            </div>
          </div>

          {/* Max Data Length */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ marginBottom: '4px', fontWeight: 'bold' }}>Max Data Length:</div>
            <input
              type="number"
              value={config.maxDataLength}
              onChange={(e) => updateConfig({ maxDataLength: parseInt(e.target.value) || 1000 })}
              style={{
                width: '100%',
                padding: '4px 8px',
                border: '1px solid #E8E8E9',
                borderRadius: '4px',
                fontSize: '11px',
              }}
            />
          </div>

          {/* Log Level */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ marginBottom: '4px', fontWeight: 'bold' }}>Log Level:</div>
            <select
              value={config.logLevel}
              onChange={(e) => updateConfig({ logLevel: e.target.value as any })}
              style={{
                width: '100%',
                padding: '4px 8px',
                border: '1px solid #E8E8E9',
                borderRadius: '4px',
                fontSize: '11px',
              }}
            >
              <option value="debug">Debug</option>
              <option value="info">Info</option>
              <option value="warn">Warn</option>
              <option value="error">Error</option>
            </select>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => {
                apiLogger.clear();
                console.clear();
                console.log('🧹 API Logger: Cleared all logs and request times');
              }}
              style={{
                flex: 1,
                padding: '6px 8px',
                background: '#6B7280',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px',
              }}
            >
              Clear Logs
            </button>
            <button
              onClick={() => {
                console.log('🔧 API Logger Configuration:', config);
              }}
              style={{
                flex: 1,
                padding: '6px 8px',
                background: '#2E4166',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px',
              }}
            >
              Log Config
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={toggleVisibility}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'none',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
              color: '#6B7280',
            }}
          >
            ×
          </button>
        </div>
      )}
    </>
  );
};

export default DevApiLogger;
