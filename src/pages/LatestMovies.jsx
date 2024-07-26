import React, { useEffect, useState } from "react";
import { Box, Card, CardMedia, Typography, CircularProgress, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { ArrowBack as ArrowBackIcon, CalendarToday as CalendarTodayIcon, Movie as MovieIcon } from "@mui/icons-material";
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
        setMovies(json.releases); // Ensure this matches the structure of your response
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
    return <CircularProgress sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />;
  }

  return (
    <Box>
      <IconButton
        onClick={handleBack}
        sx={{ position: "fixed", top: 10, left: 10 }}
      >
        <ArrowBackIcon />
      </IconButton>
      <Box
        display="grid"
        gridTemplateColumns={isSmallScreen ? "repeat(2, 1fr)" : "repeat(4, 1fr)"}
        gap={2}
        padding={2}
        justifyContent="center"
        backgroundColor="#000000"
      >
        {movies.map((movie) => (
          <Link
            key={movie.id}
            to={`/movie/${movie.imdb_id}`}
            style={{ textDecoration: "none" }}
          >
            <Card
              sx={{
                width: 200,
                height: 300,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: "relative",
                boxShadow: '0 0 15px #00ff15',
                cursor: "pointer",
                '&:hover': {
                  opacity: 0.9,
                  transition:'all 0.5s ease-in-out',
                  transform: 'scale(1.05)',
                },
              }}
            >
              {movie.poster_url ? (
                <CardMedia
                  component="img"
                  image={movie.poster_url}
                  alt={movie.title}
                  sx={{ height: 200, objectFit: 'cover' }}
                />
              ) : (
                <Box
                  sx={{
                    height: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'grey.300',
                    color: 'text.primary',
                  }}
                >
                  No Image Available
                </Box>
              )}
              <Box
                sx={{
                  padding: 1,
                  backgroundColor: 'background.paper',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Typography variant="subtitle1" sx={{ display: "flex", alignItems: "center", mb: 1, fontWeight: "bold", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  <MovieIcon sx={{ marginRight: 1, color: "red" }} /> {movie.title}
                </Typography>
                <Typography variant="body2" sx={{ display: "flex", alignItems: "center", fontWeight: "bold" }}>
                  <CalendarTodayIcon sx={{ marginRight: 1, color: "orange" }} /> {new Date(movie.source_release_date).toDateString()}
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
