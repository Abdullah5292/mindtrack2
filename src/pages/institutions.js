import Head from 'next/head';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";

import {
  Box,
  Button,
  Container,
  Pagination,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid,
  InputAdornment,
  Card,

  CardActions,
  CardContent,
  CardHeader,
  OutlinedInput
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CompanyCard } from 'src/sections/companies/company-card';
import { CompaniesSearch } from 'src/sections/companies/companies-search';
import { authenticatedAxios } from "src/utils/axios";
import { getInstitutions, getRoles, getUsers } from "src/utils/client";
import { getInitials } from "src/utils/get-initials";
import WithDrawer from "src/utils/with-drawer";
import WithModal from "src/utils/with-modal";
import Image from "next/image";


const companies = [

  {
    id: '2569ce0d517a7f06d3ea1f24',
    createdAt: '27/03/2019',
    description: '',
    logo: '/assets/logos/logo-dropbox.png',
    title: 'Dropbox',
  },
  {
    id: 'ed2b900870ceba72d203ec15',
    createdAt: '31/03/2019',
    logo: '/assets/logos/logo-medium.png',
    title: 'Medium Corporation',
  },
  {
    id: 'a033e38768c82fca90df3db7',
    createdAt: '03/04/2019',
    logo: '/assets/logos/logo-slack.png',
    title: 'Slack',
  },
  {
    id: 'a033e38768c82fca90df3db7',
    createdAt: '03/04/2019',
    logo: '/assets/logos/logo-slack.png',
    title: 'Slack',
  },


];

const Page = () => (

  <div className="h-full">


    <Image
      src="/assets/Background.svg"
      alt="Background"
      objectFit="cover"
      layout="fill" // Ensures it fills the entire div
      style={{
        zIndex: -1, // Push to the back
        position: "absolute", // Fixes it to the background
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
      priority
    />


    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Stack
            direction="row"
            justifyContent="space-between"
            spacing={4}
          >
            <Stack spacing={1}>
              <Typography variant="h4" sx={{ color: "white", zIndex: 140 }}>
                Institutions
              </Typography>
              <Stack
                alignItems="center"
                direction="row"
                spacing={1}
              >
                {/* <Button
                  color="inherit"
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <ArrowUpOnSquareIcon />
                    </SvgIcon>
                  )}
                >
                  Import
                </Button>
                <Button
                  color="inherit"
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <ArrowDownOnSquareIcon />
                    </SvgIcon>
                  )}
                >
                  Export
                </Button> */}
              </Stack>
            </Stack>
            <div>
              <Button
                startIcon={
                  <SvgIcon fontSize="small">
                    <PlusIcon />
                  </SvgIcon>
                }
                variant="contained"
                sx={{ backgroundColor: '#24A374' }}
                onClick={() => {
                  props.openDrawer({
                    width: "30vw",
                    body: (
                      <DataForm
                        title="Add Institution"
                        onSubmit={async (v) => {
                          const res = await authenticatedAxios.post("/institution/", v);
                          if (res.data.status) {
                            await getData();
                            props.closeDrawer();
                          }
                        }}
                        institutions={institutions}
                        roles={roles}
                      />
                    ),
                  });
                }}
              >
                Add Institution
              </Button>

            </div>
          </Stack>
          <CompaniesSearch />

          <Grid // this is the grid for the companies
            container
            spacing={3} // 32px spacing
          >
            {companies.map((company) => (
              <Grid
                xs={12}
                md={6}
                lg={4}
                key={company.id}
              >
                <CompanyCard company={company} />
              </Grid>
            ))}
          </Grid>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Pagination
              count={1} // 3 pages
              size="small"
              sx={{ color: 'white' }}
            />
          </Box>
        </Stack>
      </Container>
    </Box>
  </div>
);

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
