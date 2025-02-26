import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Stack, TextField, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import axios from 'axios';
import { useEffect, useState } from 'react';

const RegisterPage = () => {
  const router = useRouter();
  const auth = useAuth();
  const [roles, setRoles] = useState([]);
  const [institutions, setInstitutions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        const roleRes = await axios.get('http://localhost:3000/admin/roles', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const institutionRes = await axios.get('http://localhost:3000/admin/institutions', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRoles(Array.isArray(roleRes.data?.data?.roles) ? roleRes.data.data.roles : []);
        setInstitutions(Array.isArray(institutionRes.data?.data?.roles) ? institutionRes.data.data.roles : []);
      } catch (error) {
        console.error('Error fetching roles or institutions:', error);
        setRoles([]);
        setInstitutions([]);
      }
    };

    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: {
      email: '',
      name: '',
      password: '',
      roleId: '',
      institutionId: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
      name: Yup.string().max(255).required('Name is required'),
      password: Yup.string().max(255).required('Password is required'),
      roleId: Yup.string().required('Role is required'),
      institutionId: Yup.string().required('Institution is required'),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const payload = {
          ...values,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          roleId: Number(values.roleId),
          institutionId: Number(values.institutionId),
        };

        const response = await axios.post('http://localhost:3000/admin/users', payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        console.log('User registered:', response.data);
        router.push('/');
      } catch (err) {
        helpers.setErrors({ submit: err.response?.data?.message || 'Registration failed' });
        helpers.setSubmitting(false);
      }
    }
  });

  return (
    <>
      <Head>
        <title>Register | Your App</title>
      </Head>
      <Box sx={{ flex: '1 1 auto', alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ maxWidth: 550, px: 3, py: '100px', width: '100%' }}>
          <Stack spacing={1} sx={{ mb: 3 }}>
            <Typography variant="h4">Register User</Typography>
          </Stack>
          <form noValidate onSubmit={formik.handleSubmit}>
            <Stack spacing={3}>
              <TextField
                error={!!(formik.touched.name && formik.errors.name)}
                fullWidth
                helperText={formik.touched.name && formik.errors.name}
                label="Name"
                name="name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.name}
              />
              <TextField
                error={!!(formik.touched.email && formik.errors.email)}
                fullWidth
                helperText={formik.touched.email && formik.errors.email}
                label="Email Address"
                name="email"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="email"
                value={formik.values.email}
              />
              <TextField
                error={!!(formik.touched.password && formik.errors.password)}
                fullWidth
                helperText={formik.touched.password && formik.errors.password}
                label="Password"
                name="password"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="password"
                value={formik.values.password}
              />

              <FormControl fullWidth error={!!(formik.touched.roleId && formik.errors.roleId)}>
                <InputLabel>Role</InputLabel>
                <Select
                  name="roleId"
                  value={formik.values.roleId || ''}
                  onChange={(e) => formik.setFieldValue('roleId', e.target.value)}
                  onBlur={formik.handleBlur}
                >
                  {roles?.map((role) => (
                    <MenuItem key={role.id} value={String(role.id)}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth error={!!(formik.touched.institutionId && formik.errors.institutionId)}>
                <InputLabel>Institution</InputLabel>
                <Select
                  name="institutionId"
                  value={formik.values.institutionId || ''}
                  onChange={(e) => formik.setFieldValue('institutionId', e.target.value)}
                  onBlur={formik.handleBlur}
                >
                  {institutions?.map((inst) => (
                    <MenuItem key={inst.id} value={String(inst.id)}>
                      {inst.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            {formik.errors.submit && (
              <Typography color="error" sx={{ mt: 3 }} variant="body2">
                {formik.errors.submit}
              </Typography>
            )}

            <Button fullWidth size="large" sx={{ mt: 3 }} type="submit" variant="contained">
              Register User
            </Button>
          </form>
        </Box>
      </Box>
    </>
  );
};

RegisterPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default RegisterPage;
