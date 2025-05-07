"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import api from "@/lib/api";
import { registerWebSocket, unregisterWebSocket } from "@/features/websocket";
import { useChild } from "@/contexts/ChildContext";

interface PingPongGameProps {
  onGameOver: (score: number) => void;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export default function PingPongGame({ onGameOver, difficulty: initialDifficulty }: PingPongGameProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [gameState, setGameState] = useState({
    score: 0,
    leftScore: 0,
    rightScore: 0,
    gameActive: false,
    gameOver: false,
    currentSpeed: 1
  });
  const [gameId, setGameId] = useState<string | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>(initialDifficulty);
  const [isProcessingFrame, setIsProcessingFrame] = useState(false);
  const [detectedHands, setDetectedHands] = useState<{
    left: { x: number, y: number } | null,
    right: { x: number, y: number } | null
  }>({ left: null, right: null });
  const [frameImage, setFrameImage] = useState<string | null>(null);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const gameCreatedRef = useRef(false);
  const processingGameOverRef = useRef(false);
  const { selectedChildId } = useChild();
  const [savedGameResult, setSavedGameResult] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [gameDimensions, setGameDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  
  // Update game dimensions on resize
  useEffect(() => {
    const handleResize = () => {
      setGameDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const createGame = async () => {
    try {
      if (!selectedChildId) {
        console.error("No child selected");
        setSaveError("No child selected. Please select a child from the header menu first.");
        return;
      }

      console.log("Creating new PingPong game with difficulty:", difficulty);
      
      if (wsRef.current) {
        console.log("Cleaning up existing WebSocket connection");
        if (connectionId) {
          unregisterWebSocket(connectionId);
          setConnectionId(null);
        }
        
        if (wsRef.current.readyState === WebSocket.OPEN || 
            wsRef.current.readyState === WebSocket.CONNECTING) {
          wsRef.current.close(1000, "Game recreated with new settings");
        }
        
        wsRef.current = null;
        setSocketConnected(false);
      }

      setFrameImage(null);
      setGameState({
        score: 0,
        leftScore: 0,
        rightScore: 0,
        gameActive: false,
        gameOver: false,
        currentSpeed: 1
      });
      
      gameCreatedRef.current = true;

      const response = await api.post('/games/game/start', {
        game_type: 'ping_pong',
        difficulty: difficulty,
        child_id: selectedChildId
      });
      
      if (response.data && response.data.game_id) {
        console.log("Game created with ID:", response.data.game_id);
        setGameId(response.data.game_id);
        
        setTimeout(() => {
          console.log("Connecting to WebSocket after delay");
          connectWebSocket(response.data.game_id);
        }, 500);
      } else {
        console.error("Game creation failed: No game_id in response");
        gameCreatedRef.current = false;
      }
    } catch (error) {
      console.error('Error creating game:', error);
      
      setSocketConnected(false);
      wsRef.current = null;
      gameCreatedRef.current = false;
    }
  };
  
  const connectWebSocket = (id: string) => {
    if (wsRef.current) {
      if (connectionId) {
        unregisterWebSocket(connectionId);
        setConnectionId(null);
      }
      
      if (wsRef.current.readyState === WebSocket.OPEN || 
          wsRef.current.readyState === WebSocket.CONNECTING) {
        wsRef.current.close(1000, "Reconnecting to new game session");
      }
      
      wsRef.current = null;
    }
    
    setGameId(id);
    localStorage.setItem("ping_pong_game_id", id);
    setSocketConnected(false);
    
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("Authentication token not found");
      alert("Your session has expired. Please log in again.");
      window.location.href = "/login";
      return;
    }
    
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = window.location.hostname === 'localhost' ? 'localhost:8000' : window.location.host;
    const ws = new WebSocket(`${protocol}://${host}/games/game/${id}/ws?token=${token}`);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setSocketConnected(true);
      
      // Start the game automatically when websocket connects
      startGame();
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'game_state') {
        setFrameImage(data.data.frame);
        const newGameState = {
          score: data.data.score,
          leftScore: data.data.left_score,
          rightScore: data.data.right_score,
          gameActive: data.data.game_active,
          gameOver: data.data.game_over,
          currentSpeed: data.data.current_speed
        };
        
        if (newGameState.gameOver && !gameState.gameOver) {
          console.log("Game just ended - calling onGameOver with score:", newGameState.score);
          setTimeout(() => {
            onGameOver(newGameState.score);
            closeWebSocketConnection();
          }, 1000);
        }
        
        setGameState(newGameState);
      } else if (data.type === 'hand_tracking_result') {
        setDetectedHands({
          left: data.data.left ? { x: data.data.left.position.x, y: data.data.left.position.y } : null,
          right: data.data.right ? { x: data.data.right.position.x, y: data.data.right.position.y } : null
        });
      }
    };
    
    ws.onclose = (event) => {
      console.log('WebSocket disconnected', event.code, event.reason);
      setSocketConnected(false);
      
      if (event.code !== 1000 && event.code !== 1001) {
        console.log("Attempting to reconnect in 1 second...");
        setTimeout(() => {
          if (gameId === id) {
            connectWebSocket(id);
          }
        }, 1000);
      }
    };
    
    ws.onerror = (error: Event) => {
      console.error('WebSocket error occurred');
    };
    
    wsRef.current = ws;
    
    const cleanupCallback = () => {
      console.log("Cleaning up PingPong game resources");
    };
    
    const newConnectionId = registerWebSocket(ws, cleanupCallback);
    setConnectionId(newConnectionId);
  };
  
  const startGame = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log("Sending start_game event to server with dimensions:", gameDimensions);
      wsRef.current.send(JSON.stringify({
        type: 'start_game',
        data: {
          screen_width: gameDimensions.width,
          screen_height: gameDimensions.height
        }
      }));
    }
  };
  
