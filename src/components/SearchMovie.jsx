import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Backdrop, useMediaQuery } from "@mui/material";
import MovieList from "./MovieList";
import { HashLoader } from "react-spinners";
import { useAuth } from "../contexts/AuthContext"; // Import the useAuth hook
const API_URL = process.env.REACT_APP_BACKEND_URL;

const SearchMovie = () => {
  const navigate = useNavigate();
  const KEY = process.env.OMDB_API_KEY;

  const { currentUser } = useAuth(); // Get the current user

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  const query = useQuery().get("q") || "";
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const handleBack = () => {
    navigate('/');
  };

  useEffect(() => {
    if (!currentUser) {
      navigate('/signin');
      return;
    }

    const controller = new AbortController();

    async function fetchMovies() {
      if (query.length < 3) {
        setShowMessage(true);
        setMovies([]);
        setError("");
        return;
      } else {
        setShowMessage(false);
      }

      try {
        setIsLoading(true);
        setError("");
        setMovies([]);
        
        const res = await fetch(`${API_URL}/api/search-movie?query=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await res.json();

        if (data.Response === "True") {
          console.log(data);
          setMovies(data.Search);
        } else {
          setMovies([]);
          setError(data.Error);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Failed to fetch movies");
        }
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1500); // Display loader for at least 1 second
      }
    }

    fetchMovies();

    return () => {
      controller.abort();
    };
  }, [query, currentUser, navigate]);

  return (
    <Box
      p={3}
      sx={{
        background: "linear-gradient(135deg, #121212, #282828)",
        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)",
        color: "#ffffff",
        minHeight: "100vh",
        padding: "20px",
        border: "6px solid #00b4d8",
        position: "relative",
      }}
    >
      <Typography
        variant="body1"
        gutterBottom
        sx={{
          color: "#fcbf49",
          textAlign: "center",
          marginBottom: "20px",
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: "bold",
          textTransform: "uppercase",
          letterSpacing: "2px",
        }}
      >
        Results for {query}
      </Typography>
      {isLoading && (
        <Backdrop
          sx={{
            color: "#black",
            zIndex: (theme) => theme.zIndex.drawer + 1,
            marginLeft: isSmallScreen ? "0" : "220px",
            marginTop: isSmallScreen ? "56px" : "64px",
          }}
          open={true}
        >
          <HashLoader color="#3a0ca3" loading={true} size={50} />
        </Backdrop>
      )}

      {showMessage && (
        <Typography variant="body1" sx={{ textAlign: "center", marginTop: "20px", fontStyle: "italic" }}>
          Please type at least 3 characters to search.
        </Typography>
      )}

      {error ? (
        <Typography variant="body1" color="error" sx={{ textAlign: "center", marginTop: "20px" }}>
          {error}
        </Typography>
      ) : (
        <MovieList movies={movies} />
      )}
    </Box>
  );
};

export default SearchMovie;
