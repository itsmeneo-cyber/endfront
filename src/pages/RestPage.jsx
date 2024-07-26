import React from "react";
import { Box, Grid, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import MoviesWatched from "./MoviesWatched";
import TimeWatched from "./TimeWatched";
import UpcomingMovies from "./UpcomingMovies";
const RestPage = ({ friend }) => {
  const theme = useTheme();
  const isSmallerScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 2,
        pt: 0, // Remove padding-top to eliminate extra space from the top
        backgroundColor: "#000000",
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Ensure content is centered
        // justifyContent:'center',
      }}
    >
      <Grid container spacing={3} sx={{ maxWidth: '100%', mt: 0 }}>
        {isSmallerScreen ? (
          <>
            <Grid item xs={12} md={8}>
              <Box>
                <MoviesWatched friend={friend} />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <TimeWatched friend={friend} />
              <UpcomingMovies/>
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={12} md={4}>
              <TimeWatched friend={friend} />
              <UpcomingMovies />
            </Grid>
            <Grid item xs={12} md={8}>
              <Box>
                <MoviesWatched friend={friend} />
              </Box>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default RestPage;