  // Initialize camera and create game
  useEffect(() => {
    const startCamera = async () => {
      try {
        if (!videoRef.current?.srcObject) {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              width: 640,
              height: 480,
              facingMode: 'user' 
            } 
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }
      } catch (err: any) {
        setCameraError("Could not access the camera: " + err.message);
      }
    };

    startCamera();
    
    if (selectedChildId) {
      createGame();
    }
    
    return () => {
      if (connectionId) {
        unregisterWebSocket(connectionId);
        setConnectionId(null);
      } else if (wsRef.current) {
        wsRef.current.close();
      }
      
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [selectedChildId]);
  
  // Set up hand tracking via WebSocket
  useEffect(() => {
    if (!videoRef.current || !socketConnected || !wsRef.current) return;
    
    let processingActive = false;
    const intervalId = setInterval(async () => {
      if (processingActive || 
          !videoRef.current || 
          videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA ||
          !wsRef.current ||
          wsRef.current.readyState !== WebSocket.OPEN) {
        return;
      }
      
      processingActive = true;
      setIsProcessingFrame(true);
      
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          
          const imageData = canvas.toDataURL('image/jpeg', 0.7);
          
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
              type: 'hand_tracking_image',
              data: {
                image: imageData
              }
            }));
          }
        }
      } catch (error) {
        console.error('Error processing frame:', error);
      } finally {
        setIsProcessingFrame(false);
        processingActive = false;
      }
    }, 100); 
    
    return () => {
      clearInterval(intervalId);
    };
  }, [socketConnected, gameId, difficulty]);
  
  const closeWebSocketConnection = useCallback(() => {
    console.log("Cleaning up WebSocket connection after game over");
    
    if (connectionId) {
      unregisterWebSocket(connectionId);
      setConnectionId(null);
    }
    
    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN || 
          wsRef.current.readyState === WebSocket.CONNECTING) {
        wsRef.current.close(1000, "Game over, cleaning up");
      }
      wsRef.current = null;
    }
    
    setSocketConnected(false);
  }, [connectionId]);
  
  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden">
      {/* Camera background - full screen */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
      />
      
      {/* Game overlay - full screen without border */}
      <div className="absolute inset-0 w-full h-full">
        {frameImage ? (
          <img 
            src={frameImage} 
            alt="Ping Pong Game" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black bg-opacity-50">
            <p className="text-white text-xl">Loading game...</p>
          </div>
        )}
      </div>
      
      {/* Score display - overlay on top */}
      <div className="absolute top-4 left-4 right-4 flex justify-between z-50">
        <div className="bg-red-100 bg-opacity-90 text-red-800 p-3 rounded-lg">
          <p className="text-lg font-bold">Left: {gameState.leftScore}</p>
        </div>
        
        <div className="bg-blue-100 bg-opacity-90 text-blue-800 p-3 rounded-lg">
          <p className="text-lg font-bold">Total: {gameState.score}</p>
        </div>
        
        <div className="bg-green-100 bg-opacity-90 text-green-800 p-3 rounded-lg">
          <p className="text-lg font-bold">Right: {gameState.rightScore}</p>
        </div>
      </div>
      
      {/* Error display */}
      {cameraError && (
        <div className="absolute top-4 left-4 right-4 bg-red-500 text-white p-4 rounded-lg z-50">
          {cameraError}
        </div>
      )}
    </div>
  );
}