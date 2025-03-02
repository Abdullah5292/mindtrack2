import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Divider,
  FormControl,
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
import { getInstitutions, getRoles, getUsers } from "src/utils/client";
import { getInitials } from "src/utils/get-initials";
import WithDrawer from "src/utils/with-drawer";
import WithModal from "src/utils/with-modal";

const Page = (props) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [institutions, setInstitutions] = useState([]);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const getData = async () => {
    const res = await getUsers();
    if (res) setData(res);

    const roleRes = await getRoles();
    if (roleRes) setRoles(roleRes);

    const instRes = await getInstitutions();
    if (instRes) setInstitutions(instRes);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Head>
        <title>Users | Devias Kit</title>
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
                <Typography variant="h4">Users</Typography>
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
                          title="Add User"
                          onSubmit={async (v) => {
                            try {
                              const res = await authenticatedAxios.post("/users/", v);
                              if (res.data.status) {
                                await getData();
                                props.closeDrawer();
                              }
                            } catch (e) {
                              console.error(e);
                            }
                          }}
                          institutions={institutions}
                          roles={roles}
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
                        <TableCell>Email</TableCell>
                        <TableCell>Institution</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Array.isArray(data) &&
                        data.map((user) => {
                          return (
                            <TableRow hover key={user.id}>
                              <TableCell align="left">{user.id}</TableCell>
                              <TableCell>
                                <Stack alignItems="center" direction="row" spacing={2}>
                                  <Avatar src={user?.avatar}>{getInitials(user.name)}</Avatar>
                                  <Typography variant="subtitle2">{user.name}</Typography>
                                </Stack>
                              </TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>{user.institution.name}</TableCell>
                              <TableCell>{user.role.name}</TableCell>
                              <TableCell>{moment(user.createdAt).toLocaleString()}</TableCell>
                              <TableCell>
                                <ButtonGroup variant="contained">
                                  <Button
                                    color="warning"
                                    onClick={() => {
                                      props.openDrawer({
                                        width: "30vw",
                                        body: (
                                          <DataForm
                                            title="Edit User"
                                            onSubmit={async (v) => {
                                              try {
                                                const res = await authenticatedAxios.put(
                                                  "/users/",
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
                                            initialValues={user}
                                            institutions={institutions}
                                            roles={roles}
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
                                        onSubmi: async () => {
                                          try {
                                            const res = await authenticatedAxios.delete("/users/", {
                                              data: { user_id: user.id },
                                            });
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

const DataForm = ({ formTitle, onSubmit, initialValues, institutions = [], roles = [] }) => {
  const formik = useFormik({
    initialValues: {
      id: initialValues?.id || 0,
      email: initialValues?.email || "",
      name: initialValues?.name || "",
      password: initialValues?.password || "",
      institutionId: initialValues?.institutionId || 0,
      roleId: initialValues?.roleId || 0,
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
                <CardHeader subheader="The information can be edited" title="User Data" />
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
                        <TextField
                          fullWidth
                          label="Email Address"
                          name="email"
                          onChange={formik.handleChange}
                          required
                          value={formik.values.email}
                        />
                      </Grid>
                      <Grid xs={12}>
                        <TextField
                          fullWidth
                          label="Password"
                          name="password"
                          hidden
                          onChange={formik.handleChange}
                          required
                          value={formik.values.password}
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
                        <FormControl fullWidth>
                          <InputLabel id="label-role">Role</InputLabel>
                          <Select
                            fullWidth
                            labelId="label-role"
                            label="Select Role"
                            name="roleId"
                            onChange={formik.handleChange}
                            required
                            select
                            SelectProps={{ native: true }}
                            value={formik.values.roleId}
                          >
                            {roles.map((option) => (
                              <MenuItem key={option.value} value={option.id}>
                                {option.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
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
