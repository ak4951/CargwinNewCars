import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

export const useOfferUpdates = (offerId, onUpdate) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Get WebSocket URL (remove /api prefix, add /ws)
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const wsUrl = backendUrl.replace('/api', '') + '/ws';
    
    // Connect to Socket.IO
    socketRef.current = io(wsUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('✅ WebSocket connected');
      setIsConnected(true);
      
      // Subscribe to specific offer updates
      if (offerId) {
        socket.emit('subscribe_to_offer', { offer_id: offerId });
      }
    });

    socket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
      setIsConnected(false);
    });

    socket.on('offer_update', (data) => {
      console.log('📡 Offer update received:', data);
      if (data.offer_id === offerId && onUpdate) {
        onUpdate(data.offer);
      }
    });

    socket.on('connected', (data) => {
      console.log('Server message:', data.message);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [offerId, onUpdate]);

  return { isConnected };
};

export const useOffersListUpdates = (onUpdate) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const wsUrl = backendUrl.replace('/api', '') + '/ws';
    
    socketRef.current = io(wsUrl, {
      transports: ['websocket', 'polling']
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('offers_list_update', (data) => {
      console.log('📡 Offers list update:', data);
      if (onUpdate) {
        onUpdate();
      }
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [onUpdate]);

  return { isConnected };
};
