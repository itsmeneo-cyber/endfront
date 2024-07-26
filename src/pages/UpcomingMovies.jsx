import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import RocketIcon from '@mui/icons-material/Rocket';const UpcomingMovies = () => {
  const navigate = useNavigate();

  const handleExploreMore = () => {
    navigate("/latestMovies"); // Navigate to MovieList component
  };

  return (
    <Box
      component="div"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      padding={2}
      marginBottom={2}
      bgcolor="#fff"
      boxShadow={10}
      borderRadius={5}
      position="relative"
      height="auto"
    >
      <Box
        component="div"
        display="flex"
        flexDirection="column"
        alignItems="start"
        justifyContent="center"
        padding={0}
        height="80%"
      >
        <RocketIcon  sx={{ fontSize: 40, color: "purple" }} />
        <Typography variant="h6" color="#3c3c3c" marginTop={1}>
          Wanna Know about the latest Hits?
        </Typography>
   
        <Button
          variant="contained"
          onClick={handleExploreMore}
          sx={{
            backgroundColor: "#3f51b5",
            color: "white",
            marginTop: 1,
            background:
              "linear-gradient(99.89deg, #f78940 0%, #f9027e 106.22%)",
          }}
        >
          Explore More
        </Button>
      </Box>
    </Box>
  );
};

export default UpcomingMovies;
