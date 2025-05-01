import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { hasPermission } from "src/utils/utils";

import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Unstable_Grid2 as Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import moment from "moment";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import QuestionDialog from "src/components/QuestionDialog";
import { Scrollbar } from "src/components/scrollbar";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { authenticatedAxios } from "src/utils/axios";
import { getGames, getInstitutions, getInstitutionTypes, getQuestions } from "src/utils/client";
import WithDrawer from "src/utils/with-drawer";
import WithModal from "src/utils/with-modal";


const Page = (props) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [questions, setQuestions] = useState([]);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const getMiscData = async () => {
    const instRes = await getInstitutions();
    if (instRes) setInstitutions(instRes);

    const gameRes = await getGames();
    if (gameRes) setData(gameRes);

    const questionRes = await getQuestions();
    if (questionRes) setQuestions(questionRes);
  };
  const getData = async (search) => {
    const res = await getGames(search);
    if (res) setData(res);
  };



  useEffect(() => {
    getData("");
    getMiscData();
  }, []);

  return (
    <>
      <Head>
        <title>Mindtrack | Games</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4" sx={{ color: "white", zIndex: 140 }}>
                  Games
                </Typography>
              </Stack>
              <div>
                <Button
                  disabled={!hasPermission("game-add")}

                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  sx={{
                    backgroundColor: "#24A374",
                    "&:hover": { backgroundColor: "#1E8A63" }, // Slightly darker green on hover
                    "&:active": { backgroundColor: "#1B7B58" }, // Even darker green on click
                  }}
                  onClick={() => {
                    props.openDrawer({
                      width: "30vw",
                      body: (
                        <DataForm
                          title="Add Game"
                          onSubmit={async (v) => {
                            try {
                              const res = await authenticatedAxios.post("/games/", v);
                              if (res.data.status) {
                                await getData();
                                props.closeModal();
                              }
                            } catch (e) {
                              console.error(e);
                            }
                          }}
                          institutions={institutions}
                          questions={questions}
                        />
                      ),
                    });
                  }}
                >
                  Add Game
                </Button>
              </div>
            </Stack>
            <Card sx={{ p: 2, backgroundColor: "white" }}>
              <OutlinedInput
                defaultValue=""
                fullWidth
                placeholder="Search Games By Name"
                onChange={(e) => getData(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <SvgIcon color="action" fontSize="small">
                      <MagnifyingGlassIcon />
                    </SvgIcon>
                  </InputAdornment>
                }
                sx={{
                  maxWidth: 500,
                  backgroundColor: "white",
                  color: "black",
                  "& input": {
                    color: "none",
                  },
                  "&::placeholder": {
                    color: "black",
                    opacity: 1,
                  },
                  "&:hover": {
                    backgroundColor: "white",
                  },
                  "& fieldset": {
                    border: "none !important", // Completely removes border
                  },
                  "&:hover fieldset": {
                    border: "none !important",
                  },
                  "&.Mui-focused": {
                    backgroundColor: "white !important", // Keeps background white when focused
                  },
                  "&.Mui-focused fieldset": {
                    border: "none !important", // No border even when focused
                  },
                }}
              />
            </Card>
            <Card>
              <Scrollbar>
                <Box sx={{ minWidth: 800 }}>
                  <Table
                    sx={{ backgroundColor: "rgba(0, 0, 0, 0.6)", color: "white", border: "none" }}
                  >
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}>
                        <TableCell align="left">ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Institution</TableCell>
                        <TableCell>Question Pool</TableCell>
                        <TableCell>Question Count</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Tags</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>

                      {Array.isArray(data) &&
                        data.map((game, index) => {
                          return (
                            <TableRow hover key={game?.id}>
                              <TableCell sx={{ color: "white" }}>{index + 1}</TableCell>
                              <TableCell sx={{ color: "white" }}> {game?.name}</TableCell>
                              <TableCell sx={{ color: "white" }}>
                                {game.institution?.name}
                              </TableCell>
                              <TableCell sx={{ color: "white" }} l>
                                {game.GameQuestion?.length || 0}
                              </TableCell>
                              <TableCell sx={{ color: "white" }}>
                                {game.giveQuestions || 0}
                              </TableCell>
                              <TableCell sx={{ color: "white" }}>{game.time || 0}s</TableCell>
                              <TableCell sx={{ color: "white" }}>
                                <Stack direction="row" spacing={1}>
                                  {Array.isArray(game.tags) && game.tags.length > 0
                                    ? game.tags.map((a, index) => (
                                      <Chip key={index} label={a} color="primary" />
                                    )) // ✅ Added key
                                    : "-"}
                                </Stack>
                              </TableCell>
                              <TableCell sx={{ color: "white" }}>
                                {moment(game?.createdAt).toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <ButtonGroup variant="contained">
                                  <Button
                                    disabled={!hasPermission("game-edit")}
                                    color="warning"
                                    onClick={() => {
                                      props.openDrawer({
                                        width: "30vw",
                                        body: () => ( // ✅ Use a function
                                          <DataForm
                                            title="Edit Game"
                                            onSubmit={async (v) => {
                                              try {
                                                const res = await authenticatedAxios.put("/games/", v);
                                                if (res.data.status) {
                                                  await getData();
                                                  props.closeDrawer(); // ✅ Close drawer after success
                                                }
                                              } catch (e) {
                                                console.error(e);
                                              }
                                            }}
                                            initialValues={game}
                                            institutions={institutions}
                                            questions={questions}
                                            closeDrawer={props.closeDrawer} // ✅ Pass closeDrawer
                                          />
                                        ),
                                      });
                                    }}
                                  >
                                    Edit
                                  </Button>

                                  <Button
                                    disabled={!hasPermission("game-delete")}
                                    color="error"
                                    onClick={() => {
                                      props.openModal({
                                        showSubmit: true,
                                        showCancel: true,
                                        onSubmit: async () => {
                                          try {
                                            const res = await authenticatedAxios.delete("/games/", {
                                              data: { institution_id: game.id },
                                            });
                                            if (res.data.status) {
                                              await getData();
                                              props.closeModal(); // ✅ Close modal after delete
                                            }
                                          } catch (e) {
                                            console.error(e);
                                          }
                                        },
                                      });
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </ButtonGroup>

                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </Box>
              </Scrollbar>
              <TablePagination
                component="div"
                count={data.length}
                sx={{ borderTop: "none", backgroundColor: "transparent", color: "white" }}
                // onPageChange={onPageChange}
                // onRowsPerPageChange={onRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

const ModalWrapped = WithModal(Page);
const DrawerWrapped = WithDrawer(ModalWrapped);
DrawerWrapped.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default DrawerWrapped;

const DataForm = ({ formTitle, onSubmit, initialValues, institutions = [], questions = [] }) => {
  const formik = useFormik({
    initialValues: {
      id: initialValues?.id || 0,
      name: initialValues?.name || "",
      institutionId: initialValues?.institutionId || "",
      tags: initialValues?.tags || [],
      questions: initialValues?.GameQuestion?.map((q) => q.questionId) || [],
      giveQuestions: initialValues?.giveQuestions || "",
      time: initialValues?.time || 0,
    },
    onSubmit: async (values) => {
      // Convert tags from string to array if necessary
      const formattedValues = {
        ...values,
        tags: values.tags
          .split(",")   // Split the string into an array
          .map((tag) => tag.trim())  // Trim extra spaces
          .filter(Boolean),  // Remove any empty strings
      };
      await onSubmit(formattedValues)
    }

  });
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpen = () => setOpenDialog(true);
  const handleClose = () => setOpenDialog(false);
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 1,
        backgroundColor: "transparent",
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Typography variant="h4" sx={{ color: "#601631" }}>
            {formTitle}
          </Typography>

          <form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
            <Card elevation={0} sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
              <CardHeader
                subheader="The information can be edited"
                title="Game Data"
                sx={{ color: "#601631" }}
              />
              <CardContent sx={{ pt: 0 }}>
                <Box sx={{ m: -1.5 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        helperText="Please specify the name"
                        label="Name"
                        name="name"
                        onChange={formik.handleChange}
                        required
                        value={formik.values.name}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "#601631" },
                            "&:hover fieldset": { borderColor: "#601631" },
                            "&.Mui-focused fieldset": { borderColor: "#601631" },
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel id="label-institution" sx={{ color: "#601631" }}>
                          Institution
                        </InputLabel>
                        <Select
                          fullWidth
                          labelId="label-institution"
                          name="institutionId"
                          onChange={formik.handleChange}
                          required
                          value={formik.values.institutionId}
                          sx={{
                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#601631" },
                            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#601631" },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#601631",
                            },
                          }}
                        >
                          {institutions.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                              {option.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Tags (Comma separated)"
                        name="tags"
                        onChange={formik.handleChange}
                        required
                        value={formik.values.tags}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "#601631" },
                            "&:hover fieldset": { borderColor: "#601631" },
                            "&.Mui-focused fieldset": { borderColor: "#601631" },
                          },
                        }}
                      />
                    </Grid>

                    {/* View Questions Button */}
                    <Grid item xs={12}>
                      <Button
                        variant="outlined"
                        onClick={handleOpen}
                        sx={{ color: "#601631", borderColor: "#601631" }}
                      >
                        View Questions
                      </Button>
                    </Grid>
                    <QuestionDialog
                      open={openDialog}
                      handleClose={handleClose}
                      questions={questions}
                      formik={formik}
                    />

                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Time (in seconds)"
                        name="time"
                        type="text" // Ensures it's fully typeable
                        inputMode="numeric" // Helps with number input on mobile
                        onChange={formik.handleChange}
                        required
                        value={formik.values.time}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "#601631" },
                            "&:hover fieldset": { borderColor: "#601631" },
                            "&.Mui-focused fieldset": { borderColor: "#601631" },
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Give questions"
                        name="giveQuestions"
                        type="number"
                        onChange={formik.handleChange}
                        required
                        value={formik.values.giveQuestions}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "#601631" },
                            "&:hover fieldset": { borderColor: "#601631" },
                            "&.Mui-focused fieldset": { borderColor: "#601631" },
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
              <Divider sx={{ borderColor: "#601631" }} />
              <CardActions sx={{ justifyContent: "center" }}>
                <Button
                  variant="contained"
                  type="submit"
                  //center button

                  sx={{
                    backgroundColor: "#601631",
                    color: "white",
                    padding: "10px 60px",
                    '&:hover': {
                      backgroundColor: '#4a1026', // darker shade on hover
                    },
                    '&:active': {
                      backgroundColor: '#380c1c', // even darker on click
                    },
                    boxShadow: 'none', // optional: remove default MUI shadow
                    textTransform: 'none', // optional: prevent all-uppercase text
                  }}
                >
                  Save details
                </Button>

              </CardActions>
            </Card>
          </form>
        </Stack>
      </Container>

      {/* Dialog Box for Viewing Questions
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: "#601631" }}>Questions</DialogTitle>
        <DialogContent dividers>
          <FormGroup>
            {questions.map((q) => (
              <FormControlLabel
                key={q.id}
                control={
                  <Checkbox
                    checked={formik.values.questions?.includes(q.id)}
                    onChange={(e) => {
                      formik.setFieldValue(
                        "questions",
                        e.target.checked
                          ? [...formik.values.questions, q.id]
                          : formik.values.questions.filter((i) => i !== q.id)
                      );
                    }}
                    sx={{ color: "#601631" }}
                  />
                }
                label={q.content}
              />
            ))}
          </FormGroup>
        </DialogContent> */}

      <DialogActions>
        <Button onClick={handleClose} sx={{ color: "#601631" }}>
          Close
        </Button>
      </DialogActions>

    </Box >
  );
};
