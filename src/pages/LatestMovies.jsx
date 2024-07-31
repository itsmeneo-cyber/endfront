import React, { useEffect, useState } from "react";
import { Box, Card, CardMedia, Typography, CircularProgress, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { ArrowBack as ArrowBackIcon, CalendarToday as CalendarTodayIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const LatestMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(`${API_URL}/api/latest-movies`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const json = await res.json();
        setMovies(json.releases); 
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleBack = () => {
    window.history.back();
  };

  if (loading) {
    return <CircularProgress sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "#1976d2" }} />;
  }

  return (
    <Box sx={{ bgcolor: "#121212", minHeight: "100vh", padding: 2 }}>
      <IconButton
        onClick={handleBack}
        sx={{ position: "fixed", top: 10, left: 10, color: "#1976d2" }}
      >
        <ArrowBackIcon />
      </IconButton>
      <Box
        display="grid"
        gridTemplateColumns={isSmallScreen ? "repeat(2, 1fr)" : "repeat(4, 1fr)"}
        gap={2}
        justifyContent="center"
      >
        {movies.map((movie) => (
          <Link
            key={movie.id}
            to={`/movie/${movie.imdb_id}`}
            style={{ textDecoration: "none" }}
          >
            <Card
              sx={{
                width: isSmallScreen ? 150 : 200,
                height: isSmallScreen ? 250 : 300,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: "relative",
                backgroundColor: "#1e1e1e",
                boxShadow: '0 0 15px rgba(25, 118, 210, 0.7)',
                cursor: "pointer",
                '&:hover': {
                  opacity: 0.9,
                  transition: 'all 0.5s ease-in-out',
                  transform: 'scale(1.05)',
                },
              }}
            >
              {movie.poster_url ? (
                <CardMedia
                  component="img"
                  image={movie.poster_url}
                  alt={movie.title}
                  sx={{ height: isSmallScreen ? 150 : 200, objectFit: 'cover' }}
                />
              ) : (
                <Box
                  sx={{
                    height: isSmallScreen ? 150 : 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'grey.900',
                    color: 'text.primary',
                  }}
                >
                  No Image Available
                </Box>
              )}
              <Box
                sx={{
                  padding: 1,
                  backgroundColor: '#1e1e1e',
                  display: 'flex',
                  flexDirection: 'column',
                  color: '#1976d2'
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    mb: 1, 
                    fontWeight: "bold", 
                    overflow: "hidden", 
                    textOverflow: "ellipsis", 
                    whiteSpace: "nowrap", 
                    color: "#ffffff",
                    fontSize: isSmallScreen ? "0.9rem" : "1.2rem"
                  }}
                >
                  {movie.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    fontWeight: "bold", 
                    color: "#f9dc5c",
                    fontSize: isSmallScreen ? "0.75rem" : "0.9rem"
                  }}
                >
                  <CalendarTodayIcon sx={{ marginRight: 1, color: "#f9dc5c" }} /> 
                  Release Date: {new Date(movie.source_release_date).toDateString()}
                </Typography>
              </Box>
            </Card>
          </Link>
        ))}
      </Box>
    </Box>
  );
};

export default LatestMovies;
