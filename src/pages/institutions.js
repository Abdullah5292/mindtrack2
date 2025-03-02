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
import { uploadFile } from "src/utils/aws";
import { authenticatedAxios } from "src/utils/axios";
import { getInstitutions, getInstitutionTypes } from "src/utils/client";
import WithDrawer from "src/utils/with-drawer";
import WithModal from "src/utils/with-modal";

const Page = (props) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [institutionTypes, setInstitutionTypes] = useState([]);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const getData = async () => {
    const typeRes = await getInstitutionTypes();
    if (typeRes) setInstitutionTypes(typeRes);

    const instRes = await getInstitutions();
    if (instRes) setData(instRes);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Head>
        <title>Institutions | Devias Kit</title>
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
                <Typography variant="h4">Institutions</Typography>
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
                          title="Add Institution"
                          onSubmit={async (v) => {
                            try {
                              if (uploadFile(v.logoFile)) {
                                const res = await authenticatedAxios.post("/institutions/", v);
                                if (res.data.status) {
                                  await getData();
                                  props.closeDrawer();
                                }
                              }
                            } catch (e) {
                              console.error(e);
                            }
                          }}
                          institutionTypes={institutionTypes}
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
                        <TableCell>Logo</TableCell>
                        <TableCell>Type</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Array.isArray(data) &&
                        data.map((institution) => {
                          return (
                            <TableRow hover key={institution.id}>
                              <TableCell align="left">{institution.id}</TableCell>
                              <TableCell>{institution.name}</TableCell>
                              <TableCell>{institution.email}</TableCell>
                              <TableCell>{institution.logo || "NA"}</TableCell>
                              <TableCell>{institution.type.type}</TableCell>
                              <TableCell>
                                {moment(institution.createdAt).toLocaleString()}
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
                                            title="Edit Institution"
                                            onSubmit={async (v) => {
                                              try {
                                                if (v.logoFile !== null && uploadFile(v.logoFile)) {
                                                  const res = await authenticatedAxios.put(
                                                    "/institutions/",
                                                    v
                                                  );
                                                  if (res.data.status) {
                                                    await getData();
                                                    props.closeDrawer();
                                                  }
                                                }
                                              } catch (e) {
                                                console.error(e);
                                              }
                                            }}
                                            initialValues={institution}
                                            institutionTypes={institutionTypes}
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
                                                data: { institution_id: institution.id },
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

const DataForm = ({ formTitle, onSubmit, initialValues, institutionTypes = [] }) => {
  const formik = useFormik({
    initialValues: {
      id: initialValues?.id || 0,
      name: initialValues?.name || "",
      email: initialValues?.email || "",
      logo: initialValues?.logo || "",
      logoFile: null,
      typeId: initialValues?.typeId || "",
    },
    onSubmit,
  });

  const handleFileChange = (e) => {
    const og = e.target.files[0];
    const newName = crypto.randomUUID();
    const newFile = new File([og], newName, {
      type: og.type,
      lastModified: og.lastModified,
    });
    formik.setFieldValue("logo", newName);
    formik.setFieldValue("logoFile", newFile);
  };

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
                        <TextField
                          fullWidth
                          helperText="Please specify the email"
                          label="Email"
                          name="email"
                          onChange={formik.handleChange}
                          required
                          value={formik.values.email}
                        />
                      </Grid>
                      <Grid xs={12}>
                        <FormControl fullWidth>
                          <InputLabel id="label-logo">Logo</InputLabel>
                          <input type="file" onChange={handleFileChange} />
                        </FormControl>
                      </Grid>
                      <Grid xs={12}>
                        <FormControl fullWidth>
                          <InputLabel id="label-type">Type</InputLabel>
                          <Select
                            fullWidth
                            labelId="label-type"
                            label="Select Type"
                            name="typeId"
                            onChange={formik.handleChange}
                            required
                            select
                            SelectProps={{ native: true }}
                            value={formik.values.typeId}
                          >
                            {institutionTypes.map((option) => (
                              <MenuItem key={option.value} value={option.id}>
                                {option.type}
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
