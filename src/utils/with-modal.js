import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";

const WithModal = (Component) =>
  function HOC(props) {
    const defaultModalSettings = {
      bodyComp: <></>,
      maxWidth: "xs",
      showBody: true,
      title: "Are you sure? This action cannot be undone.",
      showTitle: true,
      onSubmit: () => { },
      onCancel: () => { },
      showSubmit: false,
      showCancel: false,
      noClose: false,
      blur: true,
    };

    const [modalOpen, setModalOpen] = useState(false);
    const [modalSettings, setModalSettings] = useState({});

    const toggleModal = () => setModalOpen((prevVal) => !prevVal);

    const openModal = (settings) => {
      setModalSettings(settings);
      setModalOpen(true);
    };

    const closeModal = () => {
      const onCancelFn = modalSettings?.onCancel || (() => { });
      onCancelFn();
      setModalSettings({});
      setModalOpen(false);
    };

    const {
      bodyComp,
      showBody,
      showSubmit,
      showCancel,
      title,
      onSubmit,
      maxWidth,
      noClose,
      blur,
    } = {
      ...defaultModalSettings,
      ...modalSettings,
    };

    const commonButtonStyles = {
      backgroundColor: "#5f1630",
      color: "#fff",
      textTransform: "none",
      "&:hover": {
        backgroundColor: "#4a1026",
      },
      "&:active": {
        backgroundColor: "#3e0e1e",
      },
      "&:focus": {
        backgroundColor: "#5f1630",
        boxShadow: "none",
      },
    };

    return (
      <>
        <Component
          toggleModal={toggleModal}
          openModal={openModal}
          closeModal={closeModal}
          {...props}
        />
        <Dialog
          open={modalOpen}
          onClose={() => !noClose && closeModal()}
          fullWidth
          maxWidth={maxWidth}
          sx={{
            zIndex: (theme) => theme.zIndex.appBar + 200,
            backdropFilter: blur ? "blur(6px)" : undefined,
          }}
        >
          <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography sx={{ marginRight: 2 }}>{title}</Typography>
            {!noClose && (
              <IconButton onClick={closeModal}>
                X
              </IconButton>
            )}
          </DialogTitle>
          {showBody && <DialogContent>{bodyComp}</DialogContent>}
          <DialogActions>
            {showCancel && (
              <Button variant="contained" onClick={closeModal} sx={commonButtonStyles}>
                Cancel
              </Button>
            )}
            {showSubmit && (
              <Button variant="contained" onClick={onSubmit} sx={commonButtonStyles}>
                Confirm
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </>
    );
  };

export default WithModal;
