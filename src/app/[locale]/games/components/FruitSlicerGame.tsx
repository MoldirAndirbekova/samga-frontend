"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import api from "@/lib/api";
import { registerWebSocket, unregisterWebSocket } from "@/features/websocket";
import { useChild } from "@/contexts/ChildContext";

// TypeScript interfaces
interface FruitData {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  velocityX: number;
  velocityY: number;
  sliced: boolean;
  slicedByPlayer: boolean;
  age: number;
  isBomb: boolean;
  type: number;
  createdAt: number;
}

interface NosePosition {
  x: number;
  y: number;
}

interface BladeTrailPoint {
  x: number;
  y: number;
  time: number;
}

interface GameState {
  fruits: FruitData[];
  score: number;
  timeRemaining: number;
  combo: number;
  maxCombo: number;
  gameActive: boolean;
  gameOver: boolean;
  penalties: number;
}

interface FruitSlicerGameProps {
  onGameOver: (score: number) => void;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export default function FruitSlicerGame({ onGameOver, difficulty: initialDifficulty }: FruitSlicerGameProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef<GameState>({
    fruits: [],
    score: 0,
    timeRemaining: 60,
    combo: 0,
    maxCombo: 0,
    gameActive: false,
    gameOver: false,
    penalties: 0
  });
  
  const [gameState, setGameState] = useState<GameState>(gameStateRef.current);
  const [nosePosition, setNosePosition] = useState<NosePosition | null>(null);
  const [bladeTrail, setBladeTrail] = useState<BladeTrailPoint[]>([]);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>(initialDifficulty);
  
  const wsRef = useRef<WebSocket | null>(null);
  const gameCreatedRef = useRef<boolean>(false);
  const { selectedChildId } = useChild();
  
  // Game constants
  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 600;
  
  const createGame = async (): Promise<void> => {
    try {
      if (!selectedChildId) {
        console.error("No child selected");
        return;
      }

      console.log("Creating new Fruit Slicer game with difficulty:", difficulty);
      
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

      // Reset all game state
      const newGameState: GameState = {
        fruits: [],
        score: 0,
        timeRemaining: 60,
        combo: 0,
        maxCombo: 0,
        gameActive: false,
        gameOver: false,
        penalties: 0
      };
      gameStateRef.current = newGameState;
      setGameState(newGameState);
      setBladeTrail([]);
      setNosePosition(null);
      
      gameCreatedRef.current = true;

      const response = await api.post('/games/game/start', {
        game_type: 'fruit_slicer',
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
  
  const connectWebSocket = (id: string): void => {
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
    localStorage.setItem("fruit_slicer_game_id", id);
    setSocketConnected(false);
    
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("Authentication token not found");
      alert("Your session has expired. Please log in again.");
      window.location.href = "/login";
      return;
    }
    
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const backendHost = API_URL.replace(/^https?:\/\//, '');
    const wsProtocol = API_URL.startsWith('https') ? 'wss' : 'ws';
    
    const ws = new WebSocket(`${wsProtocol}://${backendHost}/games/game/${id}/ws?token=${token}`);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setSocketConnected(true);
      startGame();
    };
    
    ws.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'game_state') {
        // Update game state from server (positions, scores, etc.)
        const serverGameState: GameState = {
          score: data.data.score || 0,
          gameActive: data.data.gameActive || false,
          gameOver: data.data.gameOver || false,
          timeRemaining: data.data.timeRemaining || 60,
          combo: data.data.combo || 0,
          maxCombo: data.data.maxCombo || 0,
          penalties: data.data.penalties || 0,
          fruits: (data.data.fruits || []) as FruitData[],
        };
        
        // Update nose position and blade trail from server
        if (data.data.nosePosition) {
          setNosePosition(data.data.nosePosition as NosePosition);
        }
        
        if (data.data.bladeTrail && Array.isArray(data.data.bladeTrail)) {
          setBladeTrail(data.data.bladeTrail as BladeTrailPoint[]);
        }

        if (serverGameState.gameOver && !gameStateRef.current.gameOver) {
          setTimeout(() => {
            onGameOver(serverGameState.score);
            closeWebSocketConnection();
          }, 1000);
        }
        
        gameStateRef.current = serverGameState;
        setGameState(serverGameState);
      }
      else if (data.type === 'pose_tracking_result') {
        // Handle pose tracking results from server
        if (data.data.nose) {
          setNosePosition(data.data.nose as NosePosition);
        }
      }
    };
    
    ws.onclose = (event: CloseEvent) => {
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
      console.log("Cleaning up Fruit Slicer game resources");
    };
    
    const newConnectionId = registerWebSocket(ws, cleanupCallback);
    setConnectionId(newConnectionId);
  };
  
  const startGame = (): void => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log("Sending start_game event to server");
      wsRef.current.send(JSON.stringify({
        type: 'start_game',
        data: {}
      }));
    }
  };
  
