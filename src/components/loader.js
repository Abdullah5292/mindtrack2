import { Backdrop, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";

const Loader = () => {
  const loading = useSelector((state) => state.settings.loading);

  return (
    <Backdrop sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })} open={loading}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loader;
