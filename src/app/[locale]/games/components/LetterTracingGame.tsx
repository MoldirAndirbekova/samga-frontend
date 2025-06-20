"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import api from "@/lib/api";
import { registerWebSocket, unregisterWebSocket } from "@/features/websocket";
import { useChild } from "@/contexts/ChildContext";
import PauseResumeButtons from "@/components/PauseResumeButtonsProps";

interface LetterTracingGameProps {
  onGameOver: (score: number) => void;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export default function LetterTracingGame({ onGameOver, difficulty: initialDifficulty }: LetterTracingGameProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [gameState, setGameState] = useState({
    currentLetter: 'A',
    progress: 0,
    lettersCompleted: 0,
    gameActive: false,
    gameOver: false,
    showCongrats: false
  });
  const [gameId, setGameId] = useState<string | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [isProcessingFrame, setIsProcessingFrame] = useState(false);
  const [frameImage, setFrameImage] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>(initialDifficulty);
  const wsRef = useRef<WebSocket | null>(null);
  const gameCreatedRef = useRef(false);
  const processingGameOverRef = useRef(false);
  const { selectedChildId } = useChild();
  const [savedGameResult, setSavedGameResult] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [gameDimensions, setGameDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  
  // Add pause state
  const [isPaused, setIsPaused] = useState(false);
  const [showPauseMenu, setShowPauseMenu] = useState(false);
  
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

      console.log("Creating new Letter Tracing game with difficulty:", difficulty);
      
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

      // Reset pause state
      setFrameImage(null);
      setGameState({
        currentLetter: 'A',
        progress: 0,
        lettersCompleted: 0,
        gameActive: false,
        gameOver: false,
        showCongrats: false
      });
      setIsPaused(false);
      setShowPauseMenu(false);
      
      gameCreatedRef.current = true;

      const response = await api.post('/games/game/start', {
        game_type: 'letter_tracing',
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
    localStorage.setItem("letter_tracing_game_id", id);
    setSocketConnected(false);
    
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("Authentication token not found");
      alert("Your session has expired. Please log in again.");
      window.location.href = "/login";
      return;
    }
    
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    // Extract host and determine protocol
    const backendHost = API_URL.replace(/^https?:\/\//, '');
    const wsProtocol = API_URL.startsWith('https') ? 'wss' : 'ws';
    
    // Create WebSocket connection
    const ws = new WebSocket(`${wsProtocol}://${backendHost}/games/game/${id}/ws?token=${token}`);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setSocketConnected(true);
      
      // Start the game automatically when websocket connects
      startGame();
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'game_state') {
        if (data.data.frame) {
          setFrameImage(data.data.frame);
        }
        
        const newGameState = {
          currentLetter: data.data.current_letter || 'A',
          progress: data.data.fill_progress || 0,
          lettersCompleted: data.data.letters_completed || 0,
          gameActive: data.data.game_active || false,
          gameOver: data.data.game_over || false,
          showCongrats: data.data.show_congrats || false
        };

        if (newGameState.gameOver && !gameState.gameOver) {
          console.log("Game just ended - calling onGameOver with score:", newGameState.lettersCompleted);
          setTimeout(() => {
            onGameOver(newGameState.lettersCompleted);
            closeWebSocketConnection();
          }, 1000);
        }
        
        setGameState(newGameState);
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
      console.log("Cleaning up Letter Tracing game resources");
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
  
  const pauseGame = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      setIsPaused(true);
      setShowPauseMenu(true);
      wsRef.current.send(JSON.stringify({
        type: 'pause_game'
      }));
    }
  };
  
  const resumeGame = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      setIsPaused(false);
      setShowPauseMenu(false);
      wsRef.current.send(JSON.stringify({
        type: 'resume_game'
      }));
    }
  };
  
  const exitGame = () => {
    console.log("Exiting game...");
    closeWebSocketConnection();
    onGameOver(gameState.lettersCompleted);
  };
  
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
    if (!videoRef.current || !socketConnected || !wsRef.current || isPaused) return;
    
    let processingActive = false;
    const intervalId = setInterval(async () => {
      if (processingActive || 
          !videoRef.current || 
          videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA ||
          !wsRef.current ||
          wsRef.current.readyState !== WebSocket.OPEN ||
          isPaused) {
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
          ctx.save();
          ctx.scale(-1, 1);
          ctx.translate(-canvas.width, 0);
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          ctx.restore();
          
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
  }, [socketConnected, gameId, isPaused]);
  
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
            alt="Letter Tracing Game" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black bg-opacity-50">
            <p className="text-white text-xl">Loading game...</p>
          </div>
        )}
      </div>
      
      {/* Score and progress display - overlay on top
      <div className="absolute top-4 left-4 right-4 flex justify-between z-50">
        <div className="bg-blue-100 bg-opacity-90 text-blue-800 p-3 rounded-lg">
          <p className="text-lg font-bold">Letter: {gameState.currentLetter}</p>
        </div>
        
        <div className="bg-green-100 bg-opacity-90 text-green-800 p-3 rounded-lg">
          <p className="text-lg font-bold">Progress: {Math.round(gameState.progress * 100)}%</p>
        </div>
        
        <div className="bg-purple-100 bg-opacity-90 text-purple-800 p-3 rounded-lg">
          <p className="text-lg font-bold">Completed: {gameState.lettersCompleted}/26</p>
        </div>
      </div> */}
      
      {/* Use the common PauseResumeButtons component */}
      <PauseResumeButtons
        onPause={pauseGame}
        onResume={resumeGame}
        onExit={exitGame}
        isPaused={isPaused}
        showPauseMenu={showPauseMenu}
        score={gameState.lettersCompleted}
        gameActive={gameState.gameActive}
        gameOver={gameState.gameOver}
      />
      
      {/* Error display */}
      {cameraError && (
        <div className="absolute top-4 left-4 right-4 bg-red-500 text-white p-4 rounded-lg z-50">
          {cameraError}
        </div>
      )}
    </div>
  );
}