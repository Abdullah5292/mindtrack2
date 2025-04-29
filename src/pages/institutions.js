import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Buffer } from "buffer";
import {
  Box,
  Modal,
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
import { getFile } from "../utils/aws";
import { fileName } from "src/utils/aws";
import { imageSrc } from "src/utils/aws";
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

  const getMiscData = async () => {
    const typeRes = await getInstitutionTypes();
    if (typeRes) setInstitutionTypes(typeRes);

    const instRes = await getInstitutions();
    if (instRes) setData(instRes);
  };
  const getData = async (search) => {
    const res = await getInstitutions(search);
    if (res) setData(res);
  };


  const [openModal, setOpenModal] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState("");

  // Function to close modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const ImageModalComponent = ({ fileName }) => {
    const [imageSrc, setImageSrc] = useState("");
    const [openModal, setOpenModal] = useState(false);
  };

  const handleOpenModal = async (fileName) => {
    try {
      const file = await getFile(fileName);

      if (!file || !file.Body) throw new Error("Invalid file object");

      // Convert Body to buffer correctly
      const buffer =
        file.Body instanceof Uint8Array ? Buffer.from(file.Body) : await streamToBuffer(file.Body); // Fallback if it's a stream

      const base64 = buffer.toString("base64");
      const mimeType = file.ContentType || "image/jpeg";
      const imageSrc = `data:${mimeType};base64,${base64}`;

      setImageSrc(imageSrc);
      setOpenModal(true);
    } catch (e) {
      console.error("Error fetching image:", e);
    }
  };

  // Only if file.Body is a stream (Node.js Readable stream)
  const streamToBuffer = async (stream) => {
    return new Promise((resolve, reject) => {
      const chunks = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(chunks)));
      stream.on("error", reject);
    });
  };


  useEffect(() => {
    getData("");
    getMiscData();
  }, []);

  return (
    <>
      <Head>
        <title>Mindtrack | Institutions </title>
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
                  Institutions
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
                          title="Add Institution"
                          onSubmit={async (v) => {
                            try {
                              if (uploadFile(v.logoFile)) {
                                const res = await authenticatedAxios.post("/institutions/", v);
                                if (res.data.status) {
                                  await getMiscData();
                                  props.closeModal();
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
                  Add Institution
                </Button>
              </div>
            </Stack>
            <Card sx={{ p: 2, backgroundColor: "white" }}>
              <OutlinedInput
                defaultValue=""
                fullWidth
                placeholder="Search Institutions By Name/Email"
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
                        <TableCell>Email</TableCell>
                        <TableCell>Logo</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Array.isArray(data) &&
                        data.map((institution, index) => {
                          return (
                            <TableRow hover key={institution.id}>
                              <TableCell sx={{ color: "white" }}>{index + 1}</TableCell>
                              <TableCell sx={{ color: "white" }}>{institution.name}</TableCell>
                              <TableCell sx={{ color: "white" }}>{institution.email}</TableCell>
                              {/* <TableCell sx={{ color: "white" }}> {console.log("Logo data:", institution.logo)}
                              </TableCell> */}
                              {/* View button for logo */}
                              <TableCell>
                                {/* <Button
                                  onClick={() => handleOpenModal(institution.getFile)}
                                  variant="outlined"
                                  sx={{ color: "white", borderColor: "white" }} // Makes text & border white
                                >
                                  View
                                </Button> */}

                                <Button
                                  disabled={institution.logo === ""}
                                  onClick={() => handleOpenModal(institution.logo)}
                                  variant="outlined"
                                  sx={{ color: "white", borderColor: "white" }}
                                >
                                  View
                                </Button>

                                <Modal
                                  open={openModal}
                                  onClose={handleCloseModal}
                                  aria-labelledby="image-modal-title"
                                  aria-describedby="image-modal-description"
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      height: "100%",
                                    }}
                                  >
                                    {imageSrc ? (
                                      <img
                                        src={imageSrc}
                                        alt="S3 Image"
                                        style={{ maxWidth: "90%", maxHeight: "90%" }}
                                      />
                                    ) : (
                                      <p>Loading image...</p>
                                    )}
                                  </Box>
                                </Modal>
                              </TableCell>
                              <TableCell sx={{ color: "white" }}>{institution.type.type}</TableCell>
                              <TableCell sx={{ color: "white" }}>
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
                                                    await getMiscData();
                                                    props.closeModal();
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
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "auto",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <img
              src={selectedLogo}
              alt="Institution Logo"
              style={{ maxWidth: "100%", maxHeight: "80vh" }}
            />
          </Box>
        </Modal>
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
      typeId: initialValues?.typeId || 0,
    },
    onSubmit,
  });

  const handleFileChange = (e) => {
    const og = e.target.files[0];
    if (og) {
      const newName = crypto.randomUUID();
      const newFile = new File([og], newName, { type: og.type, lastModified: og.lastModified });
      formik.setFieldValue("logo", newName);
      formik.setFieldValue("logoFile", newFile);
    }
  };
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
                  title="Institution Data"
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
                            "& label.Mui-focused": { color: "#601631" },
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": { borderColor: "#601631" },
                              "&:hover fieldset": { borderColor: "#601631" },
                              "&.Mui-focused fieldset": { borderColor: "#601631" },
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
                            "& label.Mui-focused": { color: "#601631" },
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": { borderColor: "#601631" },
                              "&:hover fieldset": { borderColor: "#601631" },
                              "&.Mui-focused fieldset": { borderColor: "#601631" },
                            },
                          }}
                        />
                      </Grid>
                      {/* Logo Section */}
                      <Grid item xs={12}>
                        <Typography
                          variant="subtitle1"
                          sx={{ color: "#601631", fontWeight: "bold" }}
                        >
                          Logo
                        </Typography>
                        <FormControl fullWidth sx={{ mt: 1, mb: 2 }}>
                          <input type="file" onChange={handleFileChange} />
                        </FormControl>
                      </Grid>
                      {/* Institution Type */}
                      <Grid item xs={12}>
                        <FormControl
                          fullWidth
                          sx={{
                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#601631" },
                            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#601631" },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#601631",
                            },
                          }}
                        >
                          <InputLabel id="label-type" sx={{ color: "#601631" }}>
                            Institution Type
                          </InputLabel>
                          <Select
                            fullWidth
                            labelId="label-type"
                            label="Select Type"
                            name="typeId"
                            onChange={formik.handleChange}
                            required
                            value={formik.values.typeId}
                          >
                            {institutionTypes.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.type}
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
