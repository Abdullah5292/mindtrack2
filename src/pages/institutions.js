import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Buffer } from "buffer";
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; // Material UI Close ico
import { CircularProgress } from "@mui/material";
import { hasPermission } from "src/utils/utils";

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
  FormHelperText,
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
import * as Yup from "yup";

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

  const [modalImage, setModalImage] = useState(null);  // For the image URL
  const [openModal, setOpenModal] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState("");

  // Function to close modal
  // Close modal function
  const closeModal = () => {
    setOpenModal(false);
    setModalImage(null); // Optionally reset the image when closing
  };

  // const handleOpenModal = async (fileName) => {
  //   try {
  //     const file = await getFile(fileName);
  //     console.log('File received:', file); // Log the entire file object to inspect its structure

  //     if (!file || !file.Body) throw new Error("Invalid file object");

  //     // Convert Body to buffer correctly
  //     const buffer =
  //       file.Body instanceof Uint8Array ? Buffer.from(file.Body) : await streamToBuffer(file.Body);

  //     const base64 = buffer.toString("base64");
  //     const mimeType = file.ContentType || "image/jpeg";
  //     const imageSrc = `data:${mimeType};base64,${base64}`;

  //     setImageSrc(imageSrc);
  //     setOpenModal(true);
  //   } catch (e) {
  //     console.error("Error fetching image:", e);
  //   }
  // };

  const handleOpenModal = async (fileName) => {
    try {
      const result = await getFile(fileName); // Fetch file from S3 (make sure getFile is working)
      if (result.success) {
        const file = result.file;

        // Check if the file Body exists and is a valid Uint8Array
        if (file.Body && file.ContentType) {
          // Convert Uint8Array to Blob
          const blob = new Blob([file.Body], { type: file.ContentType });

          // Debug: Check the Blob type and file details
          console.log('Fetched file blob:', blob);

          // Generate an object URL for the blob
          const imageUrl = URL.createObjectURL(blob);

          // Debug: Log the image URL to ensure it's correct
          console.log('Generated image URL:', imageUrl);

          // Set the image URL in state and open the modal
          setModalImage(imageUrl);
          setOpenModal(true);
        } else {
          console.error('File body or content type is missing');
        }
      } else {
        console.error('Failed to fetch file');
      }
    } catch (error) {
      console.error('Error opening modal:', error);
    }
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
                  disabled={!hasPermission("institution-add")}
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
                          handleClose={props.closeDrawer}

                          onSubmit={async (v) => {
                            try {
                              const result = await uploadFile(v.logo);

                              if (result.success) {
                                const res = await authenticatedAxios.post("/institutions/", {
                                  ...v,
                                  logo: result.fileName, // ✅ use only the string
                                });
                                if (res.data.status) {
                                  await getMiscData();
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
                              <TableCell>
                                <Button
                                  disabled={institution.logo === ""}
                                  onClick={() => handleOpenModal(institution.logo)} // Pass the logo file name
                                  variant="outlined"
                                  sx={{ color: "white", borderColor: "white" }}
                                >
                                  View
                                </Button>

                                {/* Modal component */}
                                <Modal
                                  open={openModal}
                                  onClose={closeModal}
                                  aria-labelledby="modal-title"
                                  aria-describedby="modal-description"
                                >
                                  {/* Background overlay with low opacity */}

                                  {/* Modal content */}
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      position: 'fixed', // Fixed position to make it centered on the page
                                      top: '50%',
                                      left: '50%',
                                      transform: 'translate(-50%, -50%)',
                                      backgroundColor: 'white',
                                      padding: '20px',
                                      borderRadius: '8px',
                                      // boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                      maxWidth: '30%',  // Modal width
                                      maxHeight: '80%', // Modal height
                                      overflowY: 'auto',
                                      position: 'relative', // Allow the close button to be positioned absolutely
                                      // Ensures the modal is above the overlay
                                    }}
                                  >
                                    {/* Close button */}
                                    <IconButton
                                      onClick={closeModal}
                                      style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        color: '#000', // Black color for the close icon
                                      }}
                                    >
                                      <CloseIcon />
                                    </IconButton>

                                    {/* Image content */}
                                    <div style={{
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      textAlign: 'center',
                                    }}>
                                      {modalImage ? (
                                        <img
                                          src={modalImage}
                                          alt="Image from S3"
                                          style={{
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                            objectFit: 'contain', // Ensure the image fits within the container
                                          }}
                                        />
                                      ) : (
                                        <p>Loading image...</p>
                                      )}
                                    </div>
                                  </div>

                                </Modal>

                              </TableCell>
                              <TableCell sx={{ color: "white" }}>{institution.type.type}</TableCell>
                              <TableCell sx={{ color: "white" }}>
                                {moment(institution.createdAt).toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <ButtonGroup variant="contained">
                                  <Button
                                    disabled={!hasPermission("institution-edit")}
                                    color="warning"
                                    onClick={() => {
                                      props.openDrawer({
                                        width: "30vw",
                                        body: (
                                          <DataForm
                                            title="Edit Institution"
                                            handleClose={props.closeDrawer}



                                            onSubmit={async (v) => {
                                              try {
                                                const result = await uploadFile(v.logo);

                                                if (result.success) {
                                                  const payload = {
                                                    ...v,
                                                    logo: result.fileName, // correctly attach logo
                                                  };

                                                  const res = await authenticatedAxios.put("/institutions/", payload);

                                                  if (res.data.status) {
                                                    await getMiscData();
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
                                    disabled={!hasPermission("institution-delete")}

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

      </Box >
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
      typeId: initialValues?.typeId || "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .matches(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces") // Regex to allow only letters and spaces
        .max(255, "Name is too long")
        .required("Name is required"),
      email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
      logo: Yup.mixed()
        // .required('Logo is required')
        .test("fileSize", "File too large", (value) => !value || value.size <= 2 * 1024 * 1024)
        .test(
          "fileType",
          "Unsupported file format",
          (value) => !value || ["image/jpeg", "image/png"].includes(value.type)
        ),
      typeId: Yup.number().required("Institution Type is required"),
    }),
    onSubmit,
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
                  title="Institution Data"
                  sx={{ color: "#601631" }}
                />
                <CardContent sx={{ pt: 0 }}>
                  <Box sx={{ m: -1.5 }}>
                    <Grid container spacing={2}>
                      {/* Name Field */}
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
                            "& label.Mui-focused": { color: "#601631" },
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": { borderColor: "#601631" },
                              "&:hover fieldset": { borderColor: "#601631" },
                              "&.Mui-focused fieldset": { borderColor: "#601631" },
                            },
                          }}
                        />
                      </Grid>

                      {/* Email Field */}
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
                            "& label.Mui-focused": { color: "#601631" },
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": { borderColor: "#601631" },
                              "&:hover fieldset": { borderColor: "#601631" },
                              "&.Mui-focused fieldset": { borderColor: "#601631" },
                            },
                          }}
                        />
                      </Grid>

                      {/* Logo Upload */}
                      <Grid item xs={12}>
                        <Typography
                          variant="subtitle1"
                          sx={{ color: "#601631", fontWeight: "bold" }}
                        >
                          Logo
                        </Typography>
                        <input
                          type="file"
                          name="logo"
                          onChange={(event) =>
                            formik.setFieldValue("logo", event.currentTarget.files[0])
                          }
                        // onBlur={() => formik.setFieldTouched("logo", true)}
                        />

                        {/* {formik.touched.logo && formik.errors.logo && (
                          <FormHelperText error>{formik.errors.logo}</FormHelperText>
                        )} */}

                        {/* <FormControl fullWidth sx={{ mt: 1, mb: 2 }}>
                          <input type="file" onChange={handleFileChange} />
                        </FormControl> */}
                      </Grid>

                      {/* Institution Type Dropdown */}
                      <Grid item xs={12}>
                        <FormControl
                          fullWidth
                          error={Boolean(formik.touched.typeId && formik.errors.typeId)}
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
                            id="typeId"
                            name="typeId"
                            label="Institution Type"
                            value={formik.values.typeId}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur} // CRITICAL LINE
                          >
                            <MenuItem value="">
                              <em>Select one</em>
                            </MenuItem>
                            {institutionTypes.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.type}
                              </MenuItem>
                            ))}
                          </Select>
                          {formik.touched.typeId && formik.errors.typeId && (
                            <FormHelperText>{formik.errors.typeId}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>

                {/* Submit Button */}
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
      </Container>
    </Box>
  );
};
