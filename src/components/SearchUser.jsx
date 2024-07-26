import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
  Grid,
  Button,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/FirebaseConfig";
import { useAuth } from "../contexts/AuthContext";

const SearchUser = () => {
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchTerm === "") {
      // Clear search results when search term is empty
      setSearchResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const q = collection(db, "users");
        const querySnapshot = await getDocs(q, { signal });

        // Filter results based on substring match
        const results = querySnapshot.docs
          .map((doc) => {
            const userData = doc.data();
            return {
              id: doc.id,
              displayName: userData.displayName,
              photoURL: userData.photoURL,
            };
          })
          .filter((user) =>
            user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
          );

        setSearchResults(results);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error searching for users:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();

    return () => {
      controller.abort();
    };
  }, [searchTerm]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" sx={{ fontStyle: "italic", mb: 2 }}>
        Find User
      </Typography>
      <TextField
        label="Search by Display Name"
        value={searchTerm}
        onChange={(e) => {
          const newSearchTerm = e.target.value;
          setSearchTerm(newSearchTerm);
          if (!newSearchTerm) {
            setSearchResults([]); // Clear search results if the search term is empty
          }
        }}
        fullWidth
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ maxWidth: 400, mb: 2 }}
      />
      {loading && searchTerm && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress />
        </Box>
      )}
      {!loading && searchTerm && searchResults.length === 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Typography variant="body1" sx={{ color: "#d32f2f" }}>
            No users found.
          </Typography>
        </Box>
      )}
      {searchResults.length > 0 && (
        <Grid container spacing={2}>
          {searchResults.map((user) => (
            <Grid item xs={12} key={user.id}>
              <Box
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: 8,
                  overflow: "hidden",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  transition: "box-shadow 0.3s ease-in-out",
                  "&:hover": {
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                  },
                  display: "flex",
                  flexDirection: isSmallScreen ? "row" : "row", // Adjust direction based on screen size
                  alignItems: isSmallScreen ? "flex-start" : "flex-start", // Center align on small screens
                  p: 2,
                  bg: "white",
                }}
              >
                <Link
                  to={`/profile/${user.id}`}
                  style={{ textDecoration: "none", color: "inherit", flexGrow: 1 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center", // Align items vertically in the center
                      mb: isSmallScreen ? 1 : 0, // Adjust bottom margin on small screens
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        border: "2px solid #3f51b5",
                        overflow: "hidden",
                        flexShrink: 0,
                        marginRight: 2,
                      }}
                    >
                      <img
                        src={user.photoURL || "/default-avatar.jpg"}
                        alt={user.displayName}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold", color: "#3f51b5", mb: 0.5 }}
                      >
                        {user.displayName}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        View Profile
                      </Typography>
                    </Box>
                  </Box>
                </Link>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to={`/user/${user.id}`}
                    sx={{
                      minWidth: "auto",
                      px: isSmallScreen ? 1 : 2,
                      py: isSmallScreen ? 0.5 : 1,
                      fontSize: isSmallScreen ? "0.75rem" : "0.875rem", // Adjust font size
                      mr: isSmallScreen ? 1 : 2,
                      textTransform: "none", // Ensure text decoration remains as it is
                    }}
                  >
                    Make Connection
                  </Button>
                  <PersonIcon sx={{ color: "#3f51b5" }} />
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default SearchUser;
