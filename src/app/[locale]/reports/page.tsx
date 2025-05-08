"use client";

import { useState, useEffect, useRef } from "react";
import { FaInfoCircle, FaPlusCircle, FaTable, FaChartBar, FaBrain, FaHandPaper, FaBolt, FaEye, FaChild } from "react-icons/fa";
// import api from "@/features/page";
import api from "@/lib/api";
import { useChild } from "@/contexts/ChildContext";
import { useTranslations } from 'next-intl';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Area } from 'recharts';


// Types for game report data
interface GameResult {
  game_id: string;
  game_name: string;
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
            <p>{t('add_child')}</p>
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
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Progress Over Time</h4>
                          <div className="flex items-center space-x-2 text-sm">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                              <span>Hand-Eye</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                              <span>Agility</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
                              <span>Focus</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                              <span>Reaction</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Combined skills progress chart */}
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart
                            margin={{ top: 10, right: 30, left: 10, bottom: 30 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="date" 
                              type="category"
                              allowDuplicatedCategory={false}
                              tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              label={{ value: 'Date', position: 'insideBottomRight', offset: -10 }}
                            />
                            <YAxis 
                              domain={[0, 100]} 
                              label={{ value: 'Skill Level', angle: -90, position: 'insideLeft' }} 
                            />
                            <Tooltip 
                              content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  return (
                                    <div className="bg-white p-3 border border-gray-300 shadow-md rounded">
                                      <p className="font-semibold">{new Date(data.timestamp).toLocaleDateString()}</p>
                                      <p className="text-sm">{data.game_type} ({data.difficulty})</p>
                                      <div className="mt-2 space-y-1">
                                        {payload.map((entry, index) => (
                                          <div key={index} className="flex justify-between items-center">
                                            <div className="flex items-center">
                                              <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: entry.color }}></div>
                                              <span className="text-sm">{entry.name}:</span>
                                            </div>
                                            <span className="font-medium ml-2">{Math.round(entry.value as number)}%</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Legend />
                            
                            {/* Each skill gets its own line with appropriate color */}
                            {Object.keys(gameReport.skill_progress || {}).map((skill, index) => {
                              // Skip if no data points for this skill
                              if (!gameReport.skill_progress || gameReport.skill_progress[skill as keyof SkillProgress].length === 0) return null;
                              
                              // Sort data points by timestamp
                              const dataPoints = [...gameReport.skill_progress[skill as keyof SkillProgress]]
                                .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                                .map(item => ({
                                  ...item,
                                  date: item.timestamp // For XAxis
                                }));
                                
                              // Get color and display name for this skill
                              let color;
                              switch(skill) {
                                case 'hand_eye_coordination': color = '#3b82f6'; break; // blue
                                case 'agility': color = '#f59e0b'; break; // yellow
                                case 'focus': color = '#8b5cf6'; break; // purple
                                case 'reaction_time': color = '#10b981'; break; // green
                                default: color = '#6b7280'; // gray
                              }
                              
                              return (
                                <Line
                                  key={skill}
                                  data={dataPoints}
                                  type="monotone"
                                  dataKey="value"
                                  name={getSkillDisplayName(skill)}
                                  stroke={color}
                                  strokeWidth={2}
                                  activeDot={{ r: 6 }}
                                  dot={{ r: 4 }}
                                />
                              );
                            })}
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      
                      {/* Individual skill progress charts */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        {Object.entries(gameReport.skill_progress).map(([skillName, progressItems]) => {
                          // Skip if no data for this skill
                          if (progressItems.length === 0) return null;
                          
                          // Sort data points by timestamp
                          const sortedData = [...progressItems]
                            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
                          
                          // Get skill color
                          let color;
                          switch(skillName) {
                            case 'hand_eye_coordination': color = '#3b82f6'; break; // blue
                            case 'agility': color = '#f59e0b'; break; // yellow
                            case 'focus': color = '#8b5cf6'; break; // purple
                            case 'reaction_time': color = '#10b981'; break; // green
                            default: color = '#6b7280'; // gray
                          }
                          
                          // Calculate improvement
                          const firstValue = sortedData[0].value;
                          const lastValue = sortedData[sortedData.length - 1].value;
                          const improvement = lastValue - firstValue;
                          
                          return (
                            <div key={skillName} className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                  <div className="mr-2">
                                    {getSkillIcon(skillName)}
                                  </div>
                                  <h4 className="font-semibold">{getSkillDisplayName(skillName)}</h4>
                                </div>
                                <div className={`flex items-center ${improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  <span className="text-sm font-medium">
                                    {improvement >= 0 ? '+' : ''}{Math.round(improvement)}%
                                  </span>
                                  <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-4 w-4 ml-1" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                  >
                                    {improvement >= 0 ? (
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    ) : (
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    )}
                                  </svg>
                                </div>
                              </div>
                              
                              <ResponsiveContainer width="100%" height={120}>
                                <LineChart data={sortedData.map(item => ({...item, date: item.timestamp}))}>
                                  <XAxis 
                                    dataKey="date" 
                                    tick={false}
                                    axisLine={{ stroke: '#E5E7EB' }}
                                  />
                                  <YAxis 
                                    domain={[0, 100]} 
                                    tick={{ fontSize: 12 }}
                                    tickCount={3}
                                    axisLine={{ stroke: '#E5E7EB' }}
                                  />
                                  <CartesianGrid vertical={false} stroke="#E5E7EB" />
                                  <Tooltip
                                    content={({ active, payload }) => {
                                      if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        return (
                                          <div className="bg-white p-2 border border-gray-300 shadow-sm rounded text-xs">
                                            <p>{Math.round(data.value)}%</p>
                                            <p>{new Date(data.timestamp).toLocaleDateString()}</p>
                                            <p>{data.game_type} ({data.difficulty})</p>
                                          </div>
                                        );
                                      }
                                      return null;
                                    }}
                                  />
                                  <Line 
                                    type="monotone" 
                                    dataKey="value" 
                                    stroke={color}
                                    strokeWidth={2}
                                    dot={{ r: 3, fill: color }}
                                    activeDot={{ r: 5 }}
                                  />
                                  {/* Add area under the line for emphasis */}
                                  <Area 
                                    type="monotone" 
                                    dataKey="value" 
                                    stroke="none"
                                    fill={color} 
                                    fillOpacity={0.1}
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                              
                              <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>{new Date(sortedData[0].timestamp).toLocaleDateString()}</span>
                                <span>{new Date(sortedData[sortedData.length - 1].timestamp).toLocaleDateString()}</span>
                              </div>
                              
                              {/* Latest game details */}
                              <div className="mt-3 text-sm bg-white p-2 rounded border border-gray-200">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">Latest: {Math.round(lastValue)}%</span>
                                  <span className="text-xs text-gray-500"
                                  
                                  
                >
                                    {sortedData[sortedData.length - 1].game_type}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-100 text-yellow-700 p-4 rounded-md mb-6">
                    {t("no_skills_progress")}
                  </div>
                )}
              </>
            ) : viewMode === 'chart' ? (
              <div className="p-6">
                {/* Score Distribution Chart */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold mb-4">{t("score_dist") || "Score Distribution"}</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart 
                      data={gameReport.recent_games.map((game, index) => ({
                        name: game.game_name.substring(0, 10) + (game.game_name.length > 10 ? '...' : ''),
                        score: game.score,
                        duration: Math.round(game.duration_seconds / 60), // Convert to minutes
                        left: game.left_score,
                        right: game.right_score,
                        difficulty: game.difficulty,
                        index: index + 1,
                        date: new Date(game.timestamp).toLocaleDateString()
                      }))}
                      margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="index" 
                        label={{ value: 'Game Session', position: 'insideBottomRight', offset: -10 }}
                        tick={(props) => {
                          const { x, y, payload } = props;
                          const value = gameReport.recent_games[payload.value - 1];
                          
                          return (
                            <g transform={`translate(${x},${y})`}>
                              <text x={0} y={0} dy={16} textAnchor="middle" fill="#666" fontSize={12}>
                                {payload.value}
                              </text>
                              <text x={0} y={0} dy={30} textAnchor="middle" fill="#666" fontSize={10}>
                                {value ? new Date(value.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}
                              </text>
                            </g>
                          );
                        }}
                      />
                      <YAxis yAxisId="left" label={{ value: 'Score', angle: -90, position: 'insideLeft' }} />
                      <YAxis yAxisId="right" orientation="right" label={{ value: 'Duration (min)', angle: 90, position: 'insideRight' }} />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = gameReport.recent_games[label - 1];
                            return (
                              <div className="bg-white p-3 border border-gray-300 shadow-md rounded">
                                <p className="font-semibold">{data.game_name}</p>
                                <p className="text-sm">{new Date(data.timestamp).toLocaleString()}</p>
                                <p className={`text-sm mt-1 inline-block px-2 py-0.5 rounded ${
                                  data.difficulty === 'EASY' ? 'bg-green-500 text-white' :
                                  data.difficulty === 'MEDIUM' ? 'bg-yellow-500 text-white' :
                                  'bg-red-500 text-white'
                                }`}>
                                  {data.difficulty}
                                </p>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                  <div>
                                    <p className="text-xs text-gray-500">Score</p>
                                    <p className="font-semibold">{data.score}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Duration</p>
                                    <p className="font-semibold">{Math.round(data.duration_seconds / 60)} min</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Left Score</p>
                                    <p className="font-semibold">{data.left_score}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Right Score</p>
                                    <p className="font-semibold">{data.right_score}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend />
                      <Bar 
                        yAxisId="left" 
                        dataKey="score" 
                        name="Score" 
                        barSize={20}
                        fill="#8884d8"
                      />
                      <Line 
                        yAxisId="left" 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#8884d8" 
                        strokeWidth={2} 
                        name="Score Trend" 
                        dot={{ r: 4 }}
                      />
                      <Line 
                        yAxisId="right" 
                        type="monotone" 
                        dataKey="duration" 
                        stroke="#ff7300" 
                        strokeWidth={2} 
                        name="Duration" 
                        dot={{ r: 4 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                {/* Left/Right Score Comparison */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold mb-4">Left/Right Score Comparison</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={gameReport.recent_games.map((game, index) => ({
                        name: `Game ${index + 1}`,
                        date: new Date(game.timestamp).toLocaleDateString(),
                        left: game.left_score,
                        right: game.right_score,
                        total: game.score,
                        game: game.game_name,
                        index: index + 1
                      }))}
                      margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="index"
                        label={{ value: 'Game Session', position: 'insideBottomRight', offset: -10 }}
                        tick={(props) => {
                          const { x, y, payload } = props;
                          const game = gameReport.recent_games[payload.value - 1];
                          
                          return (
                            <g transform={`translate(${x},${y})`}>
                              <text x={0} y={0} dy={16} textAnchor="middle" fill="#666" fontSize={12}>
                                {payload.value}
                              </text>
                              <text x={0} y={0} dy={30} textAnchor="middle" fill="#666" fontSize={10}>
                                {game ? new Date(game.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}
                              </text>
                            </g>
                          );
                        }}
                      />
                      <YAxis label={{ value: 'Score', angle: -90, position: 'insideLeft' }} />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const game = gameReport.recent_games[label - 1];
                            return (
                              <div className="bg-white p-3 border border-gray-300 shadow-md rounded">
                                <p className="font-semibold">{game.game_name}</p>
                                <p className="text-sm">{new Date(game.timestamp).toLocaleString()}</p>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                  <div>
                                    <p className="text-xs text-gray-500">Left Score</p>
                                    <p className="font-semibold">{game.left_score}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Right Score</p>
                                    <p className="font-semibold">{game.right_score}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <p className="text-xs text-gray-500">Difference</p>
                                    <p className={`font-semibold ${
                                      game.left_score > game.right_score ? 'text-blue-600' : 
                                      game.right_score > game.left_score ? 'text-green-600' : 'text-gray-600'
                                    }`}>
                                      {game.left_score > game.right_score 
                                        ? `Left side is stronger by ${game.left_score - game.right_score}` 
                                        : game.right_score > game.left_score 
                                          ? `Right side is stronger by ${game.right_score - game.left_score}`
                                          : 'Both sides are equal'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend />
                      <Bar dataKey="left" name="Left Side" fill="#3b82f6" />
                      <Bar dataKey="right" name="Right Side" fill="#10b981" />
                      <Line 
                        type="monotone" 
                        dataKey="left" 
                        stroke="#3b82f6" 
                        name="Left Trend" 
                        strokeWidth={2} 
                        dot={{ r: 3 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="right" 
                        stroke="#10b981" 
                        name="Right Trend" 
                        strokeWidth={2} 
                        dot={{ r: 3 }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Progress Over Time */}
                {gameReport.recent_games.length > 1 && (
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Progress Over Time</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={gameReport.recent_games.map((game, index) => ({
                          name: index + 1,
                          date: new Date(game.timestamp).toLocaleDateString(),
                          score: game.score,
                          duration: Math.round(game.duration_seconds / 60),
                          game: game.game_name,
                          timestamp: game.timestamp
                        })).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())}
                        margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name" 
                          label={{ value: 'Session Number', position: 'insideBottomRight', offset: -10 }}
                        />
                        <YAxis />
                        <Tooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white p-3 border border-gray-300 shadow-md rounded">
                                  <p className="font-semibold">Session {label}</p>
                                  <p className="text-sm">{payload[0]?.payload.game}</p>
                                  <p className="text-sm">{payload[0]?.payload.date}</p>
                                  <div className="grid grid-cols-2 gap-2 mt-2">
                                    <div>
                                      <p className="text-xs text-gray-500">Score</p>
                                      <p className="font-semibold">{payload[0]?.value}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Duration</p>
                                      <p className="font-semibold">{payload[1]?.value} min</p>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="score" 
                          stroke="#8884d8" 
                          name="Score" 
                          strokeWidth={2} 
                          activeDot={{ r: 8 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="duration" 
                          stroke="#82ca9d" 
                          name="Duration (min)" 
                          strokeWidth={2} 
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            ) : viewMode === 'table' ? (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-4 bg-blue-500 text-white">
                  <h3 className="text-lg font-bold">Recent Games</h3>
                </div>
                <div className="p-6">
                  {gameReport.recent_games.length === 0 ? (
                    <div className="bg-yellow-100 text-yellow-700 p-4 rounded-md">
                      {t("no_recent_games") || "No recent games found"}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t("game_name") || "Game"}
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t("difficulty") || "Difficulty"}
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t("score") || "Score"}
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t("left_score") || "Left Score"}
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t("right_score") || "Right Score"}
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t("duration") || "Duration"}
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t("date") || "Date"}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {gameReport.recent_games.map((game, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">
                                {game.game_name}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  game.difficulty === 'EASY' ? 'bg-green-100 text-green-800' :
                                  game.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {game.difficulty}
                                </span>
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                {game.score}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                {game.left_score}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                {game.right_score}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                {formatDuration(game.duration_seconds)}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(game.timestamp)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </>
        )}
      </main>
    </div>
  );
}