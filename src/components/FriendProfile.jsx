import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Grid, Toolbar, IconButton, useMediaQuery, useTheme } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoviesWatched from "../pages/MoviesWatched";
import TimeWatched from "../pages/TimeWatched";
import UpcomingMovies from "../pages/UpcomingMovies"; // Ensure you import UpcomingMovies

const FriendProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallerScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 1,
        backgroundColor: "#000000",
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {isSmallerScreen && (
        <IconButton
          onClick={() => navigate(-1)}
          sx={{ color: 'white', mb: 0,mr:45 }}
        >
          <ArrowBackIcon />
        </IconButton>
      )}
      <Toolbar />
      <Grid container spacing={3}>
        {isSmallerScreen ? (
          <>
            <Grid item xs={12} md={8}>
              <Box>
                <MoviesWatched userId={userId} />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <TimeWatched userId={userId} />
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={12} md={4}>
              <TimeWatched userId={userId} />
              <UpcomingMovies /> {/* Ensure this is displayed on larger screens */}
            </Grid>
            <Grid item xs={12} md={8}>
              <Box>
                <MoviesWatched userId={userId} />
              </Box>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default FriendProfile;
