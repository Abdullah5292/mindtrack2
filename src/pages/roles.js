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
  FormControlLabel,
  FormGroup,
  Unstable_Grid2 as Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
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
import { getPermissions, getRoles } from "src/utils/client";
import WithDrawer from "src/utils/with-drawer";
import WithModal from "src/utils/with-modal";

const Page = (props) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [permissions, setPermissions] = useState([]);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const getData = async (search) => {
    const res = await getRoles(search);
    if (res) setData(res);
  };

  const getMiscData = async () => {
    const roleRes = await getRoles();
    if (roleRes) setData(roleRes);

    const permRes = await getPermissions();
    if (permRes) setPermissions(permRes);
  };

  useEffect(() => {
    getData("");
    getMiscData();
  }, []);

  return (
    <>
      <Head>
        <title>Mindtrack | Roles</title>
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
                  Roles
                </Typography>
              </Stack>
              <div>
                <Button
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
                          title="Add Role"
                          onSubmit={async (v) => {
                            try {
                              const res = await authenticatedAxios.post("/roles/", v);
                              if (res.data.status) {
                                await getData();
                                props.closeDrawer();
                              }
                            } catch (e) {
                              console.error(e);
                            }
                          }}
                          permissions={permissions}
                        />
                      ),
                    });
                  }}
                >
                  Add Role
                </Button>
              </div>
            </Stack>
            <Card sx={{ p: 2, backgroundColor: "white" }}>
              <OutlinedInput
                defaultValue=""
                fullWidth
                placeholder="Search Roles By Name"
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
                        <TableCell>Permission Count</TableCell>
                        <TableCell>Assigned To</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Array.isArray(data) &&
                        data.map((role, index) => {
                          return (
                            <TableRow hover key={role.id}>
                              <TableCell sx={{ color: "white" }}>{index + 1}</TableCell>
                              <TableCell sx={{ color: "white" }}>{role.name}</TableCell>
                              <TableCell sx={{ color: "white" }}>
                                {role.RolePermissions?.length || 0}
                              </TableCell>
                              <TableCell sx={{ color: "white" }}>
                                <Stack direction="row" spacing={1}>
                                  {Array.isArray(role.Admins) && role.Admins.length > 0
                                    ? role.Admins.map((admin) => (
                                      <Chip key={admin.id} label={admin.name} color="primary" /> // ✅ Best practice: Unique `id`
                                    ))
                                    : "-"}
                                </Stack>
                              </TableCell>

                              <TableCell sx={{ color: "white" }}>
                                {moment(role.createdAt).toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <ButtonGroup variant="contained">
                                  <Button
                                    color="warning"
                                    onClick={() => {
                                      props.openDrawer({
                                        width: "30vw",
                                        body: (
                                          <DataForm
                                            title="Edit Role"
                                            onSubmit={async (v) => {
                                              try {
                                                const res = await authenticatedAxios.put(
                                                  "/roles/",
                                                  { ...v, roleId: v.id }
                                                );
                                                if (res.data.status) {
                                                  await getMiscData();
                                                  props.closeModal();
                                                }
                                              } catch (e) {
                                                console.error(e);
                                              }
                                            }}
                                            initialValues={role}
                                            permissions={permissions}
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
                                            const res = await authenticatedAxios.delete("/roles/", {
                                              data: { roleId: role.id },
                                            });
                                            if (res.data.status) {
                                              await getMiscData();
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

const DataForm = ({ formTitle, onSubmit, initialValues, permissions = [] }) => {
  const formik = useFormik({
    initialValues: {
      id: initialValues?.id || 0,
      name: initialValues?.name || "",
      permissions: initialValues?.RolePermissions.map((p) => p.permissionId) || [],
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
                  title="Role Data"
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
                        />
                      </Grid>
                    </Grid>
                  </Box>
                  <Card sx={{ mt: 3, p: 2 }}>
                    <InputLabel sx={{ color: "#601631", fontWeight: "bold" }}>
                      Permissions
                    </InputLabel>
                    <Stack maxHeight="50vh" overflow="auto" sx={{ mt: 1 }}>
                      <FormGroup>
                        {permissions.map((p) => (
                          <FormControlLabel
                            key={p.id}
                            control={<Checkbox />}
                            label={p.name}
                            checked={formik.values.permissions?.includes(p.id)}
                            onChange={(e) => {
                              formik.setFieldValue(
                                "permissions",
                                e.target.checked
                                  ? [...formik.values.permissions, p.id]
                                  : formik.values.permissions.filter((i) => i !== p.id)
                              );
                            }}
                          />
                        ))}
                      </FormGroup>
                    </Stack>
                  </Card>
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
