"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import api from "@/features/page";
import { registerWebSocket, unregisterWebSocket } from "@/features/websocket";
import { useChild } from "@/contexts/ChildContext";

// Game constants for UI - actual game logic is on backend
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const DIFFICULTY_LEVELS = {
  EASY: { paddleHeight: 100, speedMultiplier: 1 },
  MEDIUM: { paddleHeight: 80, speedMultiplier: 1.5 },
  HARD: { paddleHeight: 60, speedMultiplier: 2 }
};

export default function PingPongGame() {
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
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('EASY');
  const [paddleHeight, setPaddleHeight] = useState(DIFFICULTY_LEVELS.EASY.paddleHeight);
  const [isProcessingFrame, setIsProcessingFrame] = useState(false);
  const [detectedHands, setDetectedHands] = useState<{
    left: { x: number, y: number } | null,
    right: { x: number, y: number } | null
  }>({ left: null, right: null });
  const [frameImage, setFrameImage] = useState<string | null>(null);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const gameCreatedRef = useRef(false); // Track if a game has been created
  const processingGameOverRef = useRef(false); // Track if we're processing game over
  const { selectedChildId } = useChild();
  const [savedGameResult, setSavedGameResult] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  const createGame = async () => {
    try {
      // Check if a child is selected
      if (!selectedChildId) {
        console.error("No child selected");
        setSaveError("No child selected. Please select a child from the header menu first.");
        return;
      }

      console.log("Creating new PingPong game with difficulty:", difficulty);
      
      // Clean up any existing WebSocket connection
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

      // Reset frame and game state
      setFrameImage(null);
      setGameState({
        score: 0,
        leftScore: 0,
        rightScore: 0,
        gameActive: false,
        gameOver: false,
        currentSpeed: 1
      });
      
      // Make sure video is still running
      if (videoRef.current && !videoRef.current.srcObject) {
        console.log("Video stream lost, restarting camera");
        try {
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
        } catch (err) {
          console.error("Failed to restart camera:", err);
          setCameraError("Could not access the camera after game restart");
        }
      }

      // Set game creation in progress
      gameCreatedRef.current = true;

      const response = await api.post('/games/game/start', {
        difficulty,
        child_id: selectedChildId
      });
      
      if (response.data && response.data.game_id) {
        console.log("Game created with ID:", response.data.game_id);
        setGameId(response.data.game_id);
        
        // Add a small delay before connecting to the WebSocket
        // to ensure the backend has fully initialized the game
        setTimeout(() => {
          console.log("Connecting to WebSocket after delay");
          connectWebSocket(response.data.game_id);
        }, 500); // Increased delay for more reliability
      } else {
        console.error("Game creation failed: No game_id in response");
        gameCreatedRef.current = false;
      }
    } catch (error) {
      console.error('Error creating game:', error);
      
      // Reset state if game creation fails
      setSocketConnected(false);
      wsRef.current = null;
      gameCreatedRef.current = false;
    }
  };
  
  const connectWebSocket = (id: string) => {
    // Check video status before connecting
    if (videoRef.current) {
      console.log("Video status before WebSocket connection:", 
        videoRef.current.readyState,
        videoRef.current.srcObject ? "has stream" : "no stream"
      );
    } else {
      console.log("Video ref not available before WebSocket connection");
    }
    
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
    
    // Store the game ID in state
    setGameId(id);
    
    // Also store in localStorage for persistence
    localStorage.setItem("ping_pong_game_id", id);
    
    // Reset connected state before attempting connection
    setSocketConnected(false);
    
    // Get the authentication token from local storage
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("Authentication token not found");
      alert("Your session has expired. Please log in again.");
      window.location.href = "/login";
      return;
    }
    
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = window.location.hostname === 'localhost' ? 'localhost:8000' : window.location.host;
    // Add token as query parameter for authentication
    const ws = new WebSocket(`${protocol}://${host}/games/game/${id}/ws?token=${token}`);
    
    console.log(`Connecting to WebSocket at ${protocol}://${host}/games/game/${id}/ws`);
    
    // Set connection timeout
    const connectionTimeout = setTimeout(() => {
      if (ws.readyState !== WebSocket.OPEN) {
        console.log("WebSocket connection timed out, retrying...");
        ws.close();
        
        // Try to reconnect after a short delay
        setTimeout(() => {
          if (gameId === id) { // Only reconnect if the game ID hasn't changed
            connectWebSocket(id);
          }
        }, 500);
      }
    }, 3000);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      clearTimeout(connectionTimeout);
      setSocketConnected(true);
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'game_state') {
        // Extract game state data
        const newGameState = {
          score: data.data.score,
          leftScore: data.data.left_score,
          rightScore: data.data.right_score,
          gameActive: data.data.game_active,
          gameOver: data.data.game_over,
          currentSpeed: data.data.current_speed
        };
        
        // Check if game just ended - mark game over but don't save results (backend saves it)
        if (newGameState.gameOver && !gameState.gameOver) {
          console.log("Game just ended - backend saves results automatically");
          console.log("Current game ID:", gameId);
          
          // Just mark as saved to prevent the UI from trying to save
          setSavedGameResult(true);
          
          // Trigger WebSocket cleanup after a delay
          setTimeout(() => {
            closeWebSocketConnection();
          }, 2000);
        }
        
        setFrameImage(data.data.frame);
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
      clearTimeout(connectionTimeout);
      setSocketConnected(false);
      
      // Try to reconnect if this wasn't a clean close and game ID matches
      if (event.code !== 1000 && event.code !== 1001) {
        console.log("Attempting to reconnect in 1 second...");
        setTimeout(() => {
          if (gameId === id) { // Only reconnect if the game ID hasn't changed
            connectWebSocket(id);
          }
        }, 1000);
      }
    };
    
    ws.onerror = (error: Event) => {
      console.error('WebSocket error occurred');
      // Don't log the entire error object as it's not serializable
      // We'll handle reconnection in the onclose handler
    };
    
    wsRef.current = ws;
    
    // Register with the WebSocket manager
    const cleanupCallback = () => {
      console.log("Cleaning up PingPong game resources");
      clearTimeout(connectionTimeout);
      // Don't stop camera stream here, as it should persist between difficulty changes
      // Only component unmount should stop the camera
    };
    
    const newConnectionId = registerWebSocket(ws, cleanupCallback);
    setConnectionId(newConnectionId);
  };
  
  const startGame = () => {
    // Check if a child is selected
    if (!selectedChildId) {
      alert("Please select a child first");
      return;
    }
    
    if (!gameId || !socketConnected) {
      createGame();
      return;
    }
    
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'start_game',
        data: {}
      }));
    }
  };
  
  // Set difficulty
  const setGameDifficulty = (level: 'EASY' | 'MEDIUM' | 'HARD') => {
    // Only update difficulty if it actually changed
    if (difficulty !== level) {
      console.log(`Changing difficulty from ${difficulty} to ${level}`);
      setDifficulty(level);
      setPaddleHeight(DIFFICULTY_LEVELS[level].paddleHeight);
      
      // Don't immediately recreate the game - let the useEffect handle it
    }
  };
  
  // Initialize camera and make it independent of difficulty changes
  useEffect(() => {
    const startCamera = async () => {
      try {
        // Only start the camera if it's not already active
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

    // Check if we have a stored game ID
    const storedGameId = localStorage.getItem("ping_pong_game_id");
    if (storedGameId) {
      console.log("Found stored game ID:", storedGameId);
      setGameId(storedGameId);
    }

    startCamera();
    
    // Only create game if child is selected
    if (selectedChildId) {
      createGame();
    } else {
      console.log("No child selected, not creating game yet");
      setSaveError("No child selected. Please select a child from the header menu first.");
    }
    
    return () => {
      // Clean up when component unmounts
      if (connectionId) {
        unregisterWebSocket(connectionId);
        setConnectionId(null);
      } else if (wsRef.current) {
        wsRef.current.close();
      }
      
      // Only stop camera stream when component unmounts
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [selectedChildId]); // Run when selectedChildId changes
  
  // Separate effect for game creation when difficulty changes
  useEffect(() => {
    // Don't recreate game on initial mount (handled by the camera effect)
    if (difficulty && gameId && selectedChildId) {
      console.log("Difficulty changed, recreating game with ID:", gameId);
      setTimeout(() => {
        createGame();
      }, 100);
    }
  }, [difficulty]);
  
  // Set up hand tracking via WebSocket
  useEffect(() => {
    console.log("Hand tracking effect triggered with socketConnected:", socketConnected, "gameId:", gameId);
    
    if (!videoRef.current) {
      console.log("Video ref not available yet for hand tracking");
      return;
    }
    
    if (!socketConnected || !wsRef.current) {
      console.log("WebSocket not connected yet for hand tracking");
      return;
    }
    
    // Check if video is ready and has enough data
    const checkVideoReady = () => {
      if (videoRef.current && 
          videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        return true;
      }
      console.log("Video not ready yet for hand tracking");
      return false;
    };
    
    // If video is not ready initially, set up a one-time check after a delay
    if (!checkVideoReady()) {
      const videoReadyTimer = setTimeout(() => {
        console.log("Checking video readiness again after delay");
        if (checkVideoReady()) {
          console.log("Video is now ready after delay");
        }
      }, 1000);
      
      return () => clearTimeout(videoReadyTimer);
    }
    
    console.log("Setting up hand tracking interval");
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
        // Capture frame from video
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
          } else {
            console.log("WebSocket not available for sending hand tracking image");
          }
        }
      } catch (error) {
        console.error('Error processing frame:', error);
      } finally {
        setIsProcessingFrame(false);
        processingActive = false;
      }
    }, 100); 
    
    console.log("Hand tracking interval set up successfully");
    
    // Update WebSocket message handler to receive hand tracking results
    const oldOnMessage = wsRef.current.onmessage;
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'game_state') {
        setFrameImage(data.data.frame);
        setGameState({
          score: data.data.score,
          leftScore: data.data.left_score,
          rightScore: data.data.right_score,
          gameActive: data.data.game_active,
          gameOver: data.data.game_over,
          currentSpeed: data.data.current_speed
        });
      } else if (data.type === 'hand_tracking_result') {
        setDetectedHands({
          left: data.data.left ? { x: data.data.left.position.x, y: data.data.left.position.y } : null,
          right: data.data.right ? { x: data.data.right.position.x, y: data.data.right.position.y } : null
        });
      }
    };
    
    return () => {
      console.log("Cleaning up hand tracking interval");
      clearInterval(intervalId);
      if (wsRef.current && wsRef.current.onmessage !== oldOnMessage) {
        wsRef.current.onmessage = oldOnMessage;
      }
    };
  }, [socketConnected, gameId, difficulty]);
  
  // Add function to manually save game results via REST API
  // This is only used if backend auto-save fails for some reason
  const saveGameResults = async (
    finalScore: number, 
    leftScore: number, 
    rightScore: number, 
    finalSpeed: number,
    currentGameId?: string
  ) => {
    // Reset any previous error
    setSaveError(null);
    
    try {
      // Use the passed gameId parameter if available, otherwise use the state variable
      const effectiveGameId = currentGameId || gameId;
      
      // Log which game ID we're using
      console.log("Manually saving results for game ID:", effectiveGameId, "State gameId:", gameId);
      
      // Ensure we have a valid gameId
      if (!effectiveGameId) {
        console.error("Cannot save results: missing game ID");
        setSaveError("Missing game ID");
        return Promise.resolve(); // Return resolved promise
      }

      // Ensure we have a valid child ID
      if (!selectedChildId) {
        console.error("Cannot save results: no child selected");
        setSaveError("No child selected");
        return Promise.resolve(); // Return resolved promise
      }
      
      // Calculate skill metrics (similar to backend calculation)
      const skills: Record<string, number> = {};
      
      // Hand-eye coordination: Based on successful hits/total attempts
      const totalAttempts = leftScore + rightScore;
      if (totalAttempts > 0) {
        skills.hand_eye_coordination = Math.min(100, (finalScore / totalAttempts) * 100);
      } else {
        skills.hand_eye_coordination = 0;
      }
      
      // Agility: Based on speed of successful hits at higher speeds
      const initialSpeed = 1; // Same as backend INITIAL_BALL_SPEED
      const maxSpeed = 15;    // Same as backend MAX_BALL_SPEED
      
      if (finalSpeed > initialSpeed) {
        const agilityFactor = (finalSpeed / maxSpeed) * 100;
        skills.agility = Math.min(100, agilityFactor);
      } else {
        skills.agility = 0;
      }
      
      // Focus: Based on consecutive successful hits without misses
      const maxStreak = Math.max(leftScore, rightScore);
      const focusFactor = (maxStreak / 10) * 100; // 10 consecutive hits = 100% focus
      skills.focus = Math.min(100, focusFactor);
      
      // Reaction time: Inverse of speed (faster = better reaction time)
      if (finalSpeed > initialSpeed) {
        const reactionFactor = (finalSpeed / maxSpeed) * 100;
        skills.reaction_time = Math.min(100, reactionFactor);
      } else {
        skills.reaction_time = 0;
      }
      
      // Send to our REST API endpoint
      const gameDuration = 60; // Default game duration in seconds
      const result = await api.post('/games/results/save', {
        game_id: effectiveGameId,
        game_type: 'ping_pong',
        difficulty: difficulty,
        score: finalScore,
        duration_seconds: gameDuration,
        left_score: leftScore,
        right_score: rightScore,
        skills: skills,
        child_id: selectedChildId
      });
      
      console.log("Game results saved successfully:", result.data);
      setSavedGameResult(true);
      setSaveError(null);
      return result;
    } catch (error: any) {
      console.error("Failed to save game results:", error);
      
      // Extract error message for display
      let errorMessage = "Failed to save game results";
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = `Server error: ${error.response.status}`;
        console.error("Error response data:", error.response.data);
        
        // Show the specific validation error if available
        if (error.response.data && error.response.data.detail) {
          if (Array.isArray(error.response.data.detail)) {
            errorMessage += " - " + error.response.data.detail[0].msg;
          } else {
            errorMessage += " - " + error.response.data.detail;
          }
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "No response from server";
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = error.message || "Unknown error";
      }
      
      setSaveError(errorMessage);
      return Promise.reject(error); // Rethrow to trigger finally block
    }
  };
  
  // Effect to detect game over and verify results were saved
  useEffect(() => {
    if (gameState.gameOver && !saveError) {
      console.log("Game over, verifying results were saved");
      
      // Try to verify if results were saved after a delay to give backend time
      const verifyTimeout = setTimeout(async () => {
        try {
          if (!gameId) {
            console.log("No game ID available for verification");
            return;
          }
          
          // Query the reports endpoint to check if our game was saved
          const response = await api.get('/games/results/report', {
            params: { child_id: selectedChildId }
          });
          
          console.log("Verification response:", response.data);
          
          // Check if our game ID is in the recent games
          const recentGames = response.data?.recent_games || [];
          const gameSaved = recentGames.some((game: any) => game.game_id === gameId);
          
          if (gameSaved) {
            console.log("Verified: Game results were saved properly");
            setSaveError(null);
          } else {
            console.warn("Game results may not have been saved properly");
            // Don't set an error - we're not 100% sure if it failed
          }
        } catch (error) {
          console.error("Error verifying game results:", error);
          // We don't want to alarm the user if verification fails
        }
      }, 3000); // Wait 3 seconds for backend to complete save
      
      return () => clearTimeout(verifyTimeout);
    }
  }, [gameState.gameOver, gameId, selectedChildId, saveError]);
  
  // Reset saved flag when starting a new game
  useEffect(() => {
    if (gameState.gameActive) {
      setSavedGameResult(false);
    }
  }, [gameState.gameActive]);
  
  // Add a function to close the WebSocket connection
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
    <div className="flex flex-col items-center gap-6 p-4">
      <h1 className="text-3xl font-bold bg-purple-400 px-4 py-2 rounded">Ping Pong</h1>
      
      {/* Show warning if no child is selected */}
      {!selectedChildId && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg w-full max-w-md text-center mb-4">
          <p className="font-bold">No child selected</p>
          <p className="text-sm">Please select a child from the header menu to play</p>
        </div>
      )}
      
      {isProcessingFrame && (
        <div className="bg-blue-100 text-blue-800 p-2 rounded-lg mb-2">
          <p className="text-sm">Processing hand tracking...</p>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Game canvas with relative positioning for overlays */}
        <div className="relative">
          {frameImage ? (
            <img 
              src={frameImage} 
              width={GAME_WIDTH} 
              height={GAME_HEIGHT} 
              className="border-4 border-purple-500 rounded-lg shadow-lg"
              alt="Game"
            />
          ) : (
            <canvas
              ref={canvasRef}
              width={GAME_WIDTH}
              height={GAME_HEIGHT}
              className="border-4 border-purple-500 rounded-lg shadow-lg"
            />
          )}
          
          {/* Start game overlay */}
          {!gameState.gameActive && !gameState.gameOver && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center rounded-lg">
              <h2 className="text-2xl font-bold text-white mb-4">Ready to Play?</h2>
              <div className="text-md text-white mb-4 max-w-md text-center">
                <p className="mb-3">Position both hands in front of the camera:</p>
                <div className="flex justify-around mb-4">
                  <div className="bg-red-500 bg-opacity-70 p-3 rounded-lg">
                    <p className="font-bold mb-1">Left Hand</p>
                    <p className="text-sm">Controls left paddle</p>
                  </div>
                  <div className="bg-blue-500 bg-opacity-70 p-3 rounded-lg">
                    <p className="font-bold mb-1">Right Hand</p>
                    <p className="text-sm">Controls right paddle</p>
                  </div>
                </div>
                <p className="mb-3">Move your hands <strong>up and down</strong> to control the paddles.</p>
                <p>Hand positions are shown on the main game screen as colored markers.</p>
              </div>
              
              {/* Difficulty selection */}
              <div className="mb-6">
                <p className="text-white text-center mb-2">Select Difficulty:</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setGameDifficulty('EASY')}
                    className={`px-4 py-2 rounded ${difficulty === 'EASY' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                  >
                    Easy
                  </button>
                  <button
                    onClick={() => setGameDifficulty('MEDIUM')}
                    className={`px-4 py-2 rounded ${difficulty === 'MEDIUM' ? 'bg-yellow-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => setGameDifficulty('HARD')}
                    className={`px-4 py-2 rounded ${difficulty === 'HARD' ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                  >
                    Hard
                  </button>
                </div>
                <div className="text-xs text-gray-300 mt-1 text-center">
                  {difficulty === 'EASY' ? 'Larger paddles, slower ball' : 
                   difficulty === 'MEDIUM' ? 'Medium paddles, faster ball' : 
                   'Small paddles, fastest ball'}
                </div>
              </div>
              
              <button
                onClick={startGame}
                className={`px-6 py-3 ${selectedChildId ? 'bg-purple-500 hover:bg-purple-600' : 'bg-gray-500 cursor-not-allowed'} text-white font-bold rounded-lg shadow-lg transition`}
                disabled={(!detectedHands.left && !detectedHands.right) || !socketConnected || !selectedChildId}
              >
                {!selectedChildId ? 'Select a Child First' :
                 !socketConnected ? 'Connecting to Server...' :
                 (!detectedHands.left && !detectedHands.right) ? 'Show Hands to Camera First' : 
                 'Start Game'}
              </button>
              {!selectedChildId && (
                <p className="mt-3 text-red-300 text-sm">Please select a child from the header menu</p>
              )}
              {selectedChildId && !socketConnected && (
                <p className="mt-3 text-yellow-300 text-sm">Connecting to game server...</p>
              )}
              {selectedChildId && socketConnected && !detectedHands.left && !detectedHands.right && (
                <p className="mt-3 text-yellow-300 text-sm">No hands detected! Please position your hands in view of the camera.</p>
              )}
            </div>
          )}
          
          {/* Game Over overlay */}
          {gameState.gameOver && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center rounded-lg">
              <h2 className="text-4xl font-bold text-white mb-4">Game Over!</h2>
              <p className="text-2xl text-white mb-6">Your Score: {gameState.score}</p>
              
              <div className="flex flex-col gap-2 mb-4">
                <p className="text-white">Left Side: {gameState.leftScore} points</p>
                <p className="text-white">Right Side: {gameState.rightScore} points</p>
              </div>
              
              {saveError ? (
                <div className="mt-2 bg-red-100 text-red-700 p-3 rounded-lg">
                  <p className="font-bold">Error saving results</p>
                  <p className="text-sm">{saveError}</p>
                  <button 
                    onClick={() => {
                      if (gameId && !processingGameOverRef.current) {
                        processingGameOverRef.current = true;
                        saveGameResults(
                          gameState.score, 
                          gameState.leftScore, 
                          gameState.rightScore, 
                          gameState.currentSpeed,
                          gameId
                        ).finally(() => {
                          processingGameOverRef.current = false;
                        });
                      }
                    }} 
                    className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                  >
                    Manual Retry
                  </button>
                </div>
              ) : (
                <div className="mt-2 bg-green-100 text-green-700 p-3 rounded-lg">
                  <p className="font-bold">Results saved automatically!</p>
                  <p className="text-sm">Your score and skills have been recorded.</p>
                </div>
              )}
              
              <button
                onClick={startGame}
                className={`px-6 py-3 ${selectedChildId ? 'bg-purple-500 hover:bg-purple-600' : 'bg-gray-500 cursor-not-allowed'} text-white font-bold rounded-lg shadow-lg transition mt-4`}
                disabled={!socketConnected || !selectedChildId}
              >
                {!selectedChildId ? 'Select a Child First' : 'Play Again'}
              </button>
              
              {!selectedChildId && (
                <p className="mt-3 text-red-300 text-sm">Please select a child from the header menu</p>
              )}
              {selectedChildId && !socketConnected && (
                <p className="mt-3 text-yellow-300 text-sm">Connection lost. Please refresh the page.</p>
              )}
            </div>
          )}
        </div>
        
        {/* Camera feed with hand tracking overlay */}
        <div className="border-4 border-gray-300 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-2 text-center">Hand Tracking Camera</h2>
          {cameraError ? (
            <p className="text-red-500 p-4">{cameraError}</p>
          ) : (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                width={320}
                height={240}
                className="rounded transform -scale-x-100"
              />
              {/* Overlay for visual hand tracking */}
              <div id="video-overlay" className="absolute inset-0 pointer-events-none">
                {/* Left hand marker */}
                {detectedHands.left && (
                  <div 
                    className="absolute w-12 h-12 border-4 border-red-500 rounded-full opacity-60"
                    style={{ 
                      left: `${(detectedHands.left.x / 640) * 320}px`, 
                      top: `${(detectedHands.left.y / 480) * 240}px`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                )}
                {/* Right hand marker */}
                {detectedHands.right && (
                  <div 
                    className="absolute w-12 h-12 border-4 border-blue-500 rounded-full opacity-60"
                    style={{ 
                      left: `${(detectedHands.right.x / 640) * 320}px`, 
                      top: `${(detectedHands.right.y / 480) * 240}px`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                )}
              </div>
            </div>
          )}
          <div className="p-2 bg-yellow-100">
            <p className="text-sm">
              {detectedHands.left && detectedHands.right ? (
                <span className="text-green-700 font-semibold">✓ Both hands detected!</span>
              ) : detectedHands.left || detectedHands.right ? (
                <span className="text-orange-500 font-semibold">⚠️ Only one hand detected</span>
              ) : (
                <span className="text-red-600 font-semibold">⚠️ No hands detected - show hands to camera</span>
              )}
            </p>
            <p className="text-xs mt-1">
              {detectedHands.left ? '👈 Left hand tracked' : ''}
              {detectedHands.left && detectedHands.right ? ' • ' : ''}
              {detectedHands.right ? 'Right hand tracked 👉' : ''}
            </p>
            <div className="mt-1 bg-opacity-10 p-1 rounded text-xs">
              <p>WebSocket connection: {socketConnected ? '✅ Connected' : '❌ Disconnected'}</p>
              <p>Backend rendering: {frameImage ? '✅ Active' : '❌ Inactive'}</p>
              <p>Hand tracking: {isProcessingFrame ? '⏳ Processing' : '✅ Ready'}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 bg-yellow-100 p-4 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-2">How to Play:</h2>
        <ul className="list-disc pl-6">
          <li>Position <strong>both</strong> hands in front of the camera</li>
          <li>Your <strong>left hand</strong> controls the left paddle</li>
          <li>Your <strong>right hand</strong> controls the right paddle</li>
          <li>Move your hands up and down to control paddle movement</li>
          <li>Don't let the ball leave the game area</li>
          <li>The ball speeds up with each hit</li>
          <li>Choose difficulty level to adjust paddle size and ball speed</li>
        </ul>
        <div className="mt-3 bg-blue-100 p-3 rounded">
          <h3 className="text-md font-bold mb-1">Tips for Best Hand Tracking:</h3>
          <ul className="list-disc pl-6 text-sm">
            <li>Ensure good lighting on your hands</li>
            <li>Position your camera to see both hands clearly</li>
            <li>Keep your hands at least shoulder-width apart</li>
            <li>Keep hands in view and move slowly for better tracking</li>
            <li>Wear contrasting clothes compared to your background</li>
          </ul>
        </div>
        <div className="mt-3 bg-purple-100 p-3 rounded">
          <h3 className="text-md font-bold mb-1">Backend Rendering Mode:</h3>
          <p className="text-sm">This game is now rendered entirely on the backend server. Benefits include:</p>
          <ul className="list-disc pl-6 text-sm">
            <li>Consistent gameplay experience across all devices</li>
            <li>Reduced client-side performance requirements</li>
            <li>Better synchronization between hand tracking and gameplay</li>
            <li>Smoother performance on low-end devices</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 