  const closeWebSocketConnection = useCallback((): void => {
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
  
  // Initialize camera
  useEffect(() => {
    const startCamera = async (): Promise<void> => {
      try {
        if (!videoRef.current?.srcObject) {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              width: 640,
              height: 480,
              facingMode: 'user',
              frameRate: 15
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
  
  // Send camera frames for pose detection
  useEffect(() => {
    if (!videoRef.current || !socketConnected || !wsRef.current) return;
    
    let processingActive = false;
    let frameCount = 0;
    
    const intervalId = setInterval(async () => {
      frameCount++;

      if (frameCount % 5 !== 0) return; // Send every 5th frame
      if (processingActive || 
          !videoRef.current || 
          videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA ||
          !wsRef.current ||
          wsRef.current.readyState !== WebSocket.OPEN) {
        return;
      }
      
      processingActive = true;
      
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 320; // Reduced resolution
        canvas.height = 240;
        const ctx = canvas.getContext('2d');
        
        if (ctx && videoRef.current) {
          ctx.save();
          ctx.scale(-1, 1);
          ctx.translate(-canvas.width, 0);
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          ctx.restore();
          
          const imageData = canvas.toDataURL('image/jpeg', 0.3); // Lower quality
          
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
        processingActive = false;
      }
    }, 300); // Slower rate: 300ms instead of 200ms
    
    return () => {
      clearInterval(intervalId);
    };
  }, [socketConnected, gameId]);
  
  // Client-side rendering
  const render = useCallback((): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { width, height } = canvas;
    
    // Clear with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#1e3a8a');
    gradient.addColorStop(1, '#312e81');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw blade trail
    if (bladeTrail.length > 1) {
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      for (let i = 1; i < bladeTrail.length; i++) {
        const currentTime = Date.now();
        const alpha = 1 - (currentTime - bladeTrail[i].time) / 500;
        if (alpha > 0) {
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.moveTo(bladeTrail[i-1].x, bladeTrail[i-1].y);
          ctx.lineTo(bladeTrail[i].x, bladeTrail[i].y);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    }
    
    // Draw fruits - with proper type checking
    if (gameState.fruits && Array.isArray(gameState.fruits)) {
      gameState.fruits.forEach((fruit: FruitData) => {
        const centerX = fruit.x + fruit.size / 2;
        const centerY = fruit.y + fruit.size / 2;
        const radius = fruit.size / 2;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(fruit.rotation * Math.PI / 180);
        
        if (fruit.sliced && fruit.slicedByPlayer) {
          const alpha = Math.max(0, 1 - fruit.age / 30);
          ctx.globalAlpha = alpha;
          
          if (fruit.isBomb) {
            // Bomb explosion with rings
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 5;
            for (let r = radius; r < radius * 3; r += radius / 2) {
              ctx.beginPath();
              ctx.arc(0, 0, r, 0, Math.PI * 2);
              ctx.stroke();
            }
            
            ctx.fillStyle = 'white';
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('BOOM!', 0, 8);
          } else {
            // Sliced fruit halves with juice drips
            const offset = fruit.age / 2;
            const colors = ['#ef4444', '#f97316', '#22c55e', '#eab308', '#f59e0b'];
            ctx.fillStyle = colors[fruit.type] || colors[0];
            
            // Draw halves
            ctx.beginPath();
            ctx.ellipse(-offset, 0, radius * 0.8, radius * 0.4, 0, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.ellipse(offset, 0, radius * 0.8, radius * 0.4, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Juice drips
            for (let i = 0; i < 3; i++) {
              const dropX = (Math.random() - 0.5) * radius * 2;
              const dropY = Math.random() * fruit.age;
              ctx.beginPath();
              ctx.arc(dropX, dropY, 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        } else if (!fruit.sliced) {
          // Draw intact fruits with all beautiful graphics
          if (fruit.isBomb) {
            // Bomb with fuse and spark
            ctx.fillStyle = '#374151';
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Fuse
            ctx.strokeStyle = '#6b7280';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(0, -radius);
            ctx.lineTo(0, -radius - 15);
            ctx.stroke();
            
            // Animated spark
            if (Math.random() > 0.5) {
              const sparkColors = ['#fbbf24', '#ef4444', '#f59e0b'];
              ctx.fillStyle = sparkColors[Math.floor(Math.random() * sparkColors.length)];
              ctx.beginPath();
              ctx.arc(0, -radius - 15, 3 + Math.random() * 3, 0, Math.PI * 2);
              ctx.fill();
            }
            
            ctx.fillStyle = 'white';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('BOMB', 0, 5);
          } else {
            // Beautiful fruits with all detail
            const colors = ['#ef4444', '#f97316', '#22c55e', '#eab308', '#f59e0b'];
            
            if (fruit.type === 0) {
              // Apple with stem
              ctx.fillStyle = colors[0];
              ctx.beginPath();
              ctx.arc(0, 0, radius, 0, Math.PI * 2);
              ctx.fill();
              
              // Stem
              ctx.strokeStyle = '#16a34a';
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.moveTo(0, -radius);
              ctx.lineTo(0, -radius - 8);
              ctx.stroke();
              
              // Leaf
              ctx.fillStyle = '#16a34a';
              ctx.beginPath();
              ctx.ellipse(5, -radius - 5, 4, 2, Math.PI / 4, 0, Math.PI * 2);
              ctx.fill();
              
            } else if (fruit.type === 1) {
              // Orange with texture
              ctx.fillStyle = colors[1];
              ctx.beginPath();
              ctx.arc(0, 0, radius, 0, Math.PI * 2);
              ctx.fill();
              
              // Orange texture dots
              ctx.fillStyle = '#ea580c';
              for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                const x = Math.cos(angle) * radius * 0.7;
                const y = Math.sin(angle) * radius * 0.7;
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fill();
              }
              
            } else if (fruit.type === 2) {
              // Watermelon with stripes
              ctx.fillStyle = colors[2];
              ctx.beginPath();
              ctx.arc(0, 0, radius, 0, Math.PI * 2);
              ctx.fill();
              
              // Dark green stripes
              ctx.strokeStyle = '#15803d';
              ctx.lineWidth = 2;
              for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2;
                ctx.beginPath();
                ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
                ctx.lineTo(Math.cos(angle + Math.PI) * radius, Math.sin(angle + Math.PI) * radius);
                ctx.stroke();
              }
              
            } else if (fruit.type === 3) {
              // Banana
              ctx.fillStyle = colors[3];
              ctx.beginPath();
              ctx.ellipse(0, 0, radius * 1.2, radius * 0.6, 0, 0, Math.PI * 2);
              ctx.fill();
              
              // Banana curve marks
              ctx.strokeStyle = '#ca8a04';
              ctx.lineWidth = 1;
              for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.arc(0, (i - 1) * radius * 0.3, radius * 0.8, 0, Math.PI, false);
                ctx.stroke();
              }
              
            } else {
              // Pineapple with crown
              ctx.fillStyle = colors[4];
              ctx.beginPath();
              ctx.arc(0, 0, radius, 0, Math.PI * 2);
              ctx.fill();
              
              // Pineapple texture pattern
              ctx.fillStyle = '#ca8a04';
              for (let i = 0; i < 12; i++) {
                const angle = (i / 12) * Math.PI * 2;
                const x = Math.cos(angle) * radius * 0.7;
                const y = Math.sin(angle) * radius * 0.7;
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fill();
              }
              
              // Crown
              ctx.fillStyle = '#16a34a';
              ctx.beginPath();
              ctx.moveTo(-radius/2, -radius);
              ctx.lineTo(-radius/6, -radius - 12);
              ctx.lineTo(0, -radius - 8);
              ctx.lineTo(radius/6, -radius - 12);
              ctx.lineTo(radius/2, -radius);
              ctx.closePath();
              ctx.fill();
            }
            
            // Highlight on all fruits
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.beginPath();
            ctx.arc(-radius * 0.3, -radius * 0.3, radius * 0.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        
        ctx.restore();
      });
    }
    
    // Draw nose cursor
    if (nosePosition) {
      const scale_x = width / 640;
      const scale_y = height / 480;
      const nose_x = nosePosition.x * scale_x;
      const nose_y = nosePosition.y * scale_y;
      
      ctx.strokeStyle = '#fbbf24';
      ctx.fillStyle = 'rgba(251, 191, 36, 0.3)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(nose_x, nose_y, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(nose_x - 15, nose_y);
      ctx.lineTo(nose_x + 15, nose_y);
      ctx.moveTo(nose_x, nose_y - 15);
      ctx.lineTo(nose_x, nose_y + 15);
      ctx.stroke();
    }
    
    // Draw UI
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${gameState.score}`, 20, 40);
    ctx.fillText(`Time: ${gameState.timeRemaining}s`, width - 150, 40);
    ctx.textAlign = 'center';
    ctx.fillText(`Difficulty: ${difficulty}`, width/2, 40);
    
    if (gameState.combo > 1) {
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 32px Arial';
      ctx.fillText(`Combo x${gameState.combo}`, width/2, height - 50);
    }
    
    if (gameState.penalties > 0) {
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Penalties: -${gameState.penalties}`, 20, height - 20);
    }
    
    // Game over screen
    if (gameState.gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, width, height);
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', width/2, height/2 - 50);
      
      ctx.font = 'bold 32px Arial';
      ctx.fillText(`Final Score: ${gameState.score}`, width/2, height/2);
      ctx.fillText(`Max Combo: x${gameState.maxCombo}`, width/2, height/2 + 50);
    }
  }, [gameState, nosePosition, bladeTrail, difficulty]);
  
  // Render loop
  useEffect(() => {
    const renderLoop = setInterval(render, 16); // 60fps rendering
    return () => clearInterval(renderLoop);
  }, [render]);
  
  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden">
      {/* Camera background */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover transform -scale-x-100 opacity-30"
      />
      
      {/* Game canvas - client-side rendered */}
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        className="absolute inset-0 w-full h-full object-contain"
      />
      
      {/* Loading indicator */}
      {!socketConnected && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-xl">Connecting to game...</p>
          </div>
        </div>
      )}
      
      {/* Error display */}
      {cameraError && (
        <div className="absolute top-4 left-4 right-4 bg-red-500 text-white p-4 rounded-lg z-50">
          {cameraError}
        </div>
      )}
    </div>
  );
}