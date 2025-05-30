import NextLink from "next/link";
import { usePathname } from "next/navigation";
import PropTypes from "prop-types";
import { Box, Drawer, Stack, useMediaQuery, Typography } from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { items } from "./config";
import { SideNavItem } from "./side-nav-item";
import { hasPermission } from "src/utils/utils";
import Image from "next/image";

const BACKGROUND_COLOR = "rgba(0, 0, 0, 0.7)"; // More opaque black
const ICON_COLOR = "#E8C7D4"; // Light pink/burgundy for icons

export const SideNav = (props) => {
  const { open, onClose } = props;
  const pathname = usePathname();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  const content = (
    <Scrollbar
      sx={{
        height: "100%",
        "& .simplebar-content": {
          height: "100%",
        },
        "& .simplebar-scrollbar:before": {
          background: "rgba(255, 255, 255, 0.2)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Logo and Title Section */}
        <Box 
          sx={{ 
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            mb: 2
          }}
        >
          <Image
            src="/assets/logo.png"
            alt="Mindtrack Logo"
            width={120}
            height={120}
            style={{ 
              objectFit: 'contain',
            }}
          />
          <Typography
            variant="h5"
            sx={{
              color: ICON_COLOR,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: 'uppercase'
            }}
          >
            Mindtrack
          </Typography>
        </Box>

        <Box
          component="nav"
          sx={{
            flexGrow: 1,
            px: 3,
            py: 2,
          }}
        >
          <Stack
            component="ul"
            spacing={1}
            sx={{
              listStyle: "none",
              p: 0,
              m: 0,
            }}
          >
            {items.map((item) => {
              const active = item.path ? pathname === item.path : false;
              const disabled =
                item.requires.length > 0
                  ? !item.requires.some((p) => hasPermission(p))
                  : item.disabled;
              return (
                <SideNavItem
                  active={active}
                  disabled={disabled}
                  external={item.external}
                  icon={item.icon}
                  key={item.title}
                  path={item.path}
                  title={item.title}
                  iconColor={ICON_COLOR}
                />
              );
            })}
          </Stack>
        </Box>
      </Box>
    </Scrollbar>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: BACKGROUND_COLOR,
            color: "common.white",
            width: 280,
            border: "none",
            boxShadow: "none",
            backgroundImage: 'none',
            '& *': {
              fontFamily: "'Inter', sans-serif",
            }
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: BACKGROUND_COLOR,
          color: "common.white",
          width: 280,
          border: "none",
          boxShadow: "none",
          backgroundImage: 'none',
          '& *': {
            fontFamily: "'Inter', sans-serif",
          }
        },
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
  open: PropTypes.bool,
};
