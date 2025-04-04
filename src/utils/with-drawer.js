// import { Box, Drawer } from "@mui/material";
// import { useState, useCallback } from "react";

// const WithDrawer = (Component) =>
//   function HOC(props) {
//     const defaultDrawerSettings = {
//       body: <></>,
//       title: "",
//       onSubmit: () => { },
//       onCancel: () => { },
//       noClose: false,
//       width: "552px",
//     };

//     const [drawerState, setDrawerState] = useState(false);
//     const [drawerSettings, setDrawerSettings] = useState(defaultDrawerSettings);

//     const openDrawer = useCallback((settings) => {
//       setDrawerSettings((prev) => ({ ...prev, ...settings }));
//       setDrawerState(true);
//     }, []);

//     const closeDrawer = useCallback(() => {
//       if (!drawerSettings.noClose) {
//         drawerSettings.onCancel?.();
//         setDrawerSettings(defaultDrawerSettings);
//         setDrawerState(false);
//       }
//     }, [drawerSettings]);

//     return (
//       <>
//         <Component
//           drawerState={drawerState}
//           openDrawer={openDrawer}
//           closeDrawer={closeDrawer}
//           {...props}
//         />
//         <Drawer
//           open={drawerState}
//           onClose={closeDrawer}
//           anchor="right"
//           sx={{
//             "& .MuiDrawer-paper": {
//               width: "552px",
//               bgcolor: "#FAEAF0",
//               boxShadow: 3,
//               height: "calc(100vh - 64px)", // Leaves 64px space at the top
//               marginTop: "64px", // Pushes drawer down
//               borderTopLeftRadius: "16px", // Optional: Rounded corners
//               borderTopRightRadius: "16px", // Optional: Rounded corners
//             },
//           }}
//         >
//           <Box height="100%" width="552px" p={3}>
//             {typeof drawerSettings.body === "function"
//               ? drawerSettings.body()
//               : drawerSettings.body}
//           </Box>
//         </Drawer>
//       </>
//     );
//   };

// export default WithDrawer;

import { Box, Drawer } from "@mui/material";
import { useState, useCallback } from "react";

const WithDrawer = (Component) =>
  function HOC(props) {
    const defaultDrawerSettings = {
      body: <></>,
      title: "",
      onSubmit: () => { },
      onCancel: () => { },
      noClose: false,
      width: "552px", // Fixed width
    };

    const [drawerState, setDrawerState] = useState(false);
    const [drawerSettings, setDrawerSettings] = useState(defaultDrawerSettings);

    const openDrawer = useCallback((settings) => {
      setDrawerSettings((prev) => ({ ...prev, ...settings }));
      setDrawerState(true);
    }, []);

    const closeDrawer = useCallback(() => {
      if (!drawerSettings.noClose) {
        drawerSettings.onCancel?.();
        setDrawerSettings(defaultDrawerSettings);
        setDrawerState(false);
      }
    }, [drawerSettings]);

    return (
      <>
        <Component
          drawerState={drawerState}
          openDrawer={openDrawer}
          closeDrawer={closeDrawer}
          {...props}
        />
        <Drawer
          open={drawerState}
          onClose={closeDrawer}
          anchor="right"
          sx={{
            "& .MuiDrawer-paper": {
              width: "552px", // Fixed width
              bgcolor: "#FAEAF0", // Updated color
              height: "80vh", // Adjusted height (100vh - margin)
              marginTop: "10vh", // Space from the top
              marginBottom: "10vh", // Space from the bottom
              borderTopLeftRadius: "16px", // Rounded only on top-left
              borderBottomLeftRadius: "16px", // Rounded only on bottom-left
              borderTopRightRadius: "0px", // No rounding on the border side
              borderBottomRightRadius: "0px", // No rounding on the border side
              boxShadow: 3,
            },
          }}
        >
          <Box height="100%" width="552px" p={3}>
            {typeof drawerSettings.body === "function"
              ? drawerSettings.body()
              : drawerSettings.body}
          </Box>
        </Drawer>
      </>
    );
  };

export default WithDrawer;
