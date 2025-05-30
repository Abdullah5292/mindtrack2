import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, Container, Divider, FormControl, Grid, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, Stack, SvgIcon, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { Scrollbar } from "src/components/scrollbar";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { authenticatedAxios } from "src/utils/axios";
import { getPlayers, getPlayerById } from "src/utils/client";
import { getInitials } from "src/utils/get-initials";
import Image from "next/image";
import WithDrawer from "src/utils/with-drawer";
import WithModal from "src/utils/with-modal";
import StatsDialog from "src/components/statsDialog";

// Dummy player data with comprehensive statistics
const dummyPlayers = [
  {
    id: 1,
    displayName: "Sarah Johnson",
    email: "sarah.j@university.edu",
    education: 2,
    createdAt: "2023-09-15T08:30:00Z",
    profilePhoto: "/assets/avatars/avatar-1.png",
    stats: {
      overview: {
        gamesPlayed: 45,
        averageScore: 82.5,
        highestScore: 98,
        totalPlayTime: "32h 15m",
        completionRate: 89,
        rank: "Gold",
        level: 15,
        xpPoints: 3850,
        nextLevelAt: 4000
      },
      skillLevels: {
        problemSolving: 85,
        criticalThinking: 92,
        decisionMaking: 78,
        timeManagement: 88,
        adaptability: 90,
        teamwork: 85
      },
      categoryPerformance: {
        businessStrategy: 88,
        finance: 82,
        marketing: 90,
        operations: 85,
        leadership: 87,
        innovation: 84
      },
      gameTypeStats: {
        simulation: {
          played: 20,
          avgScore: 85,
          highScore: 95,
          timeSpent: "15h 20m"
        },
        puzzle: {
          played: 15,
          avgScore: 78,
          highScore: 88,
          timeSpent: "10h 45m"
        },
        strategy: {
          played: 10,
          avgScore: 92,
          highScore: 98,
          timeSpent: "6h 10m"
        }
      },
      progressionStats: {
        daily: {
          gamesPlayed: [3, 4, 2, 5, 3, 4, 2], // Last 7 days
          scores: [85, 88, 82, 90, 87, 89, 86],
          timeSpent: ["1h", "1.5h", "45m", "2h", "1h", "1.5h", "1h"]
        },
        weekly: {
          gamesPlayed: [15, 18, 12, 20], // Last 4 weeks
          avgScores: [84, 86, 88, 87],
          timeSpent: ["8h", "10h", "6h", "8h"]
        },
        monthly: {
          gamesPlayed: [45, 52, 38, 48, 50, 55], // Last 6 months
          avgScores: [82, 84, 86, 85, 88, 87],
          timeSpent: ["32h", "38h", "28h", "35h", "36h", "40h"]
        }
      },
      achievements: {
        total: 28,
        recent: [
          {
            id: 1,
            name: "Strategy Master",
            description: "Complete 10 strategy games with 90%+ score",
            earnedAt: "2024-03-10",
            rarity: "gold"
          },
          {
            id: 2,
            name: "Quick Thinker",
            description: "Solve 5 puzzles under 2 minutes each",
            earnedAt: "2024-03-08",
            rarity: "silver"
          }
        ],
        categories: {
          gameplay: 10,
          skill: 8,
          social: 5,
          special: 5
        }
      },
      learningPath: {
        currentLevel: "Advanced",
        progress: 75,
        recommendedGames: [
          {
            id: 1,
            name: "Advanced Strategy Simulation",
            difficulty: "Hard",
            relevance: 95
          },
          {
            id: 2,
            name: "Leadership Challenge",
            difficulty: "Medium",
            relevance: 88
          }
        ],
        completedCourses: [
          {
            id: 1,
            name: "Basic Business Operations",
            completedAt: "2024-01-15",
            score: 92
          },
          {
            id: 2,
            name: "Intermediate Strategy",
            completedAt: "2024-02-20",
            score: 88
          }
        ]
      },
      socialStats: {
        collaborations: 15,
        teamGamesPlayed: 8,
        leaderboardRank: 125,
        peersBeaten: 450,
        kudosReceived: 28,
        teamworkRating: 4.5
      },
      recentActivity: {
        games: [
          {
            date: "2024-03-10",
            gameName: "Strategic Operations",
            score: 88,
            duration: "45m",
            difficulty: "Hard",
            skillsImproved: ["problemSolving", "decisionMaking"]
          },
          {
            date: "2024-03-08",
            gameName: "Market Simulator",
            score: 92,
            duration: "38m",
            difficulty: "Medium",
            skillsImproved: ["criticalThinking", "adaptability"]
          }
        ],
        achievements: [
          {
            date: "2024-03-10",
            type: "achievement",
            name: "Strategy Master",
            description: "Completed 10 strategy games with 90%+ score"
          }
        ],
        levelUps: [
          {
            date: "2024-03-09",
            type: "levelUp",
            from: 14,
            to: 15,
            rewards: ["New Game Access", "Special Badge"]
          }
        ]
      },
      feedback: {
        strengths: ["Strategic Thinking", "Quick Decision Making", "Team Leadership"],
        areasForImprovement: ["Risk Management", "Resource Allocation"],
        recommendedFocus: "Advanced Risk Management Scenarios"
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
      gamesPlayed: 38,
      averageScore: 88.2,
      highestScore: 100,
      totalPlayTime: "28h 45m",
      completionRate: 94,
      skillLevels: {
        problemSolving: 94,
        criticalThinking: 88,
        decisionMaking: 85
      },
      recentGames: [
        { date: "2024-03-11", score: 95, duration: "40m" },
        { date: "2024-03-09", score: 88, duration: "35m" },
        { date: "2024-03-07", score: 92, duration: "42m" }
      ],
      progressOverTime: [
        { month: "Jan", score: 82 },
        { month: "Feb", score: 87 },
        { month: "Mar", score: 92 }
      ]
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
      gamesPlayed: 52,
      averageScore: 79.8,
      highestScore: 95,
      totalPlayTime: "38h 30m",
      completionRate: 85,
      skillLevels: {
        problemSolving: 82,
        criticalThinking: 85,
        decisionMaking: 88
      },
      recentGames: [
        { date: "2024-03-12", score: 85, duration: "48m" },
        { date: "2024-03-10", score: 82, duration: "44m" },
        { date: "2024-03-08", score: 88, duration: "40m" }
      ],
      progressOverTime: [
        { month: "Jan", score: 72 },
        { month: "Feb", score: 78 },
        { month: "Mar", score: 84 }
      ]
    }
  }
];

const Page = (props) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [institutions, setInstitutions] = useState([]);

  const [openStatsDialog, setOpenStatsDialog] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const [playerDetails, setPlayerDetails] = useState(null);

  const handleOpenStatsDialog = (player) => {
    setSelectedPlayer(player);
    setPlayerDetails(player.stats); // Use the dummy stats directly
    setOpenStatsDialog(true);
  };

  const handleCloseStatsDialog = () => {
    setOpenStatsDialog(false);
    setPlayerDetails(null);
  };

  const educationMap = {
    1: "Business",
    2: "Social Sciences",
    3: "CS & Math"
  };

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  // Use dummy data instead of API call
  useEffect(() => {
    setData(dummyPlayers);
  }, []);

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
                <Typography variant="h4" sx={{ color: "white", zIndex: 140 }}>Players</Typography>
              </Stack>
              <div>

              </div>
            </Stack>
            <Card sx={{ p: 2, backgroundColor: 'white' }}>
              <OutlinedInput
                defaultValue=""
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
                    color: 'none',
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
                    <TableHead >
                      <TableRow sx={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}>
                        <TableCell sx={{ color: "transparent", borderBottom: "none" }} align="left">Name</TableCell>
                        <TableCell sx={{ color: "transparent", borderBottom: "none" }}>Email</TableCell>
                        <TableCell sx={{ color: "transparent", borderBottom: "none" }}>Education</TableCell>
                        <TableCell sx={{ color: "transparent", borderBottom: "none" }}>Created At</TableCell>
                        <TableCell sx={{ color: "transparent", borderBottom: "none" }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Array.isArray(data) &&
                        data.map((player) => (
                          <TableRow key={player.id} sx={{ backgroundColor: "transparent", borderBottom: "none" }}>
                            <TableCell sx={{ color: "white" }}>
                              <Stack alignItems="center" direction="row" spacing={2}>
                                <Avatar src={player?.profilePhoto}>{getInitials(player.displayName)}</Avatar>
                                <Typography variant="subtitle2" sx={{ color: "white" }}>
                                  {player.displayName}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell sx={{ color: "white" }}>{player.email}</TableCell>
                            <TableCell sx={{ color: "white" }}>
                              {educationMap[player.education] || "N/A"}
                            </TableCell>

                            <TableCell sx={{ color: "white" }}>
                              {new Date(player.createdAt).toLocaleString()}
                            </TableCell>
                            <TableCell>
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
                        ))}
                    </TableBody>
                  </Table>
                </Box>
              </Scrollbar>
              <TablePagination
                component="div"
                count={data.length}
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
          playerData={playerDetails}
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
