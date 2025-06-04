import React, { useCallback, useState } from 'react';
import {
  Box,
  Card,
  Container,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Avatar,
  InputAdornment,
  OutlinedInput,
  SvgIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  LinearProgress,
  Divider,
  Chip,
  IconButton,
  Tabs,
  Tab,
  CircularProgress,
  CardContent,
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { getInitials } from 'src/utils/get-initials';
import Image from 'next/image';
import WithDrawer from 'src/utils/with-drawer';
import WithModal from 'src/utils/with-modal';
import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import CloseIcon from '@mui/icons-material/Close';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

const dummyPlayers = [
  {
    id: 0,
    displayName: "Alex Thompson",
    email: "a.thompson@university.edu",
    education: 3,
    createdAt: "2023-08-01T10:00:00Z",
    profilePhoto: "/assets/avatars/avatar-4.png",
    stats: {
      overview: {
        totalGames: 120,
        accuracy: 95.8,
        overallPerformanceRating: 98.2,
        level: 25,
        rank: "Diamond",
        totalPlayTime: "156h 30m",
        completionRate: 97,
        averageResponseTime: "45s",
        streakDays: 28
      },
      skillLevels: {
        auditory: {
          level: 15,
          experiencePoints: 2500,
          progressToNext: 500,
          mastery: "Expert",
          recentImprovement: "+2.5%"
        },
        visual: {
          level: 16,
          experiencePoints: 2800,
          progressToNext: 200,
          mastery: "Master",
          recentImprovement: "+3.1%"
        },
        textual: {
          level: 14,
          experiencePoints: 2200,
          progressToNext: 800,
          mastery: "Expert",
          recentImprovement: "+1.8%"
        }
      },
      categoryPerformance: {
        difficulty: {
          easy: {
            averageScore: 99,
            accuracy: 99.5,
            timeTaken: 90,
            completionRate: 100,
            masteryLevel: "Perfect"
          },
          medium: {
            averageScore: 97,
            accuracy: 98,
            timeTaken: 150,
            completionRate: 98,
            masteryLevel: "Expert"
          },
          hard: {
            averageScore: 95,
            accuracy: 96,
            timeTaken: 210,
            completionRate: 95,
            masteryLevel: "Advanced"
          },
          advanced: {
            averageScore: 92,
            accuracy: 94,
            timeTaken: 270,
            completionRate: 90,
            masteryLevel: "Proficient"
          },
          exceptional: {
            averageScore: 88,
            accuracy: 90,
            timeTaken: 330,
            completionRate: 85,
            masteryLevel: "Competent"
          }
        },
        questionType: {
          textual: {
            averageScore: 96,
            accuracy: 97,
            timeTaken: 160,
            masteryLevel: "Expert",
            improvement: "+2.3%"
          },
          image: {
            averageScore: 98,
            accuracy: 99,
            timeTaken: 130,
            masteryLevel: "Master",
            improvement: "+3.5%"
          },
          auditory: {
            averageScore: 94,
            accuracy: 95,
            timeTaken: 180,
            masteryLevel: "Expert",
            improvement: "+1.9%"
          }
        }
      },
      progressionStats: {
        timeframe: "weekly",
        improvementTrend: 12.5,
        activityFrequency: 25,
        performanceDeltas: {
          accuracy: 5.8,
          speed: 3.2,
          consistency: 4.5
        },
        learningCurve: {
          currentPhase: "Advanced",
          nextMilestone: "Master",
          progressToNext: 75,
          estimatedCompletion: "2 weeks"
        },
        weeklyGoals: {
          completed: 8,
          total: 10,
          streak: 4,
          nextReward: "30 Day Streak Badge"
        }
      },
      achievements: {
        total: 45,
        recent: [
          {
            id: 1,
            name: "Speed Demon",
            description: "Complete 10 games with 95%+ accuracy under 2 minutes",
            earnedAt: "2024-03-15",
            rarity: "legendary",
            reward: "Special Theme"
          },
          {
            id: 2,
            name: "Perfect Streak",
            description: "Maintain 100% accuracy for 5 consecutive games",
            earnedAt: "2024-03-14",
            rarity: "epic",
            reward: "XP Boost"
          }
        ],
        categories: {
          speed: 12,
          accuracy: 15,
          consistency: 8,
          special: 10
        }
      },
      recentActivity: {
        activities: [
          {
            id: 1,
            type: "game_played",
            description: "Completed Master Level Challenge",
            timestamp: "2024-03-15T16:30:00Z",
            gameId: 129,
            score: 98,
            timeTaken: "45m",
            skillsImproved: ["visual", "auditory"],
            newRecords: ["Fastest Completion", "Highest Score"]
          },
          {
            id: 2,
            type: "achievement_earned",
            description: "Earned 'Speed Demon' Achievement",
            timestamp: "2024-03-15T15:45:00Z",
            rarity: "legendary",
            reward: "Special Theme"
          },
          {
            id: 3,
            type: "level_up",
            description: "Reached Level 25",
            timestamp: "2024-03-14T14:20:00Z",
            rewards: ["New Badge", "Special Access", "XP Boost"]
          }
        ],
        streak: {
          current: 28,
          longest: 45,
          nextReward: "30 Day Streak Badge"
        }
      },
      recommendations: {
        nextGames: [
          {
            id: 1,
            name: "Master Level Strategy",
            difficulty: "Exceptional",
            estimatedTime: "60m",
            skillsRequired: ["visual", "auditory"],
            reward: "Master Badge"
          },
          {
            id: 2,
            name: "Speed Challenge",
            difficulty: "Advanced",
            estimatedTime: "30m",
            skillsRequired: ["textual", "visual"],
            reward: "Speed Master Badge"
          }
        ]
      }
    }
  },
  {
    id: 1,
    displayName: "Sarah Johnson",
    email: "sarah.j@university.edu",
    education: 2,
    createdAt: "2023-09-15T08:30:00Z",
    profilePhoto: "/assets/avatars/avatar-1.png",
    stats: {
      overview: {
        totalGames: 45,
        accuracy: 82.5,
        overallPerformanceRating: 88.7,
        level: 15,
        rank: "Gold"
      },
      skillLevels: {
        auditory: {
          level: 8,
          experiencePoints: 750,
          progressToNext: 250
        },
        visual: {
          level: 9,
          experiencePoints: 850,
          progressToNext: 150
        },
        textual: {
          level: 7,
          experiencePoints: 650,
          progressToNext: 350
        }
      },
      categoryPerformance: {
        difficulty: {
          easy: { averageScore: 95, accuracy: 98, timeTaken: 120 },
          medium: { averageScore: 85, accuracy: 88, timeTaken: 180 },
          hard: { averageScore: 75, accuracy: 78, timeTaken: 240 },
          advanced: { averageScore: 65, accuracy: 68, timeTaken: 300 },
          exceptional: { averageScore: 55, accuracy: 58, timeTaken: 360 }
        },
        questionType: {
          textual: { averageScore: 82, accuracy: 85, timeTaken: 180 },
          image: { averageScore: 88, accuracy: 90, timeTaken: 150 },
          auditory: { averageScore: 78, accuracy: 80, timeTaken: 200 }
        }
      },
      progressionStats: {
        timeframe: "weekly",
        improvementTrend: 5.2,
        activityFrequency: 12,
        performanceDeltas: {
          accuracy: 3.5,
          speed: -0.8,
          consistency: 2.1
        }
      },
      recentActivity: {
        activities: [
          {
            id: 1,
            type: "game_played",
            description: "Completed Advanced Strategy Challenge",
            timestamp: "2024-03-15T14:30:00Z",
            gameId: 123,
            score: 85
          },
          {
            id: 2,
            type: "game_played",
            description: "Finished Business Simulation",
            timestamp: "2024-03-14T16:45:00Z",
            gameId: 124,
            score: 92
          },
          {
            id: 3,
            type: "achievement_earned",
            description: "Earned 'Quick Thinker' Achievement",
            timestamp: "2024-03-13T10:15:00Z"
          }
        ]
      }
    }
  },
  {
    id: 2,
    displayName: "Michael Chen",
    email: "m.chen@university.edu",
    education: 3,
    createdAt: "2023-10-01T09:15:00Z",
    profilePhoto: "/assets/avatars/avatar-2.png",
    stats: {
      overview: {
        totalGames: 38,
        accuracy: 88.2,
        overallPerformanceRating: 92.5,
        level: 18,
        rank: "Platinum"
      },
      skillLevels: {
        auditory: {
          level: 9,
          experiencePoints: 900,
          progressToNext: 100
        },
        visual: {
          level: 10,
          experiencePoints: 1000,
          progressToNext: 0
        },
        textual: {
          level: 8,
          experiencePoints: 800,
          progressToNext: 200
        }
      },
      categoryPerformance: {
        difficulty: {
          easy: { averageScore: 98, accuracy: 99, timeTaken: 100 },
          medium: { averageScore: 90, accuracy: 92, timeTaken: 160 },
          hard: { averageScore: 85, accuracy: 87, timeTaken: 220 },
          advanced: { averageScore: 75, accuracy: 78, timeTaken: 280 },
          exceptional: { averageScore: 65, accuracy: 68, timeTaken: 340 }
        },
        questionType: {
          textual: { averageScore: 88, accuracy: 90, timeTaken: 170 },
          image: { averageScore: 92, accuracy: 94, timeTaken: 140 },
          auditory: { averageScore: 85, accuracy: 87, timeTaken: 190 }
        }
      },
      progressionStats: {
        timeframe: "weekly",
        improvementTrend: 7.8,
        activityFrequency: 15,
        performanceDeltas: {
          accuracy: 4.2,
          speed: -0.5,
          consistency: 3.1
        }
      },
      recentActivity: {
        activities: [
          {
            id: 1,
            type: "game_played",
            description: "Completed Expert Level Challenge",
            timestamp: "2024-03-15T15:20:00Z",
            gameId: 125,
            score: 95
          },
          {
            id: 2,
            type: "game_played",
            description: "Finished Advanced Simulation",
            timestamp: "2024-03-14T17:30:00Z",
            gameId: 126,
            score: 98
          },
          {
            id: 3,
            type: "achievement_earned",
            description: "Earned 'Master Strategist' Achievement",
            timestamp: "2024-03-13T11:45:00Z"
          }
        ]
      }
    }
  },
  {
    id: 3,
    displayName: "Emma Davis",
    email: "e.davis@university.edu",
    education: 1,
    createdAt: "2023-11-20T14:20:00Z",
    profilePhoto: "/assets/avatars/avatar-3.png",
    stats: {
      overview: {
        totalGames: 52,
        accuracy: 79.8,
        overallPerformanceRating: 82.3,
        level: 12,
        rank: "Silver"
      },
      skillLevels: {
        auditory: {
          level: 6,
          experiencePoints: 550,
          progressToNext: 450
        },
        visual: {
          level: 7,
          experiencePoints: 650,
          progressToNext: 350
        },
        textual: {
          level: 8,
          experiencePoints: 750,
          progressToNext: 250
        }
      },
      categoryPerformance: {
        difficulty: {
          easy: { averageScore: 90, accuracy: 92, timeTaken: 130 },
          medium: { averageScore: 80, accuracy: 83, timeTaken: 190 },
          hard: { averageScore: 70, accuracy: 73, timeTaken: 250 },
          advanced: { averageScore: 60, accuracy: 63, timeTaken: 310 },
          exceptional: { averageScore: 50, accuracy: 53, timeTaken: 370 }
        },
        questionType: {
          textual: { averageScore: 85, accuracy: 87, timeTaken: 190 },
          image: { averageScore: 78, accuracy: 80, timeTaken: 160 },
          auditory: { averageScore: 75, accuracy: 77, timeTaken: 210 }
        }
      },
      progressionStats: {
        timeframe: "weekly",
        improvementTrend: 3.5,
        activityFrequency: 10,
        performanceDeltas: {
          accuracy: 2.8,
          speed: -1.2,
          consistency: 1.5
        }
      },
      recentActivity: {
        activities: [
          {
            id: 1,
            type: "game_played",
            description: "Completed Intermediate Challenge",
            timestamp: "2024-03-15T13:15:00Z",
            gameId: 127,
            score: 82
          },
          {
            id: 2,
            type: "game_played",
            description: "Finished Basic Simulation",
            timestamp: "2024-03-14T15:30:00Z",
            gameId: 128,
            score: 85
          },
          {
            id: 3,
            type: "achievement_earned",
            description: "Earned 'Rising Star' Achievement",
            timestamp: "2024-03-13T09:45:00Z"
          }
        ]
      }
    }
  }
];

// Define helper components and StatsDialog here
const StatCard = ({ title, value, subtitle, icon, color = "#F3C9D8" }) => (
  <Card sx={{
    height: '100%',
    bgcolor: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
  }}>
    <CardContent>
      <Box display="flex" alignItems="center" mb={1}>
        {icon && (
          <Box mr={1} color={color}>
            {icon}
          </Box>
        )}
        <Typography variant="h6" color="white" sx={{ opacity: 0.9 }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" color={color} gutterBottom>
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="body2" sx={{ color: 'white', opacity: 0.7 }}>
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const ProgressSection = ({ title, value, total, color = "#F3C9D8" }) => (
  <Box mb={2}>
    <Box display="flex" justifyContent="space-between" mb={1}>
      <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
        {value}/{total}
      </Typography>
    </Box>
    <LinearProgress
      variant="determinate"
      value={(value / total) * 100}
      sx={{
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        '& .MuiLinearProgress-bar': {
          backgroundColor: color,
          borderRadius: 3,
        },
      }}
    />
  </Box>
);

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index} style={{ padding: '16px 0' }}>
    {value === index && children}
  </div>
);

const StatsDialog = ({ open, onClose, playerData }) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (!playerData) return null;

  const { stats } = playerData;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(10px)',
          backgroundImage: 'none',
          height: '90vh',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <DialogTitle
        sx={{
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(10px)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={playerData.profilePhoto}
            sx={{ width: 48, height: 48 }}
          />
          <Box>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>Player Statistics</Typography>
            <Box display="flex" gap={1} mt={0.5}>
              <Chip
                label={`Level ${stats?.overview?.level || 1}`}
                size="small"
                sx={{
                  bgcolor: 'rgba(243, 201, 216, 0.2)',
                  color: '#F3C9D8',
                  fontWeight: 500,
                  backdropFilter: 'blur(10px)'
                }}
              />
              <Chip
                label={stats?.overview?.rank || 'Bronze'}
                size="small"
                sx={{
                  bgcolor: 'rgba(243, 201, 216, 0.8)',
                  color: 'rgba(0, 0, 0, 0.8)',
                  fontWeight: 500
                }}
              />
            </Box>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#F3C9D8' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{
        p: 2,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            '& .MuiTab-root': {
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.875rem',
              minHeight: 48,
              '&.Mui-selected': {
                color: '#F3C9D8',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#F3C9D8',
            },
          }}
        >
          <Tab label="Overview" />
          <Tab label="Skills & Performance" />
          <Tab label="Progress" />
          <Tab label="Recent Activity" />
        </Tabs>

        <Box sx={{
          flexGrow: 1,
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(243, 201, 216, 0.3)',
            borderRadius: '4px',
            '&:hover': {
              background: 'rgba(243, 201, 216, 0.5)',
            },
          },
        }}>
          {/* Overview Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={2}>
              {/* Key Stats */}
              <Grid item xs={12} md={4}>
                <StatCard
                  title="Total Games"
                  value={stats?.overview?.totalGames || 0}
                  subtitle="Games completed"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <StatCard
                  title="Accuracy"
                  value={`${stats?.overview?.accuracy?.toFixed(1) || 0}%`}
                  subtitle="Overall accuracy"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <StatCard
                  title="Performance"
                  value={`${stats?.overview?.overallPerformanceRating?.toFixed(1) || 0}%`}
                  subtitle="Overall performance"
                />
              </Grid>

              {/* Category Performance */}
              <Grid item xs={12}>
                <Card sx={{
                  p: 2,
                  bgcolor: 'rgba(0, 0, 0, 0.4)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                }}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'white', opacity: 0.9 }}>
                    Performance by Category
                  </Typography>
                  <Box sx={{ height: 250 }}>
                    <ResponsiveContainer>
                      <BarChart data={Object.entries(stats?.categoryPerformance?.difficulty || {}).map(([type, stats]) => ({
                        name: type,
                        score: stats.averageScore,
                        accuracy: stats.accuracy,
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.7)" />
                        <YAxis stroke="rgba(255, 255, 255, 0.7)" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: 4,
                          }}
                          labelStyle={{ color: 'white' }}
                        />
                        <Legend />
                        <Bar dataKey="score" fill="#F3C9D8" name="Average Score" />
                        <Bar dataKey="accuracy" fill="rgba(243, 201, 216, 0.5)" name="Accuracy" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Skills & Performance Tab */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={2}>
              {/* Skill Radar Chart */}
              <Grid item xs={12} md={6}>
                <Card sx={{
                  p: 2,
                  bgcolor: 'rgba(0, 0, 0, 0.4)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                  height: '100%'
                }}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'white', opacity: 0.9 }}>
                    Skill Levels
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer>
                      <RadarChart data={Object.entries(stats?.skillLevels || {}).map(([skill, data]) => ({
                        skill,
                        level: data.level,
                        experience: data.experiencePoints,
                      }))}>
                        <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
                        <PolarAngleAxis dataKey="skill" stroke="rgba(255, 255, 255, 0.7)" />
                        <PolarRadiusAxis stroke="rgba(255, 255, 255, 0.7)" />
                        <Radar
                          name="Level"
                          dataKey="level"
                          stroke="#F3C9D8"
                          fill="#F3C9D8"
                          fillOpacity={0.3}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </Box>
                </Card>
              </Grid>

              {/* Question Type Performance */}
              <Grid item xs={12} md={6}>
                <Card sx={{
                  p: 2,
                  bgcolor: 'rgba(0, 0, 0, 0.4)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                  height: '100%'
                }}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'white', opacity: 0.9 }}>
                    Question Type Performance
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer>
                      <BarChart
                        layout="vertical"
                        data={Object.entries(stats?.categoryPerformance?.questionType || {}).map(([type, stats]) => ({
                          type,
                          score: stats.averageScore,
                          accuracy: stats.accuracy,
                        }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis type="number" stroke="rgba(255, 255, 255, 0.7)" />
                        <YAxis dataKey="type" type="category" stroke="rgba(255, 255, 255, 0.7)" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: 4,
                          }}
                          labelStyle={{ color: 'white' }}
                        />
                        <Bar dataKey="score" fill="#F3C9D8" name="Average Score" />
                        <Bar dataKey="accuracy" fill="rgba(243, 201, 216, 0.5)" name="Accuracy" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Progress Tab */}
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={2}>
              {/* Progress Chart */}
              <Grid item xs={12}>
                <Card sx={{
                  p: 2,
                  bgcolor: 'rgba(0, 0, 0, 0.4)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                }}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'white', opacity: 0.9 }}>
                    Progress Over Time
                  </Typography>
                  <Box sx={{ height: 250 }}>
                    <ResponsiveContainer>
                      <LineChart data={stats?.progressionStats?.performanceDeltas ? [
                        { name: 'Accuracy', value: stats.progressionStats.performanceDeltas.accuracy },
                        { name: 'Speed', value: stats.progressionStats.performanceDeltas.speed },
                        { name: 'Consistency', value: stats.progressionStats.performanceDeltas.consistency },
                      ] : []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.7)" />
                        <YAxis stroke="rgba(255, 255, 255, 0.7)" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: 4,
                          }}
                          labelStyle={{ color: 'white' }}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#F3C9D8"
                          strokeWidth={2}
                          dot={{ fill: '#F3C9D8', r: 4 }}
                          activeDot={{ r: 6, fill: '#F3C9D8' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Card>
              </Grid>

              {/* Activity Stats */}
              <Grid item xs={12}>
                <Card sx={{
                  p: 2,
                  bgcolor: 'rgba(0, 0, 0, 0.4)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                }}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'white', opacity: 0.9 }}>
                    Activity Statistics
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <StatCard
                        title="Activity Frequency"
                        value={stats?.progressionStats?.activityFrequency || 0}
                        subtitle="Recent activities"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <StatCard
                        title="Improvement Trend"
                        value={`${stats?.progressionStats?.improvementTrend?.toFixed(1) || 0}%`}
                        subtitle="Performance change"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <StatCard
                        title="Timeframe"
                        value={stats?.progressionStats?.timeframe || 'weekly'}
                        subtitle="Current period"
                      />
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Recent Activity Tab */}
          <TabPanel value={tabValue} index={3}>
            <Grid container spacing={2}>
              {/* Recent Activity List */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ color: 'white', opacity: 0.9, mt: 1 }}>
                  Recent Activity
                </Typography>
                <Box sx={{
                  maxHeight: 400,
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(243, 201, 216, 0.3)',
                    borderRadius: '4px',
                    '&:hover': {
                      background: 'rgba(243, 201, 216, 0.5)',
                    },
                  },
                }}>
                  {stats?.recentActivity?.activities?.map((activity, index) => (
                    <Card
                      key={index}
                      sx={{
                        mb: 2,
                        bgcolor: 'rgba(0, 0, 0, 0.4)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 2,
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" sx={{ color: 'white', opacity: 0.9 }}>
                          {activity.description}
                        </Typography>
                        <Box display="flex" gap={2} mt={1}>
                          <Typography variant="body2" color="#F3C9D8">
                            Type: {activity.type}
                          </Typography>
                          {activity.score && (
                            <Typography variant="body2" sx={{ color: 'white', opacity: 0.7 }}>
                              Score: {activity.score}
                            </Typography>
                          )}
                        </Box>
                        <Typography variant="caption" sx={{ color: 'white', opacity: 0.5, mt: 1, display: 'block' }}>
                          {new Date(activity.timestamp).toLocaleString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </TabPanel>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

const educationMap = {
  1: "Business",
  2: "Social Sciences",
  3: "CS & Math"
};

const Page = (props) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [openStatsDialog, setOpenStatsDialog] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const handleOpenStatsDialog = (player) => {
    setSelectedPlayer(player);
    setOpenStatsDialog(true);
  };

  const handleCloseStatsDialog = () => {
    setOpenStatsDialog(false);
    setSelectedPlayer(null);
    setTabValue(0);
  };

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredPlayers = dummyPlayers.filter(player =>
    player.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full h-full relative">
      <Image
        src="/assets/Background.svg"
        alt="Background"
        fill
        style={{ objectFit: "cover" }}
        priority
      />

      <Box component="main" sx={{ flexGrow: 1, py: 5 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4" sx={{ color: "white", zIndex: 140 }}>Dummy Players</Typography>
              </Stack>
            </Stack>
            <Card sx={{ p: 2, backgroundColor: 'white' }}>
              <OutlinedInput
                value={searchQuery}
                onChange={handleSearchChange}
                fullWidth
                placeholder="Search Players"
                startAdornment={
                  <InputAdornment position="start">
                    <SvgIcon color="action" fontSize="small">
                      <MagnifyingGlassIcon />
                    </SvgIcon>
                  </InputAdornment>
                }
                sx={{
                  maxWidth: 500,
                  backgroundColor: 'white',
                  color: 'black',
                  '& input': {
                    color: 'black',
                  },
                  '&::placeholder': {
                    color: 'black',
                    opacity: 1,
                  },
                  '&:hover': {
                    backgroundColor: 'white',
                  },
                  '& fieldset': {
                    border: 'none !important',
                  },
                  '&:hover fieldset': {
                    border: 'none !important',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'white !important',
                  },
                  '&.Mui-focused fieldset': {
                    border: 'none !important',
                  },
                }}
              />
            </Card>
            <Card>
              <Scrollbar>
                <Box sx={{ minWidth: 800 }}>
                  <Table sx={{ backgroundColor: "rgba(0, 0, 0, 0.6)", color: "white", border: "none" }}>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}>
                        <TableCell sx={{ color: "white", borderBottom: "none" }} align="left">Name</TableCell>
                        <TableCell sx={{ color: "white", borderBottom: "none" }}>Email</TableCell>
                        <TableCell sx={{ color: "white", borderBottom: "none" }}>Education</TableCell>
                        <TableCell sx={{ color: "white", borderBottom: "none" }}>Created At</TableCell>
                        <TableCell sx={{ color: "white", borderBottom: "none" }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredPlayers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ color: "white" }}>
                            No players found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredPlayers.map((player) => (
                          <TableRow key={player.id} sx={{ backgroundColor: "transparent", borderBottom: "none", minHeight: '60px' }}>
                            <TableCell sx={{ color: "white", padding: '12px' }}>
                              <Stack alignItems="center" direction="row" spacing={2}>
                                <Avatar src={player?.profilePhoto}>{getInitials(player.displayName)}</Avatar>
                                <Typography variant="subtitle2" sx={{ color: "white" }}>
                                  {player.displayName}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell sx={{ color: "white", padding: '12px' }}>{player.email}</TableCell>
                            <TableCell sx={{ color: "white", padding: '12px' }}>
                              {educationMap[player.education] || "N/A"}
                            </TableCell>
                            <TableCell sx={{ color: "white", padding: '12px' }}>
                              {new Date(player.createdAt).toLocaleString()}
                            </TableCell>
                            <TableCell sx={{ padding: '12px' }}>
                              <Button
                                variant="contained"
                                color="primary"
                                sx={{
                                  backgroundColor: '#5f1630',
                                  '&:hover': {
                                    backgroundColor: '#4d0e26',
                                  },
                                  '&:active': {
                                    backgroundColor: '#4d0e26',
                                  },
                                }}
                                onClick={() => handleOpenStatsDialog(player)}
                              >
                                View Stats
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </Box>
              </Scrollbar>
              <TablePagination
                component="div"
                count={filteredPlayers.length}
                sx={{ borderTop: "none", backgroundColor: "transparent", color: "white" }}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </Card>
          </Stack>
        </Container>
      </Box>
      {selectedPlayer && (
        <StatsDialog
          open={openStatsDialog}
          onClose={handleCloseStatsDialog}
          playerData={selectedPlayer}
        />
      )}
    </div>
  );
};

// Wrapping with Modal and Drawer
const ModalWrapped = WithModal(Page);
const DrawerWrapped = WithDrawer(ModalWrapped);
DrawerWrapped.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default DrawerWrapped;