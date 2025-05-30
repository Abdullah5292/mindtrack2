import React, { useState } from 'react';
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

  if (!playerData) return null;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
                label={`Level ${playerData.overview.level}`}
                size="small"
                sx={{ 
                  bgcolor: 'rgba(243, 201, 216, 0.2)',
                  color: '#F3C9D8',
                  fontWeight: 500,
                  backdropFilter: 'blur(10px)'
                }}
              />
              <Chip
                label={playerData.overview.rank}
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
          <Tab label="Achievements" />
          <Tab label="Social & Activity" />
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
              {/* XP Progress */}
              <Grid item xs={12}>
                <ProgressSection
                  title="XP Progress"
                  value={playerData.overview.xpPoints}
                  total={playerData.overview.nextLevelAt}
                />
              </Grid>

              {/* Key Stats */}
              <Grid item xs={12} md={4}>
                <StatCard
                  title="Games Played"
                  value={playerData.overview.gamesPlayed}
                  subtitle="Total games completed"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <StatCard
                  title="Average Score"
                  value={`${playerData.overview.averageScore}%`}
                  subtitle="Across all games"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <StatCard
                  title="Completion Rate"
                  value={`${playerData.overview.completionRate}%`}
                  subtitle="Games finished successfully"
                />
              </Grid>

              {/* Game Type Performance */}
              <Grid item xs={12}>
                <Card sx={{ 
                  p: 2,
                  bgcolor: 'rgba(0, 0, 0, 0.4)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                }}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'white', opacity: 0.9 }}>
                    Performance by Game Type
                  </Typography>
                  <Box sx={{ height: 250 }}>
                    <ResponsiveContainer>
                      <BarChart data={Object.entries(playerData.gameTypeStats).map(([type, stats]) => ({
                        name: type,
                        played: stats.played,
                        avgScore: stats.avgScore,
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
                        <Bar dataKey="played" fill="#F3C9D8" name="Games Played" />
                        <Bar dataKey="avgScore" fill="rgba(243, 201, 216, 0.5)" name="Average Score" />
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
                      <RadarChart data={Object.entries(playerData.skillLevels).map(([skill, value]) => ({
                        skill,
                        value,
                      }))}>
                        <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
                        <PolarAngleAxis dataKey="skill" stroke="rgba(255, 255, 255, 0.7)" />
                        <PolarRadiusAxis stroke="rgba(255, 255, 255, 0.7)" />
                        <Radar
                          name="Skills"
                          dataKey="value"
                          stroke="#F3C9D8"
                          fill="#F3C9D8"
                          fillOpacity={0.3}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </Box>
                </Card>
              </Grid>

              {/* Category Performance */}
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
                    Category Performance
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer>
                      <BarChart
                        layout="vertical"
                        data={Object.entries(playerData.categoryPerformance).map(([category, value]) => ({
                          category,
                          value,
                        }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis type="number" stroke="rgba(255, 255, 255, 0.7)" />
                        <YAxis dataKey="category" type="category" stroke="rgba(255, 255, 255, 0.7)" />
                        <Tooltip
                          contentStyle={{ 
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: 4,
                          }}
                          labelStyle={{ color: 'white' }}
                        />
                        <Bar dataKey="value" fill="#F3C9D8" />
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
              {/* Monthly Progress Chart */}
              <Grid item xs={12}>
                <Card sx={{ 
                  p: 2,
                  bgcolor: 'rgba(0, 0, 0, 0.4)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                }}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'white', opacity: 0.9 }}>
                    Monthly Progress
                  </Typography>
                  <Box sx={{ height: 250 }}>
                    <ResponsiveContainer>
                      <LineChart data={playerData.progressionStats.monthly.avgScores.map((score, index) => ({
                        month: index + 1,
                        score,
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis dataKey="month" stroke="rgba(255, 255, 255, 0.7)" />
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
                          dataKey="score" 
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

              {/* Daily Activity */}
              <Grid item xs={12}>
                <Card sx={{ 
                  p: 2,
                  bgcolor: 'rgba(0, 0, 0, 0.4)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                }}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'white', opacity: 0.9 }}>
                    Daily Activity (Last 7 Days)
                  </Typography>
                  <Box sx={{ height: 250 }}>
                    <ResponsiveContainer>
                      <BarChart data={playerData.progressionStats.daily.scores.map((score, index) => ({
                        day: index + 1,
                        score,
                        gamesPlayed: playerData.progressionStats.daily.gamesPlayed[index],
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis dataKey="day" stroke="rgba(255, 255, 255, 0.7)" />
                        <YAxis stroke="rgba(255, 255, 255, 0.7)" />
                        <Tooltip
                          contentStyle={{ 
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: 4,
                          }}
                          labelStyle={{ color: 'white' }}
                        />
                        <Bar dataKey="score" fill="#F3C9D8" name="Score" />
                        <Bar dataKey="gamesPlayed" fill="rgba(243, 201, 216, 0.5)" name="Games Played" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Achievements Tab */}
          <TabPanel value={tabValue} index={3}>
            <Grid container spacing={2}>
              {/* Achievement Progress */}
              <Grid item xs={12}>
                <Card sx={{ 
                  p: 2,
                  bgcolor: 'rgba(0, 0, 0, 0.4)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                }}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'white', opacity: 0.9 }}>
                    Achievement Categories
                  </Typography>
                  {Object.entries(playerData.achievements.categories).map(([category, count]) => (
                    <ProgressSection
                      key={category}
                      title={category.charAt(0).toUpperCase() + category.slice(1)}
                      value={count}
                      total={15}
                      color={category === 'special' ? 'rgba(243, 201, 216, 0.8)' : '#F3C9D8'}
                    />
                  ))}
                </Card>
              </Grid>

              {/* Recent Achievements */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ color: 'white', opacity: 0.9, mt: 1 }}>
                  Recent Achievements
                </Typography>
                <Grid container spacing={2}>
                  {playerData.achievements.recent.map((achievement) => (
                    <Grid item xs={12} md={6} key={achievement.id}>
                      <Card sx={{ 
                        bgcolor: 'rgba(0, 0, 0, 0.4)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 2,
                      }}>
                        <CardContent>
                          <Typography variant="h6" color={achievement.rarity === 'gold' ? '#F3C9D8' : 'white'} sx={{ opacity: 0.9 }}>
                            {achievement.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'white', opacity: 0.7 }}>
                            {achievement.description}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'white', opacity: 0.5, mt: 1, display: 'block' }}>
                            Earned on {new Date(achievement.earnedAt).toLocaleDateString()}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Social & Activity Tab */}
          <TabPanel value={tabValue} index={4}>
            <Grid container spacing={2}>
              {/* Social Stats */}
              <Grid item xs={12} md={4}>
                <StatCard
                  title="Team Games"
                  value={playerData.socialStats.teamGamesPlayed}
                  subtitle={`${playerData.socialStats.teamworkRating}/5 Rating`}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <StatCard
                  title="Leaderboard Rank"
                  value={`#${playerData.socialStats.leaderboardRank}`}
                  subtitle={`Better than ${playerData.socialStats.peersBeaten} players`}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <StatCard
                  title="Kudos Received"
                  value={playerData.socialStats.kudosReceived}
                  subtitle="From other players"
                />
              </Grid>

              {/* Recent Activity */}
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
                  {playerData.recentActivity.games.map((activity, index) => (
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
                          {activity.gameName}
                        </Typography>
                        <Box display="flex" gap={2} mt={1}>
                          <Typography variant="body2" color="#F3C9D8">
                            Score: {activity.score}%
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'white', opacity: 0.7 }}>
                            Duration: {activity.duration}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'white', opacity: 0.7 }}>
                            Difficulty: {activity.difficulty}
                          </Typography>
                        </Box>
                        <Box display="flex" gap={1} mt={1}>
                          {activity.skillsImproved.map((skill) => (
                            <Chip
                              key={skill}
                              label={skill}
                              size="small"
                              sx={{ 
                                bgcolor: 'rgba(243, 201, 216, 0.2)',
                                color: '#F3C9D8',
                                fontWeight: 500,
                                backdropFilter: 'blur(10px)'
                              }}
                            />
                          ))}
                        </Box>
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

export default StatsDialog;
