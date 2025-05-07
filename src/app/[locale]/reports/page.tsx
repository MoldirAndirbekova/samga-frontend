"use client";

import { useState, useEffect, useRef } from "react";
import { FaInfoCircle, FaPlusCircle, FaTable, FaChartBar, FaBrain, FaHandPaper, FaBolt, FaEye, FaChild } from "react-icons/fa";
// import api from "@/features/page";
import api from "@/lib/api";
import { useChild } from "@/contexts/ChildContext";
import { useTranslations } from 'next-intl';

// Types for game report data
interface GameResult {
  game_id: string;
  difficulty: string;
  score: number;
  duration_seconds: number;
  left_score: number;
  right_score: number;
  timestamp: string;
  skills?: SkillMetrics;
  child_id?: string | null;
}

interface SkillMetrics {
  hand_eye_coordination: number;
  agility: number;
  focus: number;
  reaction_time: number;
}

// Updated to match backend's actual data structure
interface SkillProgressItem {
  timestamp: string;
  value: number;
  game_type: string;
  difficulty: string;
}

interface SkillProgress {
  hand_eye_coordination: SkillProgressItem[];
  agility: SkillProgressItem[];
  focus: SkillProgressItem[];
  reaction_time: SkillProgressItem[];
}

interface GameReport {
  total_games: number;
  average_score: number;
  average_duration: number;
  games_by_difficulty: Record<string, number>;
  recent_games: GameResult[];
  skill_metrics?: SkillMetrics;
  skill_progress?: SkillProgress;
  child_id?: string | null;
}

