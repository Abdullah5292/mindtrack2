import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { CircularProgress } from "@mui/material";

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
  FormHelperText,
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
import { getInstitutions, getRoles } from "src/utils/client";
import { getUsers, createUser, updateUser, deleteUser } from "srcutils/usersClient";
import { getInitials } from "src/utils/get-initials";
import { hasPermission } from "src/utils/utils";
import WithDrawer from "src/utils/with-drawer";
import WithModal from "src/utils/with-modal";
import * as Yup from "yup";

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

  // function MyForm() {
  //   const formik = useFormik({
  //     initialValues: {
  //       name: "",
  //     },
  //     validationSchema, // Using Yup validation schema
  //     onSubmit: (values) => {
  //       console.log(values);
  //     },
  //   });

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
                {hasPermission("user-add") && (
                  <Button
                    startIcon={
                      <SvgIcon fontSize="small">
                        <PlusIcon />
                      </SvgIcon>
                    }
                    variant="contained"
                    sx={{
                      backgroundColor: "#24A374",
                      "&:hover": { backgroundColor: "#1E8A63" },
                      "&:active": { backgroundColor: "#1B7B58" },
                    }}
                    onClick={() => {
                      props.openDrawer({
                        width: "30vw",
                        body: (
                          <DataForm
                            title="Add User"
                            handleClose={props.closeDrawer}
                            onSubmit={async (v) => {
                              try {
                                const res = await createUser(v);

                                if (res.data.status) {
                                  await getData("");
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
                )}

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
                              {hasPermission("user-edit") || hasPermission("user-delete") ? (
                                <ButtonGroup variant="contained" fullWidth>
                                  {hasPermission("user-edit") && (
                                    <Button
                                      color="warning"
                                      disabled={!hasPermission("user-edit")}
                                      onClick={() => {
                                        props.openDrawer({
                                          width: "30vw",
                                          body: (
                                            <DataForm
                                              title="Edit User"
                                              handleClose={props.closeDrawer}
                                              onSubmit={async (v) => {
                                                console.log("Submitting data:", v); // Debugging

                                                try {
                                                  const res = await updateUser(user.id, v);
                                                  console.log("Response:", res.data); // Debugging

                                                  if (res.data.status) {
                                                    await getData("");
                                                    props.closeDrawer();
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
                                      fullWidth={!hasPermission("user-delete")} // If "Delete" is hidden, take full width
                                    >
                                      Edit
                                    </Button>
                                  )}

                                  {hasPermission("user-delete") && (
                                    <Button
                                      color="error"
                                      disabled={!hasPermission("user-delete")}
                                      onClick={() => {
                                        props.openModal({
                                          showSubmit: true,
                                          showCancel: true,
                                          onSubmit: async () => {
                                            const res = await deleteUser(user.id);
                                            if (res.data.status) {
                                              await getData();
                                              props.closeModal();
                                            }
                                          },
                                        });
                                      }}
                                      fullWidth={!hasPermission("user-edit")} // If "Edit" is hidden, take full width
                                    >
                                      Delete
                                    </Button>
                                  )}
                                </ButtonGroup>
                              ) : null}

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
const DataForm = ({ formTitle, onSubmit, initialValues, institutions = [], roles = [], handleClose }) => {
  const formik = useFormik({
    initialValues: {
      id: initialValues?.id || 0,
      email: initialValues?.email || "",
      name: initialValues?.name || "",
      institutionId: initialValues?.institutionId || "",
      roleId: initialValues?.roleId || "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
      name: Yup.string()
        .matches(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces")
        .max(255, "Name is too long")
        .required("Name is required"),
      institutionId: Yup.number().required("Institution is required"),
      roleId: Yup.number().required("Role is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await onSubmit(values); // await outer submit
        if (res?.status && handleClose) {
          handleClose(); // ✅ auto-close drawer after success
        }
      } catch (err) {
        console.error("Submit error:", err);
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 1,
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
                          onBlur={formik.handleBlur}
                          required
                          value={formik.values.name}
                          error={formik.touched.name && Boolean(formik.errors.name)}
                          helperText={formik.touched.name && formik.errors.name}
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
                          onBlur={formik.handleBlur}
                          required
                          value={formik.values.email}
                          error={formik.touched.email && Boolean(formik.errors.email)}
                          helperText={formik.touched.email && formik.errors.email}
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

                      </Grid>

                      <Grid item xs={12}>
                        <FormControl
                          fullWidth
                          error={formik.touched.institutionId && Boolean(formik.errors.institutionId)}
                          sx={{
                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#601631" },
                            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#601631" },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#601631" },
                          }}
                        >
                          <InputLabel id="label-institution" sx={{ color: "#601631" }}>
                            Institution
                          </InputLabel>
                          <Select
                            labelId="label-institution"
                            id="institutionId"
                            name="institutionId"
                            label="Institution"
                            value={formik.values.institutionId}  // Formik value handling
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          >
                            <MenuItem value="">
                              <em>Select Institution</em>
                            </MenuItem>
                            {institutions.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.name}
                              </MenuItem>
                            ))}
                          </Select>
                          {formik.touched.institutionId && formik.errors.institutionId && (
                            <FormHelperText>{formik.errors.institutionId}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      {/* <Grid item xs={12}>
                        <FormControl
                          fullWidth
                          error={formik.touched.institutionId && Boolean(formik.errors.institutionId)}
                          sx={{
                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#601631" },
                            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#601631" },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#601631" },
                          }}
                        >
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
                      </Grid> */}

                      <Grid item xs={12}>
                        <FormControl
                          fullWidth
                          error={formik.touched.roleId && Boolean(formik.errors.roleId)}
                          sx={{
                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#601631" },
                            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#601631" },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#601631" },
                          }}
                        >
                          <InputLabel id="label-role" sx={{ color: "#601631" }}>
                            Role
                          </InputLabel>
                          <Select
                            labelId="label-role"
                            id="roleId"
                            name="roleId"
                            label="Role"
                            value={formik.values.roleId}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}>
                            <MenuItem value="">
                              <em>Select Role</em>
                            </MenuItem>
                            {roles.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.name}
                              </MenuItem>
                            ))}
                          </Select>
                          {formik.touched.roleId && formik.errors.roleId && (
                            <FormHelperText>{formik.errors.roleId}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>

                    </Grid>
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={formik.isSubmitting}
                    sx={{
                      backgroundColor: "#601631",
                      color: "white",
                      padding: "10px 60px",
                      '&:hover': {
                        backgroundColor: '#4a1026',
                      },
                      '&:active': {
                        backgroundColor: '#380c1c',
                      },
                      boxShadow: 'none',
                      textTransform: 'none',
                      position: 'relative',
                    }}
                  >

                    {(
                      "Save details"
                    )}
                  </Button>


                </CardActions>
              </div>
            </form>
          </div>
        </Stack>
      </Container >
    </Box >
  );
};
