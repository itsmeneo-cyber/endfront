import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Alert, Chip, Avatar } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import HashLoader from "react-spinners/HashLoader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/FirebaseConfig"; 
import { doc, getDoc } from "firebase/firestore";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const MyAccountDetails = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { currentUser } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userData, setUserData] = useState(null); 

  useEffect(() => {
    const fetchUserData = async () => {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    };
    fetchUserData();
  }, [currentUser.uid]);

  const commonInputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#07cdf5',
    boxSizing: 'border-box',
    fontSize: isSmallScreen ? '0.8rem' : '1rem',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    color: '#7300ff',
    fontSize: isSmallScreen ? '0.8rem' : '1rem',
  };

  const handlePasswordChange = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword) {
      setError("Please fill in both current and new password fields.");
      setLoading(false);
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from the current password.");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);
      setSuccess("Password updated successfully.");
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setError("Incorrect current password. Please try again.");
      } else {
        setError("Error updating password: " + error.message);
      }
    } finally {
      setLoading(false);
      setCurrentPassword("");
      setNewPassword("");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        bgcolor: "#000000",
        height: "100vh",
        padding: 2,
      }}
    >
      <ArrowBackIcon
        onClick={() => window.history.back()}
        sx={{
          color: "#fff",
          fontSize: "1.5rem",
          cursor: "pointer",
          ml: 2,
          mt: 2,
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          p: 3,
        }}
      >
        <Avatar
          src={currentUser.photoURL}
          alt="User Profile"
          sx={{ width: 120, height: 120, marginRight: 1 }}
        />
        <Typography
          variant={isSmallScreen ? "body2" : "h6"}
          color="primary"
          textAlign="start"
          sx={{ color: "#fff" }}
        >
          Account Details
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          alignItems: "start",
          gap: 2,
          mt: 2,
          ml: 1,
          width: "100%",
        }}
      >
        <Chip
          label={
            <Typography
              variant={isSmallScreen ? "body2" : "body1"}
              component="div"
              sx={{
                color: "#fff",
                fontFamily: "Roboto, sans-serif",
                fontStyle: "italic",
              }}
            >
              Username: {currentUser.displayName || "N/A"}
            </Typography>
          }
          color="success"
        />
        <Chip
          label={
            <Typography
              variant={isSmallScreen ? "body2" : "body1"}
              component="div"
              sx={{
                color: "#fff",
                fontFamily: "Roboto, sans-serif",
                fontStyle: "italic",
              }}
            >
              Email: {currentUser.email}
            </Typography>
          }
          color="success"
        />
        <Chip
          label={
            <Typography
              variant={isSmallScreen ? "body2" : "body1"}
              component="div"
              sx={{
                color: "#fff",
                fontFamily: "Roboto, sans-serif",
                fontStyle: "italic",
              }}
            >
              Location: {userData?.location || "N/A"} 
            </Typography>
          }
          color="success"
        />
      </Box>

      <Chip
        label={
          <Typography variant="body2" color="info">
            You can change your password below
          </Typography>
        }
        color="info"
        variant="outlined"
        size="medium"
        sx={{
          marginBottom: 1,
          marginTop: 2,
          marginLeft: 1,
          backgroundColor: "#e1ff00",
        }}
      />
      
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          bgcolor: "#000000",
          padding: '20px',
          width: '100%',
          maxWidth: '400px',
        }}
      >
        <div style={{ width: '100%' }}>
          <div style={{ marginBottom: '10px' }}>
            <input
              id="current-password"
              type="password"
              placeholder="Enter current Password"
              style={commonInputStyle}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '0px' }}>
            <input
              id="new-password"
              type="password"
              placeholder="Enter new Password"
              style={commonInputStyle}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        </div>
        <Box sx={{mT:2,paddingTop:2}}>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePasswordChange}
          disabled={loading}
          sx={{ backgroundColor: "#15ff00" }}
        >
          {loading ? (
            <HashLoader
              color="#ffffff"
              loading={loading}
              cssOverride={override}
              size={20}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          ) : (
            "Change Password"
          )}
        </Button>
      </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2, ml: 2, mr: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      
    </Box>
  );
};

export default MyAccountDetails;
