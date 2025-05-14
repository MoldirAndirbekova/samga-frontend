"use client";

import { useState } from "react";

interface PauseResumeButtonsProps {
  onPause: () => void;
  onResume: () => void;
  onExit: () => void;
  isPaused: boolean;
  showPauseMenu: boolean;
  score?: number;
  gameActive: boolean;
  gameOver: boolean;
}

export default function PauseResumeButtons({
  onPause,
  onResume,
  onExit,
  isPaused,
  showPauseMenu,
  score = 0,
  gameActive,
  gameOver
}: PauseResumeButtonsProps) {
  return (
    <>
      {/* Pause/Exit buttons in bottom right */}
      {gameActive && !gameOver && !showPauseMenu && (
        <div className="absolute bottom-4 right-4 flex gap-4 z-50">
          <button
            onClick={onPause}
            className="px-6 py-3 bg-yellow-500 text-white font-bold rounded-lg shadow-lg hover:bg-yellow-600 transition transform hover:scale-105"
          >
            Pause
          </button>
          <button
            onClick={onExit}
            className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg shadow-lg hover:bg-red-600 transition transform hover:scale-105"
          >
            Exit
          </button>
        </div>
      )}
      
      {/* Pause menu */}
      {showPauseMenu && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
            <h2 className="text-3xl font-bold mb-6">Game Paused</h2>
            {score !== undefined && (
              <p className="text-2xl mb-8">Score: {score}</p>
            )}
            
            <div className="flex flex-col gap-4">
              <button
                onClick={onResume}
                className="px-8 py-4 bg-green-500 text-white font-bold rounded-lg shadow-lg hover:bg-green-600 transition transform hover:scale-105"
              >
                Resume
              </button>
              <button
                onClick={onExit}
                className="px-8 py-4 bg-red-500 text-white font-bold rounded-lg shadow-lg hover:bg-red-600 transition transform hover:scale-105"
              >
                Exit to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}