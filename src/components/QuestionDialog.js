import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    FormGroup,
    FormControlLabel,
    Checkbox,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Box,
    Typography
} from "@mui/material";
import { getQuestions } from "src/utils/client";

const QuestionDialog = ({ open, handleClose, formik }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedModality, setSelectedModality] = useState("");
    const [selectedDifficulty, setSelectedDifficulty] = useState("");
    const [questions, setQuestions] = useState([]);

    // Fetch questions on mount
    const getData = async () => {
        const questionRes = await getQuestions();
        if (questionRes) setQuestions(questionRes);
    };

    useEffect(() => {
        getData();
    }, []);

    // Handle category selection
    const handleModalityChange = (event, newModality) => {
        setSelectedModality(newModality || ""); // Unselect if clicking on the selected one
    };

    const handleDifficultyChange = (event, newDifficulty) => {
        setSelectedDifficulty(newDifficulty || ""); // Unselect if clicking on the selected one
    };

    // Filter questions based on selected modality, difficulty, and search query
    const filteredQuestions = (questions || []).filter((q) => {
        const matchesSearch = q.content.toLowerCase().includes(searchQuery.toLowerCase());

        // Ensure modality and difficulty match (case-insensitive)
        const matchesModality =
            !selectedModality || q.modality.toUpperCase() === selectedModality.toUpperCase();
        const matchesDifficulty =
            !selectedDifficulty || q.difficulty.toUpperCase() === selectedDifficulty.toUpperCase();

        return matchesSearch && matchesModality && matchesDifficulty;
    });

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ color: "#601631" }}>Questions</DialogTitle>
            <DialogContent dividers>
                <Box mb={2}>
                    <TextField
                        label="Search Questions"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </Box>

                {/* Modality Toggle Buttons */}
                <Box mb={2} display="flex" justifyContent="center">
                    <ToggleButtonGroup
                        value={selectedModality}
                        exclusive
                        onChange={handleModalityChange}
                        size="small"
                    >
                        <ToggleButton value="AUDITORY">Auditory</ToggleButton>
                        <ToggleButton value="TEXTUAL">Textual</ToggleButton>
                        <ToggleButton value="IMAGE">Image</ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                {/* Difficulty Toggle Buttons */}
                <Box mb={2} display="flex" justifyContent="center">
                    <ToggleButtonGroup
                        value={selectedDifficulty}
                        exclusive
                        onChange={handleDifficultyChange}
                        size="small"
                    >
                        <ToggleButton value="EASY">Easy</ToggleButton>
                        <ToggleButton value="MEDIUM">Medium</ToggleButton>
                        <ToggleButton value="HARD">Hard</ToggleButton>
                        <ToggleButton value="ADVANCED">Advanced</ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                {/* Display filtered questions */}
                {filteredQuestions.length > 0 ? (
                    <FormGroup>
                        {filteredQuestions.map((q) => (
                            <FormControlLabel
                                key={q.id}
                                control={
                                    <Checkbox
                                        checked={formik.values.questions?.includes(q.id)}
                                        onChange={(e) => {
                                            const updatedQuestions = e.target.checked
                                                ? [...formik.values.questions, q.id]
                                                : formik.values.questions.filter((i) => i !== q.id);

                                            formik.setFieldValue("questions", updatedQuestions);
                                        }}
                                        sx={{ color: "#601631" }}
                                    />
                                }
                                label={`${q.content} [${q.modality}] [${q.difficulty}]`}
                            />
                        ))}
                    </FormGroup>
                ) : (
                    <Typography color="textSecondary">No questions found.</Typography>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default QuestionDialog;
