import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
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

  const getData = async () => {
    const instRes = await getInstitutions();
    if (instRes) setInstitutions(instRes);

    const gameRes = await getGames();
    if (gameRes) setData(gameRes);

    const questionRes = await getQuestions();
    if (questionRes) setQuestions(questionRes);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Head>
        <title>Games | Devias Kit</title>
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
                <Typography variant="h4">Games</Typography>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
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
                                props.closeDrawer();
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
                  Add
                </Button>
              </div>
            </Stack>
            <Card sx={{ p: 2 }}>
              <OutlinedInput
                defaultValue=""
                fullWidth
                placeholder="Search"
                startAdornment={
                  <InputAdornment position="start">
                    <SvgIcon color="action" fontSize="small">
                      <MagnifyingGlassIcon />
                    </SvgIcon>
                  </InputAdornment>
                }
                sx={{ maxWidth: 500 }}
              />
            </Card>
            <Card>
              <Scrollbar>
                <Box sx={{ minWidth: 800 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Institution</TableCell>
                        <TableCell>Question Pool</TableCell>
                        <TableCell>Question Count</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Tags</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Array.isArray(data) &&
                        data.map((game) => {
                          return (
                            <TableRow hover key={game?.id}>
                              <TableCell align="left">{game?.id}</TableCell>
                              <TableCell>{game?.name}</TableCell>
                              <TableCell>{game.institution?.name}</TableCell>
                              <TableCell>{game.GameQuestion?.length || 0}</TableCell>
                              <TableCell>{game.giveQuestions || 0}</TableCell>
                              <TableCell>{game.time || 0}s</TableCell>
                              <TableCell>
                                <Stack direction="row" spacing={1}>
                                  {Array.isArray(game.tags) && game.tags > 0
                                    ? game.tags.map((a) => <Chip label={a} color="primary" />)
                                    : "-"}
                                </Stack>
                              </TableCell>
                              <TableCell>{moment(game?.createdAt).toLocaleString()}</TableCell>
                              <TableCell>
                                <ButtonGroup variant="contained">
                                  <Button
                                    color="warning"
                                    onClick={() => {
                                      props.openDrawer({
                                        width: "30vw",
                                        body: (
                                          <DataForm
                                            title="Edit Institution"
                                            onSubmit={async (v) => {
                                              try {
                                                const res = await authenticatedAxios.put(
                                                  "/institutions/",
                                                  v
                                                );
                                                if (res.data.status) {
                                                  await getData();
                                                  props.closeDrawer();
                                                }
                                              } catch (e) {
                                                console.error(e);
                                              }
                                            }}
                                            initialValues={game}
                                            institutions={institutions}
                                            questions={questions}
                                          />
                                        ),
                                      });
                                    }}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    color="error"
                                    onClick={() => {
                                      props.openModal({
                                        showSubmit: true,
                                        showCancel: true,
                                        onSubmit: async () => {
                                          try {
                                            const res = await authenticatedAxios.delete(
                                              "/institutions/",
                                              {
                                                data: { institution_id: game.id },
                                              }
                                            );
                                            if (res.data.status) {
                                              await getData();
                                              props.closeModal();
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
      institutionId: initialValues?.institutionId || 0,
      tags: initialValues?.tags || [],
      GameQuestion: initialValues?.GameQuestion.map((q) => q.questionId) || [],
      giveQuestions: initialValues?.giveQuestions || 0,
      time: initialValues?.time || 0,
    },
    onSubmit,
  });

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <div>
            <Typography variant="h4">{formTitle}</Typography>
          </div>
          <div>
            <form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
              <Card>
                <CardHeader subheader="The information can be edited" title="Institution Data" />
                <CardContent sx={{ pt: 0 }}>
                  <Box sx={{ m: -1.5 }}>
                    <Grid container spacing={3}>
                      <Grid xs={12}>
                        <TextField
                          fullWidth
                          helperText="Please specify the name"
                          label="Name"
                          name="name"
                          onChange={formik.handleChange}
                          required
                          value={formik.values.name}
                        />
                      </Grid>
                      <Grid xs={12}>
                        <FormControl fullWidth>
                          <InputLabel id="label-institution">Institution</InputLabel>
                          <Select
                            fullWidth
                            labelId="label-institution"
                            label="Select Institution"
                            name="institutionId"
                            onChange={formik.handleChange}
                            required
                            select
                            SelectProps={{ native: true }}
                            value={formik.values.institutionId}
                          >
                            {institutions.map((option) => (
                              <MenuItem key={option.value} value={option.id}>
                                {option.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid xs={12}>
                        <TextField
                          fullWidth
                          label="Tags (Comma seperated)"
                          name="tags"
                          onChange={formik.handleChange}
                          required
                          value={formik.values.tags}
                        />
                      </Grid>
                      <Grid xs={12}>
                        <Card>
                          <InputLabel mt={2}>Questions</InputLabel>
                          <Stack maxHeight="50vh" overflow="auto">
                            <FormGroup>
                              {questions.map((q) => (
                                <FormControlLabel
                                  control={<Checkbox defaultChecked />}
                                  label={q.content}
                                  checked={formik.values.GameQuestion?.includes(q.id)}
                                  onChange={(e) => {
                                    formik.setFieldValue(
                                      "GameQuestion",
                                      e.target.checked
                                        ? [...formik.values.GameQuestion, q.id]
                                        : formik.values.GameQuestion.filter((i) => i !== q.id)
                                    );
                                  }}
                                />
                              ))}
                            </FormGroup>
                          </Stack>
                        </Card>
                      </Grid>
                      <Grid xs={6}>
                        <TextField
                          fullWidth
                          label="Time (in seconds)"
                          name="time"
                          type="number"
                          onChange={formik.handleChange}
                          required
                          value={formik.values.time}
                        />
                      </Grid>
                      <Grid xs={6}>
                        <TextField
                          fullWidth
                          label="Give questions"
                          name="giveQuestions"
                          type="number"
                          onChange={formik.handleChange}
                          required
                          value={formik.values.giveQuestions}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: "flex-end" }}>
                  <Button variant="contained" type="submit">
                    Save details
                  </Button>
                </CardActions>
              </Card>
            </form>
          </div>
        </Stack>
      </Container>
    </Box>
  );
};
