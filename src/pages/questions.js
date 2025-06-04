import React, { useState, useEffect, useCallback } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  CircularProgress,
  Switch,
  FormControlLabel,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  InputAdornment,
  OutlinedInput,
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { authenticatedAxios } from 'src/utils/axios';
import Image from 'next/image';
import WithDrawer from 'src/utils/with-drawer';
import WithModal from 'src/utils/with-modal';
import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import { SvgIcon } from "@mui/material";

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  // Map internal values to display labels for categories
  const categories = [
    { value: "TEXTUAL", label: "Textual" },
    { value: "AUDITORY", label: "Auditory" },
    { value: "IMAGE", label: "Visual" },
  ];
  const difficulties = ["Easy", "Medium", "Hard", "Advanced", "Expert", "Exceptional"];

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await authenticatedAxios.get('/questions/');
      setQuestions(Array.isArray(response?.data?.data) ? response.data.data : []);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedQuestion(null);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCategoryChange = (event, newCategory) => {
    setSelectedCategory(newCategory || "");
  };

  const handleDifficultyChange = (event, newDifficulty) => {
    setSelectedDifficulty(newDifficulty || "");
  };

  // Filter questions based on selected category, difficulty, and search query (client-side)
  const filteredQuestions = (questions || []).filter((q) => {
    const matchesSearch = (q?.content?.toLowerCase() || '').includes(searchQuery.toLowerCase());

    // Ensure category and difficulty match (case-insensitive) - using 'category' instead of 'modality'
    const matchesCategory = !selectedCategory || (q?.modality?.toUpperCase() || '') === selectedCategory.toUpperCase();
    const matchesDifficulty =
      !selectedDifficulty || (q?.difficulty?.toUpperCase() || '') === selectedDifficulty.toUpperCase();

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

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
                <Typography variant="h4" sx={{ color: "white", zIndex: 140 }}>Questions</Typography>
              </Stack>
            </Stack>

            <Card sx={{ p: 2, backgroundColor: 'white' }}>
              <Stack spacing={2}>
                <OutlinedInput
                  value={searchQuery}
                  onChange={handleSearchChange}
                  fullWidth
                  placeholder="Search Questions"
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
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <ToggleButtonGroup
                    value={selectedCategory}
                    exclusive
                    onChange={handleCategoryChange}
                    aria-label="category filter"
                    size="small"
                    sx={{
                      '& .MuiToggleButton-root': {
                        border: 'none',
                        borderRadius: '4px !important',
                        margin: '0 4px',
                        px: 2,
                        py: 1,
                        backgroundColor: 'white',
                        '&.Mui-selected': {
                          backgroundColor: 'white',
                          color: '#5f1630',
                          fontWeight: 'bold',
                          '&:hover': {
                            backgroundColor: 'white',
                          },
                        },
                        '&:hover': {
                          backgroundColor: 'white',
                          color: '#5f1630',
                          fontWeight: 'bold',
                        },
                      },
                    }}
                  >
                    {categories.map((category) => (
                      <ToggleButton
                        key={category.value}
                        value={category.value}
                        sx={{
                          color: selectedCategory === category.value ? '#5f1630' : 'black',
                          fontWeight: selectedCategory === category.value ? 'bold' : 'normal',
                          bgcolor: 'white',
                          '&:hover': {
                            bgcolor: 'white',
                            color: '#5f1630',
                            fontWeight: 'bold',
                          },
                        }}
                      >
                        {category.label}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                  <ToggleButtonGroup
                    value={selectedDifficulty}
                    exclusive
                    onChange={handleDifficultyChange}
                    aria-label="difficulty filter"
                    size="small"
                    sx={{
                      '& .MuiToggleButton-root': {
                        border: 'none',
                        borderRadius: '4px !important',
                        margin: '0 4px',
                        px: 2,
                        py: 1,
                        backgroundColor: 'white',
                        '&.Mui-selected': {
                          backgroundColor: 'white',
                          color: '#5f1630',
                          fontWeight: 'bold',
                          '&:hover': {
                            backgroundColor: 'white',
                          },
                        },
                        '&:hover': {
                          backgroundColor: 'white',
                          color: '#5f1630',
                          fontWeight: 'bold',
                        },
                      },
                    }}
                  >
                    {difficulties.map((difficulty) => (
                      <ToggleButton
                        key={difficulty}
                        value={difficulty}
                        sx={{
                          color: selectedDifficulty === difficulty ? '#5f1630' : 'black',
                          fontWeight: selectedDifficulty === difficulty ? 'bold' : 'normal',
                          bgcolor: 'white',
                          '&:hover': {
                            bgcolor: 'white',
                            color: '#5f1630',
                            fontWeight: 'bold',
                          },
                        }}
                      >
                        {difficulty}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </Stack>
              </Stack>
            </Card>

            <Card>
              <Scrollbar>
                <Box sx={{ minWidth: 800, maxHeight: 'calc(100vh - 350px)', overflowY: 'auto' }}>
                  <Table sx={{ backgroundColor: "rgba(0, 0, 0, 0.6)", color: "white", border: "none" }}>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}>
                        <TableCell sx={{ color: "white", borderBottom: "none" }} align="left">Question</TableCell>
                        <TableCell sx={{ color: "white", borderBottom: "none" }}>Category</TableCell>
                        <TableCell sx={{ color: "white", borderBottom: "none" }}>Difficulty</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={3} align="center" sx={{ color: "white" }}>
                            <CircularProgress sx={{ color: '#F3C9D8' }} />
                          </TableCell>
                        </TableRow>
                      ) : !Array.isArray(filteredQuestions) || filteredQuestions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} align="center" sx={{ color: "white" }}>
                            No questions found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredQuestions
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((question) => (
                            <TableRow 
                              key={question?.id || Math.random()}
                              sx={{ 
                                backgroundColor: "transparent", 
                                borderBottom: "none",
                                cursor: "pointer",
                                '&:hover': {
                                  backgroundColor: 'rgba(243, 201, 216, 0.1)',
                                },
                              }}
                              onClick={() => handleQuestionClick(question)}
                            >
                              <TableCell sx={{ color: "white" }}>
                                <Typography variant="subtitle2" sx={{ maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {question?.content || 'N/A'}
                                </Typography>
                              </TableCell>
                              <TableCell sx={{ color: "white" }}>
                                <Chip
                                  label={question?.modality === 'IMAGE' ? 'Visual' : question?.modality || 'N/A'}
                                  size="small"
                                  sx={{
                                    bgcolor: 'rgba(243, 201, 216, 0.2)',
                                    color: '#F3C9D8',
                                  }}
                                />
                              </TableCell>
                              <TableCell sx={{ color: "white" }}>
                                <Chip
                                  label={question?.difficulty || 'N/A'}
                                  size="small"
                                  sx={{
                                    bgcolor: 'rgba(243, 201, 216, 0.8)',
                                    color: 'rgba(0, 0, 0, 0.8)',
                                  }}
                                />
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
                count={filteredQuestions.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={[5, 10, 25]}
                sx={{ borderTop: "none", backgroundColor: "transparent", color: "white" }}
              />
            </Card>
          </Stack>
        </Container>
      </Box>

      {/* Question Detail Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(10px)',
            color: 'white',
          },
        }}
      >
        <DialogTitle>
          Question Details
        </DialogTitle>
        <DialogContent>
          {selectedQuestion && (
            <Stack spacing={3} sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ color: 'white' }}>
                {selectedQuestion?.content || 'N/A'}
              </Typography>
              
              {/* Display media based on modality */}
              {selectedQuestion?.modality === 'Auditory' && selectedQuestion?.MediaURL && (
                <Box>
                  <audio controls src={selectedQuestion.MediaURL}>
                    Your browser does not support the audio element.
                  </audio>
                </Box>
              )}
              {selectedQuestion?.modality === 'Image' && selectedQuestion?.MediaURL && (
                <Box sx={{ maxWidth: '100%', height: 'auto' }}>
                  <img 
                    src={selectedQuestion.MediaURL} 
                    alt="Question Media" 
                    style={{ maxWidth: '100%', height: 'auto' }} 
                  />
                </Box>
              )}

              <Stack direction="row" spacing={2}>
                <Chip
                  label={selectedQuestion?.modality === 'IMAGE' ? 'Visual' : selectedQuestion?.modality || 'N/A'}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(243, 201, 216, 0.2)',
                    color: '#F3C9D8',
                  }}
                />
                <Chip
                  label={selectedQuestion.difficulty}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(243, 201, 216, 0.8)',
                    color: 'rgba(0, 0, 0, 0.8)',
                  }}
                />
              </Stack>

              <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Options:
              </Typography>
              <Stack spacing={1}>
                {selectedQuestion?.Answer?.map((option, index) => (
                  <Typography
                    key={option.id || index}
                    sx={{
                      color: option.correct ? '#4CAF50' : 'white',
                      fontWeight: option.correct ? 'bold' : 'normal',
                    }}
                  >
                    {`${index + 1}. ${option.content}`}
                  </Typography>
                )) || (
                  <Typography sx={{ color: 'white' }}>
                    No options available
                  </Typography>
                )}
              </Stack>

              <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                
              </Typography>
              <Typography sx={{ color: 'white' }}>
                {selectedQuestion.explanation}
              </Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseDialog}
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

// Wrapping with Modal and Drawer
const ModalWrapped = WithModal(Page);
const DrawerWrapped = WithDrawer(ModalWrapped);
DrawerWrapped.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default DrawerWrapped; 