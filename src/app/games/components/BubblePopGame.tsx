"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import api from "@/features/page";
import { registerWebSocket, unregisterWebSocket } from "@/features/websocket";
import { useChild } from "@/contexts/ChildContext";

// Game constants
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const GAME_DURATION = 60; // 60 seconds

// Difficulty descriptions
const DIFFICULTY_INFO = {
  "EASY": "Bubbles last 8 seconds, -1 point penalty",
  "MEDIUM": "Bubbles last 5 seconds, -2 points penalty",
  "HARD": "Bubbles last 3 seconds, -3 points penalty",
};

export default function BubblePopGame() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [gameState, setGameState] = useState({
    score: 0,
    gameActive: false,
    gameOver: false,
    timeRemaining: GAME_DURATION
  });
  const [gameId, setGameId] = useState<string | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [isProcessingFrame, setIsProcessingFrame] = useState(false);
  const [frameImage, setFrameImage] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  const wsRef = useRef<WebSocket | null>(null);
  const gameCreatedRef = useRef(false); // Track if a game has been created
  const processingGameOverRef = useRef(false); // Track if we're processing game over
  const { selectedChildId } = useChild();
  const [savedGameResult, setSavedGameResult] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showCameraPreview, setShowCameraPreview] = useState(false);
  
  const createGame = async () => {
    try {
      // Check if a child is selected
      if (!selectedChildId) {
        console.error("No child selected");
        return;
      }

      console.log("Creating new Bubble Pop game with difficulty:", difficulty);
      
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
        gameActive: false,
        gameOver: false,
        timeRemaining: GAME_DURATION
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
        game_type: 'bubble_pop',
        difficulty: difficulty,
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
    localStorage.setItem("bubble_pop_game_id", id);
    
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
        // Update frame image from server
        if (data.data.frame) {
          setFrameImage(data.data.frame);
        }
        
        // Update game state
        const newGameState = {
          score: data.data.score || 0,
          gameActive: data.data.game_active || false,
          gameOver: data.data.game_over || false,
          timeRemaining: data.data.time_remaining || GAME_DURATION
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
        
        setGameState(newGameState);
      } else if (data.type === 'hand_tracking_result') {
        // We don't need to handle this directly as the server is handling collision detection
        console.log("Received hand tracking result from server");
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
      console.log("Cleaning up BubblePop game resources");
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
      console.log("Sending start_game event to server");
      wsRef.current.send(JSON.stringify({
        type: 'start_game',
        data: {}
      }));
    }
  };
  
  const handleDifficultyChange = (newDifficulty: 'EASY' | 'MEDIUM' | 'HARD') => {
    if (gameState.gameActive) return; // Don't allow changing difficulty during game
    
    // Only update difficulty if it actually changed
    if (difficulty !== newDifficulty) {
      console.log(`Changing difficulty from ${difficulty} to ${newDifficulty}`);
      setDifficulty(newDifficulty);
      // The useEffect hook will handle recreating the game when difficulty changes
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
    const storedGameId = localStorage.getItem("bubble_pop_game_id");
    if (storedGameId) {
      console.log("Found stored game ID:", storedGameId);
      setGameId(storedGameId);
    }

    startCamera();
    
    // Only create game if selectedChildId is available
    if (selectedChildId) {
      createGame();
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
      // Reset the game created flag before recreating the game
      gameCreatedRef.current = false;
      createGame();
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
    
    if (!checkVideoReady()) {
      const videoReadyTimer = setTimeout(() => {
        console.log("Checking video readiness again after delay");
        if (checkVideoReady()) {
          console.log("Video is now ready after delay");
        }
      }, 1000);
      
      return () => clearTimeout(videoReadyTimer);
    }
    
    console.log("Setting up hand tracking interval for AR");
    let processingActive = false;
    // Reduced interval time for smoother AR experience
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
          // Mirror the camera feed horizontally for natural AR experience
          ctx.save();
          ctx.scale(-1, 1);
          ctx.translate(-canvas.width, 0);
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          ctx.restore();
          
          // Higher quality for AR overlay
          const imageData = canvas.toDataURL('image/jpeg', 0.8);
          
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
    }, 60); // Increased update frequency for AR (about 16.7 fps)
    
    return () => {
      clearInterval(intervalId);
    };
  }, [socketConnected, gameId]);
  
  // Add function to manually save game results via REST API
  // This is only used if backend auto-save fails for some reason
  const saveGameResults = async (finalScore: number, penalties: number, currentGameId?: string) => {
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

      // Convert values to proper types
      const numericScore = parseInt(finalScore.toString()) || 0;
      const numericPenalties = parseInt(penalties.toString()) || 0;
      
      // Basic skill metrics calculation (similar to backend calculation)
      const skills: Record<string, number> = {};
      
      // Hand-eye coordination: Based on successful pops vs penalties
      const totalAttempts = numericScore + numericPenalties;
      if (totalAttempts > 0) {
        skills.hand_eye_coordination = Math.min(100, (numericScore / totalAttempts) * 100);
      } else {
        skills.hand_eye_coordination = 0;
      }
      
      // Agility: Based on score within time limit
      const agilityFactor = (numericScore / 50) * 100;  // 50 pops in 60 sec = 100% agility
      skills.agility = Math.min(100, agilityFactor);
        
      // Focus: Inverse of penalties (fewer penalties = better focus)
      if (numericPenalties === 0 && numericScore > 0) {
        skills.focus = 100;
      } else if (totalAttempts > 0) {
        const focusFactor = 100 - ((numericPenalties / totalAttempts) * 100);
        skills.focus = Math.max(0, focusFactor);
      } else {
        skills.focus = 0;
      }
        
      // Reaction time: Based on score within time limit
      const reactionFactor = (numericScore / 40) * 100;  // 40 pops in 60 sec = 100% reaction
      skills.reaction_time = Math.min(100, reactionFactor);
      
      // Calculate actual duration, ensuring it's not negative or zero
      const timeRemaining = gameState.timeRemaining || 0;
      const duration = Math.max(1, GAME_DURATION - timeRemaining);
      
      // Ensure all values are valid (not null or undefined)
      const payload = {
        game_id: effectiveGameId,
        game_type: "bubble_pop",
        difficulty: difficulty,
        score: numericScore,
        duration_seconds: Math.floor(duration),
        left_score: numericScore,  // For bubble pop: use score as left_score
        right_score: numericPenalties,  // For bubble pop: use penalties as right_score
        skills: skills,
        child_id: selectedChildId
      };
      
      console.log("Saving game result with data:", payload);
      
      // Send to our REST API endpoint
      const result = await api.post('/games/results/save', payload);
      
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
  
  // Effect to detect game over and cleanup
  useEffect(() => {
    if (gameState.gameOver && savedGameResult) {
      console.log("Game over and results saved, cleaning up WebSocket");
      // Add slight delay to ensure any final messages are processed
      const cleanupTimeout = setTimeout(() => {
        closeWebSocketConnection();
      }, 1000);
      
      return () => clearTimeout(cleanupTimeout);
    }
  }, [gameState.gameOver, savedGameResult, closeWebSocketConnection]);
  
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
  
  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <h1 className="text-3xl font-bold bg-blue-400 px-4 py-2 rounded">Bubble Pop AR</h1>
      
      {/* Show warning if no child is selected */}
      {!selectedChildId && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg w-full max-w-md text-center">
          <p className="font-bold">No child selected</p>
          <p className="text-sm">Please select a child from the header menu to play</p>
        </div>
      )}
      
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="bg-blue-100 text-blue-800 p-3 rounded-lg">
          <p className="text-lg font-bold">Score: {gameState.score}</p>
        </div>
        
        <div className="bg-green-100 text-green-800 p-3 rounded-lg">
          <p className="text-lg font-bold">Time: {gameState.timeRemaining}s</p>
        </div>
        
        {!gameState.gameActive && (
          <>
            <div className="bg-purple-100 text-purple-800 p-3 rounded-lg">
              <p className="text-lg font-bold">Difficulty: {difficulty}</p>
            </div>
            
            <button
              onClick={startGame}
              className={`font-bold py-2 px-4 rounded ${selectedChildId ? 'bg-blue-500 hover:bg-blue-700 text-white' : 'bg-gray-400 cursor-not-allowed text-gray-200'}`}
              disabled={!selectedChildId}
            >
              {gameState.gameOver ? 'Play Again' : 'Start Game'}
            </button>
          </>
        )}
      </div>
      
      {/* Difficulty selector - only shown when not playing */}
      {!gameState.gameActive && (
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <button
            onClick={() => handleDifficultyChange('EASY')}
            className={`px-4 py-2 rounded font-bold ${
              difficulty === 'EASY'
                ? 'bg-green-500 text-white'
                : 'bg-green-200 text-green-800 hover:bg-green-300'
            }`}
          >
            Easy
          </button>
          <button
            onClick={() => handleDifficultyChange('MEDIUM')}
            className={`px-4 py-2 rounded font-bold ${
              difficulty === 'MEDIUM'
                ? 'bg-yellow-500 text-white'
                : 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300'
            }`}
          >
            Medium
          </button>
          <button
            onClick={() => handleDifficultyChange('HARD')}
            className={`px-4 py-2 rounded font-bold ${
              difficulty === 'HARD'
                ? 'bg-red-500 text-white'
                : 'bg-red-200 text-red-800 hover:bg-red-300'
            }`}
          >
            Hard
          </button>
        </div>
      )}
      
      {/* Difficulty description */}
      {!gameState.gameActive && (
        <div className="bg-gray-100 p-3 rounded-lg mb-4 text-center max-w-md">
          <p className="text-gray-700">{DIFFICULTY_INFO[difficulty]}</p>
          <p className="text-gray-700 mt-2">Bubbles will self-pop if not popped in time, resulting in a score penalty.</p>
        </div>
      )}
      
      {gameState.gameOver && (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg mb-4 text-center">
          <h2 className="text-2xl font-bold mb-2">Game Over!</h2>
          <p className="text-xl">Final Score: {gameState.score}</p>
          <p className="text-lg">Difficulty: {difficulty}</p>
          
          {saveError ? (
            <div className="mt-2 bg-red-100 text-red-700 p-2 rounded">
              <p className="font-bold">Error saving results</p>
              <p className="text-sm">{saveError}</p>
              <button 
                onClick={() => {
                  if (gameId && !processingGameOverRef.current) {
                    processingGameOverRef.current = true;
                    saveGameResults(gameState.score, 0, gameId)
                      .finally(() => {
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
            <div className="mt-2 bg-green-100 text-green-700 p-2 rounded">
              <p className="font-bold">Results saved automatically!</p>
              <p className="text-sm">Your score and skills have been recorded.</p>
            </div>
          )}
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Game frame from server - now with AR overlay */}
        <div className="relative">
          {frameImage ? (
            <img 
              src={frameImage} 
              width={GAME_WIDTH}
              height={GAME_HEIGHT}
              alt="Bubble Pop AR Game" 
              className="border-4 border-blue-500 rounded-lg"
            />
          ) : (
            <div 
              className="border-4 border-blue-500 rounded-lg bg-black flex items-center justify-center"
              style={{width: GAME_WIDTH, height: GAME_HEIGHT}}
            >
              <p className="text-white text-xl">Starting AR experience...</p>
            </div>
          )}
          
          {/* Optional camera preview for debugging */}
          {showCameraPreview && videoRef.current && (
            <div className="absolute top-0 left-0 w-32 h-24 border-2 border-red-500">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {!gameState.gameActive && !gameState.gameOver && !frameImage && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white rounded-lg">
              <h2 className="text-3xl font-bold mb-4">Bubble Pop AR</h2>
              <p className="text-xl mb-4">See yourself while popping bubbles!</p>
              <p className="text-lg mb-8">Use your hands to pop bubbles</p>
            </div>
          )}
        </div>
        
        {/* Hidden video element for hand tracking */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="hidden" // Hide the video element
        />
        
        {isProcessingFrame && (
          <div className="bg-blue-100 text-blue-800 p-2 rounded-lg mt-2">
            <p className="text-sm">Processing hand tracking...</p>
          </div>
        )}
        
        {/* Game instructions */}
        <div className="w-full md:w-auto mt-4 md:mt-0">
          <h3 className="text-xl font-semibold mb-2">How to Play:</h3>
          <ul className="list-disc list-inside ml-2">
            <li>Make sure your hands are visible</li>
            <li>Move your hands to pop the bubbles</li>
            <li>Pop bubbles before they pop themselves</li>
            <li>Self-popped bubbles cause penalties</li>
            <li>Bubbles change color as their time runs out</li>
            <li className="font-semibold mt-2">Difficulty changes bubble lifetime and penalties</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 