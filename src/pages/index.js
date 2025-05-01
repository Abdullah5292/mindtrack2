import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import React from 'react';
import { Box, Card, CardContent, CardHeader, Grid, Stack, Typography, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import { Chart } from 'src/components/chart';
import ComputerDesktopIcon from '@heroicons/react/24/solid/ComputerDesktopIcon';
import DeviceTabletIcon from '@heroicons/react/24/solid/DeviceTabletIcon';
import PhoneIcon from '@heroicons/react/24/solid/PhoneIcon';
import { Avatar, SvgIcon } from '@mui/material';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

// Dummy Data
const trafficData = [60, 25, 15];
const trafficLabels = ['Desktop', 'Tablet', 'Phone'];
const totalCustomers = '1,245';
const totalProfit = '$15,000';
const salesData = [2000, 3000, 2500, 4000, 3500, 4200];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const useChartOptions = (labels) => {
  const theme = useTheme();
  return {
    chart: {
      background: 'transparent'
    },
    colors: [
      theme.palette.primary.main,
      theme.palette.success.main,
      theme.palette.warning.main
    ],
    dataLabels: {
      enabled: false
    },
    labels,
    legend: {
      show: false
    },
    plotOptions: {
      pie: {
        expandOnClick: false
      }
    },
    stroke: {
      width: 0
    },
    theme: {
      mode: theme.palette.mode
    },
    tooltip: {
      fillSeriesColor: false
    }
  };
};

const Page = () => {
  const chartOptions = useChartOptions(trafficLabels);

  return (
    <Box sx={{
      p: 3,
      position: 'relative',
      zIndex: 1,
      background: 'rgba(0,0,0,0.5)' // Make background darker if necessary
    }}>
      {/* Dashboard Grid */}
      <Grid container spacing={2}> {/* Reduced spacing from 3 to 2 */}
        {/* Total Customers Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#000000', color: '#ffffff' }}>
            <CardContent>
              <Stack
                alignItems="flex-start"
                direction="row"
                justifyContent="space-between"
                spacing={3}
              >
                <Stack spacing={1}>
                  <Typography color="text.secondary" variant="overline">
                    Total Customers
                  </Typography>
                  <Typography variant="h4">{totalCustomers}</Typography>
                </Stack>
                <Avatar sx={{ backgroundColor: 'success.main', height: 56, width: 56 }}>
                  <SvgIcon><ComputerDesktopIcon /></SvgIcon>
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Profit Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#000000', color: '#ffffff' }}>
            <CardContent>
              <Stack
                alignItems="flex-start"
                direction="row"
                justifyContent="space-between"
                spacing={3}
              >
                <Stack spacing={1}>
                  <Typography color="text.secondary" variant="overline">
                    Total Profit
                  </Typography>
                  <Typography variant="h4">{totalProfit}</Typography>
                </Stack>
                <Avatar sx={{ backgroundColor: 'primary.main', height: 56, width: 56 }}>
                  <SvgIcon><DeviceTabletIcon /></SvgIcon>
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Traffic Source Donut Chart */}
        <Grid item xs={12} sm={6} md={6}>
          <Card sx={{ backgroundColor: '#000000', color: '#ffffff' }}>
            <CardHeader title="Traffic Source" sx={{ color: '#ffffff' }} />
            <CardContent>
              <Chart
                height={300}
                options={chartOptions}
                series={trafficData}
                type="donut"
                width="100%"
              />
              <Stack
                alignItems="center"
                direction="row"
                justifyContent="center"
                spacing={2}
                sx={{ mt: 2 }}
              >
                {trafficData.map((item, index) => {
                  const label = trafficLabels[index];
                  const iconMap = {
                    Desktop: <SvgIcon><ComputerDesktopIcon /></SvgIcon>,
                    Tablet: <SvgIcon><DeviceTabletIcon /></SvgIcon>,
                    Phone: <SvgIcon><PhoneIcon /></SvgIcon>,
                  };
                  return (
                    <Box
                      key={label}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                      }}
                    >
                      {iconMap[label]}
                      <Typography sx={{ my: 1, color: '#ffffff' }} variant="h6">
                        {label}
                      </Typography>
                      <Typography sx={{ color: '#ffffff' }} color="text.secondary" variant="subtitle2">
                        {item}%
                      </Typography>
                    </Box>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Sales Over Time Line Chart */}
        <Grid item xs={12} sm={6} md={6}>
          <Card sx={{ backgroundColor: '#000000', color: '#ffffff' }}>
            <CardHeader title="Sales Over Time" sx={{ color: '#ffffff' }} />
            <CardContent>
              <Chart
                height={300}
                options={{
                  chart: {
                    background: 'transparent'
                  },
                  colors: ['#00C4B4'],
                  dataLabels: {
                    enabled: false
                  },
                  labels: months,
                  stroke: {
                    width: 3
                  },
                  theme: {
                    mode: 'dark'
                  },
                  tooltip: {
                    fillSeriesColor: false
                  },
                  xaxis: {
                    categories: months
                  },
                }}
                series={[{ name: 'Sales', data: salesData }]}
                type="line"
                width="100%"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
