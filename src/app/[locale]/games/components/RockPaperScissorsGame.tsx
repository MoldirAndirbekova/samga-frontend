"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import api from "@/features/page";
import { registerWebSocket, unregisterWebSocket } from "@/features/websocket";
import { useChild } from "@/contexts/ChildContext";
import Image from "next/image";

interface RockPaperScissorsGameProps {
  onGameOver: (score: number) => void;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export default function RockPaperScissorsGame({ onGameOver, difficulty: initialDifficulty }: RockPaperScissorsGameProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [gameState, setGameState] = useState({
    score: 0,
    computerScore: 0,
    gameActive: false,
    gameOver: false,
    currentState: 'HOME',
    roundCount: 0,
    currentRound: 0,
    countdown: 0,
    playerMove: null,
    computerMove: null,
    roundResult: null
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
  const [showCamera, setShowCamera] = useState(true);
  
  // Sound effects
  const countdownSoundRef = useRef<HTMLAudioElement | null>(null);
  const victorySoundRef = useRef<HTMLAudioElement | null>(null);
  const lossSoundRef = useRef<HTMLAudioElement | null>(null);
  
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
        return;
      }

      console.log("Creating new Rock Paper Scissors game with difficulty:", difficulty);
      
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
        ...gameState,
        score: 0,
        computerScore: 0,
        gameActive: false,
        gameOver: false,
        currentState: 'HOME'
      });
      
      gameCreatedRef.current = true;

      const response = await api.post('/games/game/start', {
        game_type: 'rock_paper_scissors',
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
    localStorage.setItem("rps_game_id", id);
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
        if (data.data.frame) {
          setFrameImage(data.data.frame);
        }
        
        const newGameState = {
          score: data.data.score || 0,
          computerScore: data.data.computer_score || 0,
          gameActive: data.data.game_active || false,
          gameOver: data.data.game_over || false,
          currentState: data.data.current_state || 'HOME',
          roundCount: data.data.round_count || 0,
          currentRound: data.data.current_round || 0,
          countdown: data.data.countdown || 0,
          playerMove: data.data.player_move || null,
          computerMove: data.data.computer_move || null,
          roundResult: data.data.round_result || null
        };

        // Handle sound effects based on game state changes
        if (newGameState.currentState === 'GAME_READY' && gameState.currentState !== 'GAME_READY') {
          // Play countdown sound when round starts
          if (countdownSoundRef.current) {
            countdownSoundRef.current.currentTime = 0;
            countdownSoundRef.current.play().catch(e => console.log("Sound play prevented:", e));
          }
        }
        
        if (newGameState.roundResult === 'player' && gameState.roundResult !== 'player') {
          // Play victory sound when player wins a round
          if (victorySoundRef.current) {
            victorySoundRef.current.currentTime = 0;
            victorySoundRef.current.play().catch(e => console.log("Sound play prevented:", e));
          }
        } else if (newGameState.roundResult === 'computer' && gameState.roundResult !== 'computer') {
          // Play loss sound when computer wins a round
          if (lossSoundRef.current) {
            lossSoundRef.current.currentTime = 0;
            lossSoundRef.current.play().catch(e => console.log("Sound play prevented:", e));
          }
        }

        if (newGameState.gameOver && !gameState.gameOver) {
          console.log("Game just ended - calling onGameOver with score:", newGameState.score);
          setTimeout(() => {
            onGameOver(newGameState.score);
            closeWebSocketConnection();
          }, 5000); // Allow time to see final result
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
      console.log("Cleaning up RPS game resources");
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
        if (!videoRef.current?.srcObject && showCamera) {
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
    
    // Initialize audio elements
    countdownSoundRef.current = new Audio('/sounds/countdown.mp3');
    victorySoundRef.current = new Audio('/sounds/victory.mp3');
    lossSoundRef.current = new Audio('/sounds/loss.mp3');
    
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
  }, [selectedChildId, showCamera]);
  
  // Set up hand tracking via WebSocket
  useEffect(() => {
    if (!videoRef.current || !socketConnected || !wsRef.current || !showCamera) return;
    
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
  }, [socketConnected, gameId, showCamera]);
  
  // Toggle camera visibility
  const toggleCamera = () => {
    setShowCamera(!showCamera);
  };
  
  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden">
      {/* Audio elements for sound effects */}
      {/* Camera background - full screen */}
      {showCamera && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
        />
      )}
      
      {/* Game overlay - full screen without border */}
      <div className="absolute inset-0 w-full h-full">
        {frameImage ? (
          <img 
            src={frameImage} 
            alt="Rock Paper Scissors Game" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black bg-opacity-50">
            <p className="text-white text-xl">Loading game...</p>
          </div>
        )}
      </div>
      
      {/* Score and game info display - overlay on top */}
      <div className="absolute top-4 left-4 right-4 flex justify-between z-50">
        {gameState.currentState !== 'HOME' && gameState.currentState !== 'PREVIEW' && (
          <>
            <div className="bg-blue-100 bg-opacity-90 text-blue-800 p-3 rounded-lg">
              <p className="text-lg font-bold">Your Score: {gameState.score}</p>
            </div>
            
            <div className="bg-red-100 bg-opacity-90 text-red-800 p-3 rounded-lg">
              <p className="text-lg font-bold">Computer: {gameState.computerScore}</p>
            </div>
          </>
        )}
      </div>
      
      {/* Display current difficulty when in game */}
      {gameState.currentState !== 'HOME' && gameState.currentState !== 'PREVIEW' && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-yellow-100 bg-opacity-90 text-yellow-800 px-4 py-2 rounded-lg z-50">
          <p className="text-md font-bold">Difficulty: {difficulty}</p>
        </div>
      )}
      
      {/* Camera toggle button */}
      <div className="absolute bottom-4 right-4 z-50">
        <button 
          onClick={toggleCamera}
          className="bg-purple-500 text-white p-3 rounded-full shadow-lg hover:bg-purple-600"
        >
          {showCamera ? 'Hide Camera' : 'Show Camera'}
        </button>
      </div>
      
      {/* Error display */}
      {cameraError && (
        <div className="absolute top-4 left-4 right-4 bg-red-500 text-white p-4 rounded-lg z-50">
          {cameraError}
        </div>
      )}
      
      {/* Instructions overlay */}
      {(gameState.currentState === 'HOME' || gameState.currentState === 'PREVIEW') && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 p-4 rounded-lg text-white max-w-md z-50">
          <p className="text-center text-lg">
            {gameState.currentState === 'HOME' && "Make a fist (rock) to start the game"}
            {gameState.currentState === 'PREVIEW' && "Get ready to play! See the gesture examples above."}
          </p>
        </div>
      )}
      
      {/* Level selection help */}
      {gameState.currentState === 'LEVEL_SELECT' && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 p-4 rounded-lg text-white max-w-md z-50">
          <p className="text-center text-lg">
            Show 1, 2, or 3 fingers to select difficulty
          </p>
        </div>
      )}
    </div>
  );
}