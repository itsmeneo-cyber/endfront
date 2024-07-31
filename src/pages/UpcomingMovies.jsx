import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import RocketIcon from '@mui/icons-material/Rocket';

const UpcomingMovies = () => {
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
      padding={3}
      marginBottom={4}
      bgcolor="#fff"
      borderRadius="20px"
      position="relative"
      height="auto"
      maxWidth="350px"
      width="100%"
      sx={{
        boxShadow: "0px 4px 4px rgba(2, 255, 255, 0.6), 0px 0px 20px rgba(255, 255, 255, 0.8)",
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          boxShadow: "0px 4px 12px rgba(2, 255, 255, 0.6), 0px 0px 20px rgba(255, 255, 255, 0.8)",
          transform: 'scale(1.05)', // Slight scale-up effect on hover
        },
      }}
    >
      <Box
        component="div"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        padding={0}
        height="100%"
        textAlign="center"
      >
        <RocketIcon sx={{ fontSize: 25, color: "#0e6ba8" }} />
        <Typography variant="h6" color="#2b9348" marginTop={0}>
          Discover the Latest Blockbusters!
        </Typography>
        <Button
          variant="contained"
          onClick={handleExploreMore}
          sx={{
            backgroundColor: "#0288d1", // Bright blue background
            color: "#ffffff",           // White text
            marginTop: 1,
            borderRadius: 8,
            padding: '8px 20px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: "#01579b", // Darker blue on hover
              boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.4)',
            },
          }}
        >
          Explore Now
        </Button>
      </Box>
    </Box>
  );
};

export default UpcomingMovies;
