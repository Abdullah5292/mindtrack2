import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Tabs,
  Tab,
  Grid,
  Avatar,
  Chip,
  LinearProgress,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
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
import { getOverviewStats, getSkillLevels, getCategoryPerformance, getProgressionStats, getRecentActivity } from 'src/utils/stats';

// Custom components for different stat sections
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
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (open && playerData) {
      setStats(playerData);
    }
  }, [open, playerData]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (!playerData) return null;

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
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <CircularProgress sx={{ color: '#F3C9D8' }} />
            </Box>
          ) : (
            <>
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
            </>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default StatsDialog;
