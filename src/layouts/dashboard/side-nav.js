import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import ArrowTopRightOnSquareIcon from '@heroicons/react/24/solid/ArrowTopRightOnSquareIcon';
import ChevronUpDownIcon from '@heroicons/react/24/solid/ChevronUpDownIcon';
import {
  Box,
  Button,
  Divider,
  Drawer,
  Stack,
  SvgIcon,
  Typography,
  useMediaQuery
} from '@mui/material';
import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';
import { items } from './config';
import { SideNavItem } from './side-nav-item';

export const SideNav = (props) => {
  const { open, onClose } = props;
  const pathname = usePathname();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  const content = (
    <Scrollbar // this is the scrollbar for the side nav
      sx={{
        height: '100%',
        '& .simplebar-content': {
          height: '100%'
        },
        '& .simplebar-scrollbar:before': {
          background: 'neutral.400'
        }
      }}
    >
      <Box // this is the box for the side nav container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box // this is the box for the side nav logo
            component={NextLink}
            href="/"
            sx={{
              display: 'inline-flex',
              height: 32,
              width: 32
            }}
          >

          </Box>



        </Box>
        <Divider sx={{ display: 'none' }} />
        <Box // this is the box for the side nav items
          component="nav"
          sx={{
            flexGrow: 1,
            px: 2,
            py: 3
          }}
        >
          <Stack // this is the stack for the side nav items
            component="ul"
            spacing={2.75} // 22px spacing
            sx={{
              listStyle: 'none',
              p: 0,
              m: 0
            }}
          >
            {items.map((item) => {
              const active = item.path ? (pathname === item.path) : false;

              return (
                <SideNavItem
                  active={active}
                  disabled={item.disabled}
                  external={item.external}
                  icon={item.icon}
                  key={item.title}
                  path={item.path}
                  title={item.title}
                />
              );
            })}
          </Stack>
        </Box>
        <Divider sx={{ display: 'none' }} />

      </Box>
    </Scrollbar >
  );

  if (lgUp) {
    return (
      <Drawer // this handles the side nav for large screens
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // Black with 70% opacity
            color: 'common.white',
            width: 280,
            border: 'none', // Remove border
            boxShadow: 'none' // Remove shadow if any
          }
        }}
        variant="permanent"
      >

        {content}
      </Drawer>
    );
  }

  return (
    <Drawer // this handles the side nav for small screens
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)', // Black with 70% opacity
          color: 'common.white',
          width: 280,
          border: 'none', // Remove border
          boxShadow: 'none' // Remove shadow if any
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >


      {content}
    </Drawer>
  );
};

SideNav.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
