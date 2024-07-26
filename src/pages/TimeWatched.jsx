import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
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
  const { currentUser } = useAuth(); // Get the current user from the AuthContext
  const { userId } = useParams(); // Corrected useParams usage

  useEffect(() => {
    const fetchUserData = async () => {
      const user = userId || currentUser.uid; // Use userId prop if available, otherwise use currentUser

      if (user) {
        try {
          const userDocRef = doc(db, "users", user);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            console.log("User Data:", userData);
            setReviewCount(userData.reviewCount);

            let totalTime = 0;
            const convertRuntimeToMinutes = (runtime) => {
              const minutes = parseInt(runtime);
              if (!isNaN(minutes)) {
                return minutes;
              } else {
                return 0;
              }
            };

            userData.WatchedMovies.forEach((movie) => {
              totalTime += convertRuntimeToMinutes(movie.runtime);
            });

            userData.WatchedShows.forEach((show) => {
              totalTime += convertRuntimeToMinutes(show.runtime);
            });

            console.log("Total Time Watched:", totalTime);
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
  }, [userId, currentUser]); // Add currentUser as a dependency

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
        bgcolor: "#ffffff", // Background color
        borderRadius: 10, // Rounded corners
        boxShadow: "0px 4px 12px rgba(2, 255, 255, 0.6), 0px 0px 20px rgba(255, 255, 255, 0.8)" // Bright edge glow
        // transition: "transform 0.2s, box-shadow 0.2s", // Smooth transition
        // "&:hover": {
        //   transform: "scale(1.05)", // Scale up on hover
        //   boxShadow: "0px 15px 20px rgba(0, 0, 0, 0.2)", // Increase shadow on hover
        // },
        // "&::after": {
        //   content: '""',
        //   position: "absolute",
        //   top: 0,
        //   left: 0,
        //   right: 0,
        //   bottom: 0,
        //   borderRadius: 10,
        //   userIdIndex: -1,
        //   background: "linear-gradient(45deg, #f78940, #f9027e)", // Gradient background
        //   opacity: 0,
        //   transition: "opacity 0.3s ease-in-out", // Fade-in transition
        // },
        // "&:hover::after": {
        //   opacity: 1, // Show gradient on hover
        // },
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
          <AccessTimeIcon sx={{ fontSize: 35, color: "#00509d" }} />
          <Typography variant="h6" color="#3c3c3c" marginLeft={1}>
            Time Watched
          </Typography>
        </Box>
        <Typography variant="h5" color="#00509d" sx={{ml:6}}>
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
        padding={2} // Adjusted padding for review count
      >
        <Box display="flex" alignItems="center" marginBottom={1}>
          <RateReviewIcon sx={{ fontSize: 35, color: "#3dccc7" }} />
          <Typography variant="h6" color="#3c3c3c" marginLeft={1}>
            Review Count
          </Typography>
        </Box>
        <Typography variant="h5" color="#3dccc7" sx={{ml:6}}>
          {loading ? "Loading..." : reviewCount}
        </Typography>
      </Box>
    </Box>
  );
};

export default TimeWatched;
