import React, { useState, useEffect } from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/FirebaseConfig";
import { useAuth } from "../contexts/AuthContext";
import { useParams } from "react-router-dom";

const TimeWatched = () => {
  const [timeWatched, setTimeWatched] = useState(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { userId } = useParams();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchUserData = async () => {
      const user = userId || currentUser.uid;

      if (user) {
        try {
          const userDocRef = doc(db, "users", user);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setReviewCount(userData.reviewCount);

            let totalTime = 0;
            const convertRuntimeToMinutes = (runtime) => {
              const minutes = parseInt(runtime);
              return !isNaN(minutes) ? minutes : 0;
            };

            userData.WatchedMovies.forEach((movie) => {
              totalTime += convertRuntimeToMinutes(movie.runtime);
            });

            userData.WatchedShows.forEach((show) => {
              totalTime += convertRuntimeToMinutes(show.runtime);
            });

            const hours = Math.floor(totalTime / 60);
            const minutes = totalTime % 60;
            const timeString = `${hours} hr ${minutes} min`;

            setTimeWatched(timeString);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [userId, currentUser]);

  return (
    <Box
      component="div"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      padding={0}
      marginTop={0}
      marginBottom={3}
      sx={{
        bgcolor: "#ffffff",
        borderRadius: 10,
        boxShadow: "0px 4px 12px rgba(2, 255, 255, 0.6), 0px 0px 20px rgba(255, 255, 255, 0.8)",
      }}
    >
      <Box
        component="div"
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="center"
        width="100%"
        padding={2}
      >
        <Box display="flex" alignItems="center" marginBottom={1}>
          <AccessTimeIcon sx={{ fontSize: isSmallScreen ? 30 : 35, color: "#00509d" }} />
          <Typography variant={isSmallScreen ? "body1" : "h6"} color="#3c3c3c" marginLeft={1}>
            Time Watched
          </Typography>
        </Box>
        <Typography variant={isSmallScreen ? "h6" : "h5"} color="#00509d" sx={{ ml: 6 }}>
          {loading ? "Loading..." : timeWatched}
        </Typography>
      </Box>
      <Box component="div" width="100%" height="1px" bgcolor="#ccc" my={2}></Box>
      <Box
        component="div"
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="center"
        width="100%"
        padding={2}
      >
        <Box display="flex" alignItems="center" marginBottom={1}>
          <RateReviewIcon sx={{ fontSize: isSmallScreen ? 30 : 35, color: "#3dccc7" }} />
          <Typography variant={isSmallScreen ? "body1" : "h6"} color="#3c3c3c" marginLeft={1}>
            Review Count
          </Typography>
        </Box>
        <Typography variant={isSmallScreen ? "h6" : "h5"} color="#3dccc7" sx={{ ml: 6 }}>
          {loading ? "Loading..." : reviewCount}
        </Typography>
      </Box>
    </Box>
  );
};

export default TimeWatched;
