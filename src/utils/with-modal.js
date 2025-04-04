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
      title: "Are you sure?",
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
      setModalSettings({});
      onCancel();
      setModalOpen(false);
    };

    const {
      bodyComp,
      showBody,
      showSubmit,
      showCancel,
      title,
      onSubmit,
      onCancel,
      maxWidth,
      noClose,
      blur,
    } = {
      ...defaultModalSettings,
      ...modalSettings,
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
              <Button variant="contained" onClick={closeModal}>
                Cancel
              </Button>
            )}
            {showSubmit && (
              <Button variant="contained" onClick={onSubmit}>
                Confirm
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </>
    );
  };

export default WithModal;