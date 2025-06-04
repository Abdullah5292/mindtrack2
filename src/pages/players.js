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

const Page = (props) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [openStatsDialog, setOpenStatsDialog] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playerDetails, setPlayerDetails] = useState(null);

  const handleOpenStatsDialog = (player) => {
    setSelectedPlayer(player);
    setPlayerDetails(player);
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getPlayers(searchQuery);
        setData(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        // No fallback to dummy data
        setData([]); // Set data to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchQuery]);

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
                    <TableHead >
                      <TableRow sx={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}>
                        <TableCell sx={{ color: "white", borderBottom: "none" }} align="left">Name</TableCell>
                        <TableCell sx={{ color: "white", borderBottom: "none" }}>Email</TableCell>
                        <TableCell sx={{ color: "white", borderBottom: "none" }}>Education</TableCell>
                        <TableCell sx={{ color: "white", borderBottom: "none" }}>Created At</TableCell>
                        <TableCell sx={{ color: "white", borderBottom: "none" }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ color: "white" }}>
                            Loading...
                          </TableCell>
                        </TableRow>
                      ) : !Array.isArray(data) || data.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ color: "white" }}>
                            No players found
                          </TableCell>
                        </TableRow>
                      ) : (
                        data.map((player) => (
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
                count={data?.length || 0}
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
