import {
    Card,
    OutlinedInput,
    InputAdornment,
    SvgIcon,
    Box,
    Typography,
    CircularProgress,
    Avatar,
    Chip,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
} from "@mui/material";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { debounce } from "lodash";
export default function SearchUsersBar() {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const wrapperRef = useRef(null);

    const fetchUsers = async (query) => {
        if (!query) return setUsers([]);
        try {
            setLoading(true);
            const res = await axios.get(`/users/searchUsers?name=${query}`);
            setUsers(res.data.users); // Adjust if needed
            setShowDropdown(true);
        } catch (err) {
            console.error("Error fetching users", err);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const debouncedSearch = debounce((val) => {
        fetchUsers(val);
    }, 400);

    useEffect(() => {
        debouncedSearch(searchTerm);
        return () => debouncedSearch.cancel();
    }, [searchTerm]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <Box sx={{ position: "relative", maxWidth: 500 }} ref={wrapperRef}>
            <Card sx={{ p: 0, backgroundColor: "white" }}>
                <OutlinedInput
                    fullWidth
                    placeholder="Search Users"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    startAdornment={
                        <InputAdornment position="start">
                            <SvgIcon color="action" fontSize="small">
                                <MagnifyingGlassIcon />
                            </SvgIcon>
                        </InputAdornment>
                    }
                    sx={{
                        maxWidth: 500,
                        backgroundColor: "white",
                        color: "black",
                        "& input": {
                            color: "none",
                        },
                        "&::placeholder": {
                            color: "black",
                            opacity: 1,
                        },
                        "&:hover": {
                            backgroundColor: "white",
                        },
                        "& fieldset": {
                            border: "none !important", // Completely removes border
                        },
                        "&:hover fieldset": {
                            border: "none !important",
                        },
                        "&.Mui-focused": {
                            backgroundColor: "white !important", // Keeps background white when focused
                        },
                        "&.Mui-focused fieldset": {
                            border: "none !important", // No border even when focused
                        },
                    }}
                />
            </Card>

            {/* Dropdown with results */}
            {showDropdown && (
                <Paper
                    sx={{
                        position: "absolute",
                        zIndex: 10,
                        mt: 1,
                        width: "100%",
                        maxHeight: 300,
                        overflowY: "auto",
                        boxShadow: 3,
                        borderRadius: 2,
                    }}
                >
                    {loading ? (
                        <Box p={2} textAlign="center">
                            <CircularProgress size={20} />
                        </Box>
                    ) : users.length > 0 ? (
                        <List>
                            {users.map((user) => (
                                <ListItem key={user.id} sx={{ alignItems: "flex-start" }}>
                                    <ListItemAvatar>
                                        <Avatar src={user.avatar || ""}>
                                            {user.name[0] || "U"}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body1">{user.name}</Typography>
                                        }
                                        secondary={
                                            <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                                                <Chip
                                                    size="small"
                                                    label={user.role || "No Role"}
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                                <Chip
                                                    size="small"
                                                    label={user.status || "Unknown"}
                                                    color={
                                                        user.status === "active"
                                                            ? "success"
                                                            : user.status === "inactive"
                                                                ? "warning"
                                                                : "default"
                                                    }
                                                    variant="outlined"
                                                />
                                            </Box>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Box p={2}>
                            <Typography variant="body2" textAlign="center">
                                No users found.
                            </Typography>
                        </Box>
                    )}
                </Paper>
            )}
        </Box>
    );
}
