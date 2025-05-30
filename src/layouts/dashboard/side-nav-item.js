import NextLink from "next/link";
import PropTypes from "prop-types";
import { Box, ButtonBase } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

const ACTIVE_COLOR = "#601631";
const DEFAULT_COLOR = "#F3C9D8";

export const SideNavItem = (props) => {
  const { active = false, disabled, external, icon, path, title } = props;

  const linkProps = path
    ? external
      ? {
          component: "a",
          href: path,
          target: "_blank",
        }
      : {
          component: NextLink,
          href: path,
        }
    : {};

  return (
    <li>
      <ButtonBase
        disabled={disabled}
        sx={{
          alignItems: "center",
          borderRadius: 2,
          display: "flex",
          justifyContent: "flex-start",
          pl: "16px",
          pr: "16px",
          py: "12px",
          textAlign: "left",
          width: "100%",
          transition: "all 0.2s ease-in-out",
          ...(active && {
            backgroundColor: "rgba(255, 255, 255, 1)",
            "& .icon-wrapper, & .nav-text": {
              color: ACTIVE_COLOR,
            },
            "& .nav-text": {
              fontWeight: 600,
            },
          }),
          "&:hover": {
            backgroundColor: active ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.1)",
            "& .icon-wrapper, & .nav-text": {
              color: active ? ACTIVE_COLOR : DEFAULT_COLOR,
            },
          },
        }}
        {...linkProps}
      >
        {icon && (
          <Box
            component="span"
            className="icon-wrapper"
            sx={{
              alignItems: "center",
              color: DEFAULT_COLOR,
              display: "inline-flex",
              justifyContent: "center",
              mr: 2,
              transition: "color 0.2s ease-in-out",
              "& svg": {
                fontSize: 24,
              },
            }}
          >
            {icon}
          </Box>
        )}
        <Box
          component="span"
          className="nav-text"
          sx={{
            color: DEFAULT_COLOR,
            flexGrow: 1,
            fontFamily: "'Inter', sans-serif",
            fontSize: 16,
            fontWeight: active ? 600 : 400,
            letterSpacing: 0.3,
            lineHeight: "24px",
            whiteSpace: "nowrap",
            transition: "color 0.2s ease-in-out",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            ...(disabled && {
              color: "neutral.500",
            }),
          }}
        >
          {title}
          {disabled && <LockIcon fontSize="small" sx={{ ml: 1, opacity: 0.5 }} />}
        </Box>
      </ButtonBase>
    </li>
  );
};

SideNavItem.propTypes = {
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  external: PropTypes.bool,
  icon: PropTypes.node,
  path: PropTypes.string,
  title: PropTypes.string.isRequired,
};
