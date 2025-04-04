import { useState } from "react";
import { Modal, Button, Box, TableCell } from "@mui/material";

const LogoColumn = ({ institution }) => {
    const [openModal, setOpenModal] = useState(false);
    const [selectedLogo, setSelectedLogo] = useState("");

    const handleOpenModal = (logo) => {
        setSelectedLogo(logo);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <>
            <TableCell>
                {institution.logo ? (
                    <Button onClick={() => handleOpenModal(institution.logo)} variant="outlined">
                        View
                    </Button>
                ) : (
                    "NA"
                )}
            </TableCell>

            <Modal open={openModal} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "auto",
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    {selectedLogo && <img src={selectedLogo} alt="Institution Logo" style={{ maxWidth: "100%", maxHeight: "80vh" }} />}
                </Box>
            </Modal>
        </>
    );
};

export default LogoColumn;
