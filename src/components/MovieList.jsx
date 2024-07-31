import React from "react";
import { Link } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
  Button,
  IconButton,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const MovieList = ({ movies = [] }) => {
  return (
    <Box
      sx={{
        padding: "25px",
        backgroundColor: "#000000",
        position: "relative",
      }}
    >
      {/* Back Button */}
      <IconButton
        component={Link}
        to="/"
        sx={{
          position: "absolute",
          top: 0,
          left: 10,
          color: "#fff",
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      <List>
        {movies.map((movie) => (
          <ListItem
            key={movie.imdbID}
            component={Link}
            to={`/movie/${movie.imdbID}`}
            state={{ movie }} 
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              padding: "10px",
              backgroundColor: "#ffffff",
              marginBottom: "20px",
              borderRadius: "12px",
              marginTop:"6px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              transition: "transform 0.3s ease",
              textDecoration: "none",
              '&:hover': {
                transform: "translateY(-5px)",
              },
              '@media (max-width:600px)': {
                padding: "5px",
                marginBottom: "10px",
              },
            }}
          >
            <ListItemAvatar>
              <Avatar
                variant="rounded"
                src={movie.Poster}
                alt={movie.Title}
                sx={{
                  width: { xs: "60px", sm: "80px" },
                  height: { xs: "90px", sm: "120px" },
                  marginRight: "20px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "#333",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: { xs: "120px", sm: "230px" }, 
                    fontSize: { xs: "0.8rem", sm: "1rem" },
                  }}
                >
                  {movie.Title}
                </Typography>
              }
              secondary={
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "#777",
                    fontSize: { xs: "0.65rem", sm: "1rem" },
                  }}
                >
                  {movie.Year}
                </Typography>
              }
              sx={{
                display: "flex",
                flexDirection: "column",
                '@media (max-width:600px)': {
                  fontSize: "0.75rem",
                },
              }}
            />
            <Button
              component={Link}
              to={`/movie/${movie.imdbID}`}
              state={{ movie }}
              variant="contained"
              color="primary"
              size="small"
              sx={{
                marginLeft: "auto",
                background: "linear-gradient(99.89deg, #f78940 0%, #f9027e 106.22%)",
                textTransform: "none",
                fontSize: { xs: "0.55rem", sm: "1rem" },
              }}
            >
              <ArrowOutwardIcon sx={{ marginRight: "5px", fontSize: { xs: "1rem", sm: "1.25rem" } }} />
              View Details
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default MovieList;