export default function Reports() {
  const t = useTranslations('Reports1');

  const [gameReport, setGameReport] = useState<GameReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'chart' | 'skills'>('table');
  const { selectedChildId, selectedChild: currentChild, children, loading: loadingChildren } = useChild();
  const hasSetDefaultChild = useRef(false);

  // Fetch report data when selectedChildId changes
  useEffect(() => {
    if (selectedChildId) {
      fetchReportData(selectedChildId);
    } else {
      setGameReport(null);
      setLoading(false);
    }
  }, [selectedChildId]);

  const fetchReportData = async (childId: string | null = null) => {
    if (!childId) {
      setGameReport(null);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      // Use REST API endpoint
      const url = '/games/results/report' + (childId ? `?child_id=${childId}` : '');
      
      // Add authentication token to the request
      const response = await api.get(url);
      
      if (response.data) {
        console.log("Fetched game report data:", response.data);
        setGameReport(response.data);
        setError(null);
      } else {
        setError('No data received from server');
      }
    } catch (err) {
      console.error('Error fetching game report:', err);
      setError('Failed to load game report data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Format timestamp
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Format duration in minutes and seconds
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Get color based on difficulty
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'HARD': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Get skill icon
  const getSkillIcon = (skillName: string) => {
    switch (skillName) {
      case 'hand_eye_coordination': return <FaHandPaper className="text-blue-500" />;
      case 'agility': return <FaBolt className="text-yellow-500" />;
      case 'focus': return <FaBrain className="text-purple-500" />;
      case 'reaction_time': return <FaEye className="text-green-500" />;
      default: return <FaInfoCircle className="text-gray-500" />;
    }
  };

  // Get skill display name
  const getSkillDisplayName = (skillName: string) => {
    switch (skillName) {
      case 'hand_eye_coordination': return 'Hand-Eye Coordination';
      case 'agility': return 'Agility';
      case 'focus': return 'Focus';
      case 'reaction_time': return 'Reaction Time';
      default: return skillName;
    }
  };

  // Get color based on skill score
  const getSkillScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    if (score >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex h-screen bg-[#FFF5E1] p-8 text-[#694800]">
      <main className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <h2 className="text-3xl font-bold">{t('game_reports')}</h2>
            {currentChild && (
              <div className="ml-4 bg-blue-100 px-3 py-1 rounded-full flex items-center">
                <FaChild className="mr-2 text-blue-500" />
                <span className="font-medium">
                  {currentChild.full_name}
                </span>
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            <button 
              className={`px-4 py-2 rounded-md ${viewMode === 'table' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setViewMode('table')}
            >
              <FaTable className="inline mr-2" /> Table View
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${viewMode === 'chart' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setViewMode('chart')}
            >
              <FaChartBar className="inline mr-2" /> Chart View
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${viewMode === 'skills' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setViewMode('skills')}
            >
              <FaBrain className="inline mr-2" /> {t('skills_reports')}
            </button>
          </div>
        </div>

        {loadingChildren ? (
          <div className="text-center py-10">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-2">{t('loading')}</p>
          </div>
        ) : children.length === 0 ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-md text-center">
            <p className="font-bold mb-2">{t('no_children')}</p>
            <p>{'add_child'}</p>
          </div>
        ) : !selectedChildId ? (
          <div className="bg-yellow-100 text-yellow-700 p-4 rounded-md text-center">
            <p className="font-bold mb-2">{t('no_child_select')}</p>
            <p>{t('select_child')}</p>
          </div>
        ) : loading ? (
          <div className="text-center py-10">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-2">{t('loading_reports')}</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-md">
            {error}
          </div>
        ) : !gameReport ? (
          <div className="bg-yellow-100 text-yellow-700 p-4 rounded-md">
            <p className="font-bold">{t('no_date')} {currentChild?.full_name}</p>
            <p>{t("play_game")}</p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-blue-100 p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-bold mb-2">{t("total_games")}</h3>
                <p className="text-3xl">{gameReport.total_games}</p>
              </div>
              <div className="bg-green-100 p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-bold mb-2">{t("average")}</h3>
                <p className="text-3xl">{gameReport.average_score}</p>
              </div>
              <div className="bg-purple-100 p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-bold mb-2">{t("avg_duration")}</h3>
                <p className="text-3xl">{formatDuration(Math.round(gameReport.average_duration))}</p>
              </div>
              <div className="bg-orange-100 p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-bold mb-2">{t("game-select")}</h3>
                <div className="flex flex-col space-y-1">
                  {Object.entries(gameReport.games_by_difficulty).map(([difficulty, count]) => (
                    <div key={difficulty} className="flex justify-between">
                      <span className={`px-2 rounded ${getDifficultyColor(difficulty)} text-white`}>{difficulty}</span>
                      <span>{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {viewMode === 'skills' ? (
              <>
                {/* Skills Summary Section */}
                {gameReport.skill_metrics ? (
                  <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                    <div className="p-4 bg-purple-500 text-white">
                      <h3 className="text-lg font-bold">{t("skills")}</h3>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(gameReport.skill_metrics).map(([skillName, score]) => (
                          <div key={skillName} className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                              <div className="mr-2">
                                {getSkillIcon(skillName)}
                              </div>
                              <h4 className="text-lg font-semibold">{getSkillDisplayName(skillName)}</h4>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                              <div 
                                className={`h-4 rounded-full ${getSkillScoreColor(score)}`} 
                                style={{ width: `${score}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>{t('score')}: {Math.round(score)}/100</span>
                              <span>{score < 40 ? 'Needs Practice' : score < 70 ? 'Good' : 'Excellent'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-100 text-yellow-700 p-4 rounded-md mb-6">
                    {t("no_skills")}
                  </div>
                )}

                {/* Skills Progress Chart */}
                {gameReport.skill_progress && Object.keys(gameReport.skill_progress).length > 0 && 
                  Object.values(gameReport.skill_progress).some(arr => arr.length > 0) ? (
                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-4 bg-blue-500 text-white">
                      <h3 className="text-lg font-bold">{t("skills_progress")}</h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-8">
                        {Object.entries(gameReport.skill_progress).map(([skillName, progressItems]) => (
                          progressItems.length > 0 ? (
                            <div key={skillName} className="space-y-2">
                              <div className="flex items-center">
                                <div className="mr-2">
                                  {getSkillIcon(skillName)}
                                </div>
                                <h4 className="font-semibold">{getSkillDisplayName(skillName)}</h4>
                              </div>
                              <div className="h-12 flex items-end space-x-1">
                                {progressItems.map((item: SkillProgressItem, index: number) => (
                                  <div key={index} className="flex flex-col items-center group relative" style={{ flex: '1' }}>
                                    <div 
                                      className={`${getSkillScoreColor(item.value)} w-full rounded-t`} 
                                      style={{ height: `${item.value}%` }}
                                    ></div>
                                    <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                      {Math.round(item.value)}%
                                      <br />
                                      {new Date(item.timestamp).toLocaleDateString()}
                                      <br />
                                      {item.game_type} ({item.difficulty})
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : null
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-100 text-yellow-700 p-4 rounded-md">
                   {t("no_date_1")}   </div>
                )}
              </>
            ) : (
              <>
                {/* Recent Games */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-4 bg-purple-500 text-white">
                    <h3 className="text-lg font-bold">{t("recent")}</h3>
                  </div>
                  
                  {viewMode === 'table' ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white">
                        <thead>
                          <tr className="bg-gray-100 text-gray-700 text-left">
                            <th className="py-2 px-4 border-b">{t("game_id")}</th>
                            <th className="py-2 px-4 border-b">{t("Difficulty")}</th>
                            <th className="py-2 px-4 border-b">{t("Score")}</th>
                            <th className="py-2 px-4 border-b">{t("LeftScore")}</th>
                            <th className="py-2 px-4 border-b">{t("RightScore")}</th>
                            <th className="py-2 px-4 border-b">{t("Duration")}Duration</th>
                            <th className="py-2 px-4 border-b">{t("Timestamp")}Timestamp</th>
                            <th className="py-2 px-4 border-b">{t("game_id")}Skills</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gameReport.recent_games.map((game) => (
                            <tr key={game.game_id} className="hover:bg-gray-50">
                              <td className="py-2 px-4 border-b">{game.game_id.substring(0, 8)}...</td>
                              <td className="py-2 px-4 border-b">
                                <span className={`px-2 py-1 rounded ${getDifficultyColor(game.difficulty)} text-white`}>
                                  {game.difficulty}
                                </span>
                              </td>
                              <td className="py-2 px-4 border-b">{game.score}</td>
                              <td className="py-2 px-4 border-b">{game.left_score}</td>
                              <td className="py-2 px-4 border-b">{game.right_score}</td>
                              <td className="py-2 px-4 border-b">{formatDuration(game.duration_seconds)}</td>
                              <td className="py-2 px-4 border-b">{formatDate(game.timestamp)}</td>
                              <td className="py-2 px-4 border-b">
                                {game.skills ? (
                                  <div className="flex space-x-1">
                                    {Object.entries(game.skills).map(([skillName, value]) => (
                                      <div key={skillName} className="group relative">
                                        {getSkillIcon(skillName)}
                                        <div className="absolute z-10 bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                          {getSkillDisplayName(skillName)}: {Math.round(value)}%
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : "N/A"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-4">
                      <h4 className="text-lg mb-4">{t("score_dist")}</h4>
                      <div className="h-64 flex items-end space-x-2">
                        {gameReport.recent_games.map((game) => (
                          <div 
                            key={game.game_id} 
                            className="flex-1 flex flex-col items-center"
                          >
                            <div 
                              className={`${getDifficultyColor(game.difficulty)} rounded-t w-full`} 
                              style={{ height: `${Math.min(100, game.score * 5)}%` }}
                            ></div>
                            <div className="text-xs mt-2 transform -rotate-45 origin-top-left">{game.score}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
