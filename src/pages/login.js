import { Box, Button, Stack, TextField, Typography, InputAdornment } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Layout as AuthLayout } from "src/layouts/auth/layout";
import { loginUser } from "src/redux/reducers/user";
import * as Yup from "yup";
import { useFormik } from "formik";
import { unauthenticatedAxios } from "src/utils/axios";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";

const Page = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
      password: Yup.string().max(255).required("Password is required"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const response = await unauthenticatedAxios.post("/auth/sign-in", {
          email: values.email,
          password: values.password,
        });
        if (response.data.status) {
          dispatch(loginUser(response.data.data));
          router.push("/");
        }
      } catch (err) {
        console.error(err);
        setErrorMessage(err.response?.data?.message || "Login failed. Please try again.");
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Head>
        <title>Login | MindTrack</title>
      </Head>

      <Box sx={{ maxWidth: 550, px: 3, py: "100px", width: "100%" }}>
        {/* Logo */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 7 }}>
          <img src="/assets/logo.png" alt="MindTrack Logo" style={{ maxWidth: "150px" }} />
        </Box>

        <form noValidate onSubmit={formik.handleSubmit}>
          <Stack spacing={3}>
            {/* Email Field */}
            <TextField
              error={!!(formik.touched.email && formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              FormHelperTextProps={{ style: { color: "white" } }} // ✅ White error text
              label="Email"
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="email"
              value={formik.values.email}
              fullWidth
              InputProps={{
                disableUnderline: true,
                style: { color: "white", borderBottom: "1px solid white" },
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: "white" }} />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{ style: { color: "white" } }}
              variant="standard"
            />

            {/* Password Field + Forgot Password (closer together) */}
            <Box>
              <TextField
                error={!!(formik.touched.password && formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                FormHelperTextProps={{ style: { color: "white" } }} // ✅ White error text
                label="Password"
                name="password"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="password"
                value={formik.values.password}
                fullWidth
                InputProps={{
                  disableUnderline: true,
                  style: { color: "white", borderBottom: "1px solid white" },
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "white" }} />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{ style: { color: "white" } }}
                variant="standard"
              />

              {/* Forgot Password Button - Now Closer */}
              <Button
                sx={{
                  mt: 0.5, // Reduced margin to bring it closer
                  color: "white",
                  textTransform: "none",
                  fontSize: "14px",
                  display: 'block', // Make the button a block element
                  mx: 'auto', // Center the button horizontally
                  "&:hover": { color: "#ccc", background: "none" },
                }}
                onClick={() => router.push("/forgot-password")}
              >
                Forgot Password?
              </Button>
            </Box>
          </Stack>

          {/* Error Message */}
          {errorMessage && (
            <Typography color="error" sx={{ mt: 2, color: "white" }} variant="body2">
              {errorMessage}
            </Typography>
          )}

          {/* Login Button */}
          <Button
            fullWidth
            size="large"
            sx={{
              mt: 1,
              bgcolor: formik.values.email && formik.values.password ? "#24A374" : "#156044",
              color: "white",
              fontWeight: "bold", // ✅ Bolder text
              fontSize: "18px", // ✅ Larger font
              "&:hover": { bgcolor: formik.values.email && formik.values.password ? "#24A374" : "#156044" }, // ✅ Remove hover effect
            }}
            type="submit"
            variant="contained"
            disabled={formik.isSubmitting}
          >
            Login
          </Button>
        </form>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
