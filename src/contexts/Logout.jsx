import React, { useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      await logout();
      // Introduce a short delay to show the spinner
      setTimeout(() => {
        navigate("/signin");
      }, 1000); // 1-second delay
    };

    handleLogout();
  }, [logout, navigate]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <CircularProgress />
      <Typography variant="h6" style={{ marginTop: 20 }}>
        Logging out...
      </Typography>
    </Box>
  );
};

export default Logout;
