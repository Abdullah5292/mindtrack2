import { Box, Drawer } from "@mui/material";
import { useState } from "react";

const WithDrawer = (Component) =>
  function HOC(props) {
    const defaultDrawerSettings = {
      body: <></>,
      showBody: true,
      title: "",
      onSubmit: () => {},
      onCancel: () => {},
      showSubmit: false,
      showCancel: false,
      noClose: false,
      blur: true,
      width: "40vw",
    };

    const [drawerState, setDrawerState] = useState(false);
    const [drawerSettings, setDrawerSettings] = useState({});

    const toggleDrawer = () => setDrawerState((prevVal) => !prevVal);

    const openDrawer = (settings) => {
      setDrawerSettings(settings);
      setDrawerState(true);
    };
    const closeDrawer = () => {
      setDrawerSettings({});
      onCancel();
      setDrawerState(false);
    };

    const {
      body,
      showBody,
      showSubmit,
      showCancel,
      title,
      onSubmit,
      onCancel,
      noClose,
      blur,
      width,
    } = {
      ...defaultDrawerSettings,
      ...drawerSettings,
    };

    return (
      <>
        <Component
          drawerState={drawerState}
          toggleDrawer={toggleDrawer}
          openDrawer={openDrawer}
          closeDrawer={closeDrawer}
          {...props}
        />
        <Drawer open={drawerState} onClose={() => !noClose && closeDrawer()} anchor="right">
          <Box height="100vh" width={width}>
            {typeof body === "function" ? body() : body}
          </Box>
        </Drawer>
      </>
    );
  };

export default WithDrawer;
