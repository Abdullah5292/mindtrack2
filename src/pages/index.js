import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  People,
  SportsEsports,
  QuestionAnswer,
  Refresh,
  KeyboardArrowRight,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

// Color palette
const colors = {
  primary: '#4A63E7',    // Blue
  secondary: '#FF8042',  // Orange
  tertiary: '#E74A6C',   // Red
  background: '#2D1B2D', // Dark burgundy
  cardBg: 'rgba(0, 0, 0, 0.7)', // Transparent black
  text: '#FFFFFF',
  textSecondary: '#B4A7B1',
  chartGrid: 'rgba(255,255,255,0.1)',
  chartColors: ['#4A63E7', '#23B26D', '#FFA726', '#FF4C51'],
};

// Sample data
const playerStats = [
  { month: 'Jan', active: 18000, new: 12000 },
  { month: 'Feb', active: 15000, new: 10000 },
  { month: 'Mar', active: 5000, new: 4000 },
  { month: 'Apr', active: 3000, new: 2000 },
  { month: 'May', active: 2000, new: 1500 },
  { month: 'Jun', active: 8000, new: 6000 },
  { month: 'Jul', active: 9000, new: 7000 },
  { month: 'Aug', active: 12000, new: 9000 },
  { month: 'Sep', active: 15000, new: 11000 },
  { month: 'Oct', active: 17000, new: 12000 },
  { month: 'Nov', active: 14000, new: 10000 },
  { month: 'Dec', active: 11000, new: 8000 },
];

const locationData = [
  { name: 'Karachi', value: 45 },
  { name: 'Lahore', value: 35 },
  { name: 'Islamabad', value: 20 },
];

const locationColors = ['#4A63E7', '#FF8042', '#E74A6C'];

const StatCard = ({ title, value, icon, iconBg }) => (
  <Card 
    sx={{ 
      bgcolor: colors.cardBg,
      borderRadius: 4,
      height: '100%',
      position: 'relative',
      overflow: 'visible',
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box 
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          bgcolor: iconBg,
          borderRadius: '50%',
          width: 50,
          height: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </Box>
      <Typography variant="h3" sx={{ color: colors.text, mb: 1, fontSize: '2.5rem', fontWeight: 600 }}>
        {value}
      </Typography>
      <Typography variant="body1" sx={{ color: colors.textSecondary }}>
        {title}
      </Typography>
      <Box 
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          mt: 2,
          cursor: 'pointer',
          '&:hover': { opacity: 0.8 }
        }}
      >
        <Typography variant="body2" sx={{ color: colors.text }}>
          View more
        </Typography>
        <KeyboardArrowRight sx={{ color: colors.text, ml: 0.5 }} />
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress sx={{ color: colors.primary }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, bgcolor: colors.background, minHeight: '100vh' }}>
      <Grid container spacing={4}>
        {/* Stats Cards */}
        <Grid item xs={12} md={4}>
          <StatCard
            title="PLAYERS"
            value="941,000"
            icon={<People sx={{ color: '#fff', fontSize: 28 }} />}
            iconBg={colors.primary}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="GAMES"
            value="41"
            icon={<SportsEsports sx={{ color: '#fff', fontSize: 28 }} />}
            iconBg={colors.secondary}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="QUESTIONS"
            value="941"
            icon={<QuestionAnswer sx={{ color: '#fff', fontSize: 28 }} />}
            iconBg={colors.tertiary}
          />
        </Grid>

        {/* Player Statistics Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ bgcolor: colors.cardBg, borderRadius: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" sx={{ color: colors.text, fontWeight: 600 }}>
                  Player Statistics
                </Typography>
                <IconButton 
                  size="small" 
                  sx={{ 
                    color: colors.textSecondary,
                    '&:hover': { color: colors.text }
                  }}
                >
                  <Refresh />
                  <Typography variant="body2" sx={{ ml: 1 }}>Sync</Typography>
                </IconButton>
              </Box>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={playerStats} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke={colors.chartGrid}
                      vertical={false}
                    />
                    <XAxis 
                      dataKey="month" 
                      stroke={colors.textSecondary}
                      tick={{ fill: colors.textSecondary }}
                    />
                    <YAxis 
                      stroke={colors.textSecondary}
                      tick={{ fill: colors.textSecondary }}
                    />
                    <RechartsTooltip
                      contentStyle={{ 
                        backgroundColor: colors.cardBg,
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                      labelStyle={{ color: colors.text }}
                    />
                    <Bar dataKey="active" fill={colors.primary} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="new" fill={colors.chartGrid} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Player Locations */}
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: colors.cardBg, borderRadius: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ color: colors.text, fontWeight: 600, mb: 3 }}>
                Player Locations
              </Typography>
              <Box sx={{ height: 400, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ flex: 1 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={locationData}
                        cx="50%"
                        cy="50%"
                        innerRadius="70%"
                        outerRadius="90%"
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {locationData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={locationColors[index]}
                            stroke="transparent"
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                <Box sx={{ mt: 2 }}>
                  {locationData.map((item, index) => (
                    <Box 
                      key={item.name}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1
                      }}
                    >
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: locationColors[index],
                          mr: 1
                        }}
                      />
                      <Typography variant="body2" sx={{ color: colors.text }}>
                        {item.name}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

Dashboard.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Dashboard;
