import {
    Box,
    Button,
    Stack,
    TextField,
    Typography,
    InputAdornment,
} from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { unauthenticatedAxios } from "src/utils/axios";
import { Layout as AuthLayout } from "src/layouts/auth/layout";

import EmailIcon from "@mui/icons-material/Email";

const Page = () => {
    const router = useRouter();
    const [feedbackMessage, setFeedbackMessage] = useState(null);
    const [isError, setIsError] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Must be a valid email")
                .required("Email is required"),
        }),
        onSubmit: async (values, helpers) => {
            try {
                const response = await unauthenticatedAxios.post(
                    "/player/auth/forgetPassword",
                    { email: values.email }
                );
                setFeedbackMessage("Reset link sent successfully!");
                setIsError(false);
                helpers.setSubmitting(false);
            } catch (err) {
                setFeedbackMessage(
                    err.response?.data?.message || "Something went wrong. Try again."
                );
                setIsError(true);
                helpers.setSubmitting(false);
            }
        },
    });

    return (
        <>
            <Head>
                <title>Forgot Password | MindTrack</title>
            </Head>

            <Box sx={{ maxWidth: 550, px: 3, py: "100px", width: "100%" }}>
                {/* Logo */}
                <Box sx={{ display: "flex", justifyContent: "center", mb: 7 }}>
                    <img
                        src="/assets/logo.png"
                        alt="MindTrack Logo"
                        style={{ maxWidth: "150px" }}
                    />
                </Box>

                <Typography variant="h5" sx={{ mb: 3, color: "white", textAlign: "center" }}>
                    Forgot your password?
                </Typography>

                <form noValidate onSubmit={formik.handleSubmit}>
                    <Stack spacing={3}>
                        <TextField
                            error={!!(formik.touched.email && formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            FormHelperTextProps={{ style: { color: "white" } }}
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

                        {feedbackMessage && (
                            <Typography
                                sx={{ mt: 1, color: isError ? "red" : "lightgreen", textAlign: "center" }}
                            >
                                {feedbackMessage}
                            </Typography>
                        )}

                        <Button
                            fullWidth
                            size="large"
                            type="submit"
                            variant="contained"
                            disabled={formik.isSubmitting}
                            sx={{
                                bgcolor: "#24A374",
                                color: "white",
                                fontWeight: "bold",
                                fontSize: "18px",
                                "&:hover": { bgcolor: "#24A374" },
                            }}
                        >
                            Send Reset Link
                        </Button>

                        <Button
                            sx={{
                                color: "white",
                                textTransform: "none",
                                fontSize: "14px",
                                "&:hover": { color: "#ccc", background: "none" },
                            }}
                            onClick={() => router.push("/login")}
                        >
                            Back to Login
                        </Button>
                    </Stack>
                </form>
            </Box>
        </>
    );
};
Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;

