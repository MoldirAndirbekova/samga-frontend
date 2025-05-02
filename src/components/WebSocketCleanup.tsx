'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { closeAllWebSockets } from '@/features/websocket';

/**
 * Component that listens for route changes and cleans up WebSocket connections.
 * Embed this in your layout file to ensure WebSockets are closed when navigation happens.
 */
export default function WebSocketCleanup() {
  const pathname = usePathname();

  useEffect(() => {
    // Run when route changes
    return () => {
      // Close all active WebSockets when navigating away
      closeAllWebSockets();
    };
  }, [pathname]);

  // This component doesn't render anything
  return null;
} 