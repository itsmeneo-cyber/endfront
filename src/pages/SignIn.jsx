import React, { useState, useEffect } from "react";
import {
  TextField,
  Typography,
  Box,
  CircularProgress,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase/FirebaseConfig";
import { useNavigate } from "react-router-dom";
import MyButton from "../UI/MyButton"; // Import the MyButton component
import MyButton2 from "../UI/MyButton2";
import { styled } from '@mui/material/styles';
import { useAuth } from "../contexts/AuthContext";

const CustomTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-input': {
    color: '#333', // Modern text color
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#ccc', // Light border color
    },
    '&:hover fieldset': {
      borderColor: '#888', // Slightly darker border on hover
    },
    '&.Mui-focused fieldset': {
      borderColor: '#007bff', // Bright blue border when focused
    },
  },
  '& .MuiInputLabel-root': {
    color: '#666', // Modern label color
  },
  '& .MuiInputLabel-shrink': {
    color: '#007bff', // Bright blue label when shrunk
  },
  '& .MuiFormHelperText-root': {
    color: '#d9534f', // Error text color
  },
}));

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Check if user is already signed in on component mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/"); // Redirect to home page if user is signed in
      }
    });

    return unsubscribe;
  }, [navigate]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/"); // Redirect to home page after successful sign-in
    } catch (error) {
      setError(`CineConnect says: ${error.message.replace('Firebase: ', '')}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSignIn(e);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError("CineConnect says: Please enter your email to reset your password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
    } catch (error) {
      setError(`CineConnect says: ${error.message.replace('Firebase: ', '')}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    try {
      // Check if user is currently logged in and log them out
      const user = auth.currentUser;
      if (user) {
        await logout(); // Logout user if they are logged in
      }
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      navigate("/signup"); // Navigate to the sign-up page
    }
  };

  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <Box p={3} bgcolor="#f4f7fa" sx={{ minHeight: "100vh" }}>
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton
          onClick={handleGoBack}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            borderRadius: '10px',
            padding: '10px',
            boxShadow: '0px 0px 14px -7px #007bff',
            transition: '0.5s',
            '&:hover': {
              backgroundColor: '#0056b3',
              boxShadow: '0px 0px 14px -7px #007bff',
            },
            '&:active': {
              transform: 'scale(0.95)',
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" ml={2} sx={{ color: '#007bff' }}>
          Sign In
        </Typography>
      </Box>
      <form onSubmit={handleSignIn}>
        <CustomTextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
          autoComplete="off"
        />
        <CustomTextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
          autoComplete="off"
          onKeyPress={handleKeyPress}
        />
        {error && (
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        )}
        {resetEmailSent && (
          <Typography variant="body1" color="primary">
            Password reset email sent. Check your inbox.
          </Typography>
        )}
        <Box display="flex" alignItems="center" justifyContent="center" gap={2} mt={2}>
          <MyButton onClick={handleSignIn}>
            {loading ? <CircularProgress size={24} /> : "Sign In"}
          </MyButton>
          <MyButton onClick={handleSignUp}>
            Sign Up
          </MyButton>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" mt={2}>
          <MyButton2
            onClick={handlePasswordReset}
            style={{ backgroundColor: "#c1121f", color: 'white' }}
          >
            Forgot Password?
          </MyButton2>
        </Box>
      </form>
    </Box>
  );
};

export default SignIn;
