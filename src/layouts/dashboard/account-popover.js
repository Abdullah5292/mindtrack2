// import { useCallback } from "react";
// import { useRouter } from "next/navigation";
// import PropTypes from "prop-types";
// import { Box, Divider, MenuItem, MenuList, Popover, Typography } from "@mui/material";
// import { useDispatch } from "react-redux";
// import { logoutUser } from "src/redux/reducers/user";

// export const AccountPopover = (props) => {
//   const { anchorEl, onClose, open } = props;
//   const router = useRouter();
//   const dispatch = useDispatch();

//   const handleSignOut = useCallback(() => {
//     onClose?.();
//     dispatch(logoutUser());
//     router.push("/login");
//   }, [onClose, router]);

//   return (
//     <Popover
//       anchorEl={anchorEl}
//       anchorOrigin={{
//         horizontal: "left",
//         vertical: "bottom",
//       }}
//       onClose={onClose}
//       open={open}
//       PaperProps={{ sx: { width: 200 } }}
//     >
//       <Box
//         sx={{
//           py: 1.5,
//           px: 2,
//         }}
//       >
//         <Typography variant="overline">Account</Typography>
//         <Typography color="text.secondary" variant="body2">
//           Hammad Ul Haq
//         </Typography>
//       </Box>
//       <Divider />
//       <MenuList
//         disablePadding
//         dense
//         sx={{
//           p: "8px",
//           "& > *": {
//             borderRadius: 1,
//           },
//         }}
//       >
//         <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
//       </MenuList>
//     </Popover>
//   );
// };

// AccountPopover.propTypes = {
//   anchorEl: PropTypes.any,
//   onClose: PropTypes.func,
//   open: PropTypes.bool.isRequired,
// };
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import { Box, Divider, MenuItem, MenuList, Popover, Typography, Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "src/redux/reducers/user";

export const AccountPopover = (props) => {
  const { anchorEl, onClose, open } = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const handleSignOut = useCallback(() => {
    onClose?.();
    dispatch(logoutUser());
    router.push("/login");
  }, [onClose, router]);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: "left",
        vertical: "bottom",
      }}
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 200 } }}
    >
      <Box sx={{ py: 1.5, px: 2 }}>
        <Typography variant="overline">Account</Typography>

      </Box>

      {/* Display Profile Picture */}
      <Box sx={{ py: 1, px: 2, display: "flex", alignItems: "center" }}>
        <Avatar
          src={user?.profileImageUrl || "/default-avatar.png"} // Fallback if no image URL
          sx={{ width: 32, height: 32, marginRight: 1 }}
        />
        <Typography variant="body2" color="text.secondary">
          {user?.name || "User"}
        </Typography>
      </Box>

      <Divider />
      <MenuList
        disablePadding
        dense
        sx={{
          p: "8px",
          "& > *": {
            borderRadius: 1,
          },
        }}
      >
        <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
      </MenuList>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
};
