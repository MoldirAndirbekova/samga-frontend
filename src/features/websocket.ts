// WebSocket connection management utility
// This utility handles WebSocket connections and ensures they are properly closed on route changes

type WebSocketCloseCallback = () => void;

// Store active WebSocket connections
const activeConnections: Map<string, WebSocket> = new Map();
const closeCallbacks: Map<string, WebSocketCloseCallback> = new Map();

/**
 * Registers a WebSocket connection and returns a connection ID
 * @param ws The WebSocket connection to register
 * @param closeCallback Optional callback to run when connection is closed
 * @returns A unique connection ID for this WebSocket
 */
export const registerWebSocket = (ws: WebSocket, closeCallback?: WebSocketCloseCallback): string => {
  const connectionId = generateConnectionId();
  activeConnections.set(connectionId, ws);
  
  if (closeCallback) {
    closeCallbacks.set(connectionId, closeCallback);
  }
  
  return connectionId;
};

/**
 * Removes a WebSocket connection from the active connections
 * @param connectionId The connection ID to unregister
 * @param closeWebSocket Whether to close the WebSocket connection too (default: true)
 */
export const unregisterWebSocket = (connectionId: string, closeWebSocket: boolean = true): void => {
  const ws = activeConnections.get(connectionId);
  
  if (ws) {
    if (closeWebSocket) {
      // Send a close message to the server
      try {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: 'close_game',
            data: {}
          }));
        }
      } catch (e) {
        console.error('Error sending close message:', e);
      }
      
      // Close the WebSocket connection
      ws.close();
    }
    
    // Run close callback if exists
    const callback = closeCallbacks.get(connectionId);
    if (callback) {
      try {
        callback();
      } catch (e) {
        console.error('Error running close callback:', e);
      }
      closeCallbacks.delete(connectionId);
    }
    
    // Remove from active connections
    activeConnections.delete(connectionId);
  }
};

/**
 * Closes all active WebSocket connections
 */
export const closeAllWebSockets = (): void => {
  activeConnections.forEach((_, connectionId) => {
    unregisterWebSocket(connectionId);
  });
};

/**
 * Generate a unique connection ID
 */
const generateConnectionId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}; 