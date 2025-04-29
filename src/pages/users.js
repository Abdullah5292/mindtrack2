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
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Scrollbar } from "src/components/scrollbar";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { authenticatedAxios } from "src/utils/axios";
import { getInstitutions, getRoles, getUsers } from "src/utils/client";
import { getInitials } from "src/utils/get-initials";
import { hasPermission } from "src/utils/utils";
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

  const getData = async (search) => {
    const res = await getUsers(search);
    if (res) setData(res);
  };

  const getMiscData = async () => {
    const roleRes = await getRoles();
    if (roleRes) setRoles(roleRes);

    const instRes = await getInstitutions();
    if (instRes) setInstitutions(instRes);
  };

  useEffect(() => {
    getData("");
    getMiscData();
  }, []);

  return (
    <div className="flex flex-col w-full h-full relative">
      <Head>
        <title>Mindtrack | Users</title>
      </Head>
      <Image
        src="/assets/Background.svg"
        alt="Background"
        layout="fill" // Makes it cover the full parent div
        objectFit="cover" // Ensures it scales properly
        priority // Loads the image faster
      />

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
                  Users
                </Typography>
              </Stack>
              <div>
                <Button
                  disabled={!hasPermission("user-add")}
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
                  Add User
                </Button>
              </div>
            </Stack>
            <Card sx={{ p: 2, backgroundColor: "white" }}>
              <OutlinedInput
                defaultValue=""
                fullWidth
                placeholder="Search Users By Name/Email"
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
                        <TableCell sx={{ color: "transparent", borderBottom: "none" }} align="left">
                          Name
                        </TableCell>
                        <TableCell sx={{ color: "transparent", borderBottom: "none" }}>
                          Email
                        </TableCell>
                        <TableCell sx={{ color: "transparent", borderBottom: "none" }}>
                          Institution
                        </TableCell>
                        <TableCell sx={{ color: "transparent", borderBottom: "none" }}>
                          Role
                        </TableCell>
                        <TableCell sx={{ color: "transparent", borderBottom: "none" }}>
                          Created At
                        </TableCell>
                        <TableCell sx={{ color: "transparent", borderBottom: "none" }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Array.isArray(data) &&
                        data.map((user) => (
                          <TableRow
                            key={user.id}
                            sx={{ backgroundColor: "transparent", borderBottom: "none" }}
                          >
                            <TableCell sx={{ color: "white" }}>
                              <Stack alignItems="center" direction="row" spacing={2}>
                                <Avatar src={user?.avatar}>{getInitials(user.name)}</Avatar>
                                <Typography variant="subtitle2" sx={{ color: "white" }}>
                                  {user.name}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell sx={{ color: "white" }}>{user.email}</TableCell>
                            <TableCell sx={{ color: "white" }}>{user.institution.name}</TableCell>
                            <TableCell sx={{ color: "white" }}>{user.role.name}</TableCell>
                            <TableCell sx={{ color: "white" }}>
                              {moment(user.createdAt).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <ButtonGroup variant="contained">
                                <Button
                                  disabled={!hasPermission("user-edit")}
                                  color="warning"
                                  onClick={() => {
                                    props.openDrawer({
                                      width: "30vw",
                                      body: (
                                        <DataForm
                                          title="Edit User"
                                          onSubmit={async (v) => {
                                            console.log("Submitting data:", v); // Debugging

                                            try {
                                              const res = await authenticatedAxios.put(
                                                "/users/",
                                                v
                                              );
                                              console.log("Response:", res.data); // Debugging

                                              if (res.data?.status) {
                                                console.log(
                                                  "Update successful, fetching new data..."
                                                );

                                                // Wait for data to refresh before closing drawer
                                                await getData();
                                                console.log("Fetched updated users");
                                              } else {
                                                console.error("Update failed:", res.data);
                                              }
                                            } catch (e) {
                                              console.error("Error updating user:", e);
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

                                {/* <Button
                                  color="error"
                                  onClick={() => {
                                    props.openModal({
                                      showSubmit: true,
                                      showCancel: true,
                                      onSubmit: async () => {
                                        const res = await authenticatedAxios.delete("/users/", {
                                          data: { user_id: user.id },
                                        });
                                        if (res.data.status) {
                                          await getData();
                                          props.closeModal();
                                        }
                                      },
                                    });
                                  }}
                                >
                                  Delete
                                </Button> */}

                                <Button
                                  color="error"
                                  disabled={!hasPermission("user-add")}
                                  onClick={() => {
                                    props.openModal({
                                      showSubmit: true,
                                      showCancel: true,
                                      onSubmit: async () => {
                                        const res = await authenticatedAxios.delete("/users/", {
                                          data: { user_id: user.id },
                                        });
                                        if (res.data.status) {
                                          await getMiscData();
                                          props.closeModal();
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
                        ))}
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
    </div>
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
        px: 1,
        backgroundColor: "#FAEAF0",
        boxShadow: "none",
        border: "none",
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <div>
            <Typography variant="h4" sx={{ color: "#601631" }}>
              {formTitle}
            </Typography>
          </div>
          <div>
            <form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
              <div>
                <CardHeader
                  subheader="The information can be edited"
                  title="User Data"
                  sx={{ color: "#601631" }}
                />
                <CardContent sx={{ pt: 0 }}>
                  <Box sx={{ m: -1.5 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Name"
                          name="name"
                          onChange={formik.handleChange}
                          required
                          value={formik.values.name}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": { borderColor: "#601631" },
                              "&:hover fieldset": { borderColor: "#601631" },
                              "&.Mui-focused fieldset": {
                                borderColor: "#601631",
                                borderWidth: "2px",
                              },
                            },
                            "& .MuiInputBase-input": {
                              fontWeight: "normal",
                              "&:focus": { fontWeight: "bold" },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          name="email"
                          onChange={formik.handleChange}
                          required
                          value={formik.values.email}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": { borderColor: "#601631" },
                              "&:hover fieldset": { borderColor: "#601631" },
                              "&.Mui-focused fieldset": {
                                borderColor: "#601631",
                                borderWidth: "2px",
                              },
                            },
                            "& .MuiInputBase-input": {
                              fontWeight: "normal",
                              "&:focus": { fontWeight: "bold" },
                            },
                            // Override autofill background
                            '& input:-webkit-autofill': {
                              WebkitBoxShadow: '0 0 0 1000px #FAEAF0 inset',
                              WebkitTextFillColor: 'black',
                              caretColor: 'black',
                              fontWeight: "normal",
                            },
                          }}
                        />

                      </Grid>
                      <Grid item xs={12}>
                        {/* <TextField
                          fullWidth
                          label="Password"
                          name="password"
                          type="password"
                          onChange={formik.handleChange}
                          required
                          value={formik.values.password}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": { borderColor: "#601631" },
                              "&:hover fieldset": { borderColor: "#601631" },
                              "&.Mui-focused fieldset": {
                                borderColor: "#601631",
                                borderWidth: "2px",
                              },
                            },
                            "& .MuiInputBase-input": {
                              fontWeight: "normal",
                              "&:focus": { fontWeight: "bold" },
                            },
                          }}
                        /> */}
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <InputLabel id="label-institution">Institution</InputLabel>
                          <Select
                            fullWidth
                            labelId="label-institution"
                            label="Select Institution"
                            name="institutionId"
                            onChange={formik.handleChange}
                            required
                            value={formik.values.institutionId}
                            sx={{
                              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#601631" },
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#601631",
                              },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#601631",
                                borderWidth: "2px",
                              },
                              "& .MuiSelect-select": {
                                fontWeight: "normal",
                                "&:focus": { fontWeight: "bold" },
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
                        <FormControl fullWidth>
                          <InputLabel id="label-role">Role</InputLabel>
                          <Select
                            fullWidth
                            labelId="label-role"
                            label="Select Role"
                            name="roleId"
                            onChange={formik.handleChange}
                            required
                            value={formik.values.roleId}
                            sx={{
                              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#601631" },
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#601631",
                              },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#601631",
                                borderWidth: "2px",
                              },
                              "& .MuiSelect-select": {
                                fontWeight: "normal",
                                "&:focus": { fontWeight: "bold" },
                              },
                            }}
                          >
                            {roles.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    type="submit"
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
              </div>
            </form>
          </div>
        </Stack>
      </Container>
    </Box>
  );
};
