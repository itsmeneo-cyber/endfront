import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/FirebaseConfig";
import CustomDoughnut from "../utils/CustomDoughnut";
import MovieIcon from "@mui/icons-material/Movie";
import TvIcon from "@mui/icons-material/Tv";
import { useNavigate, useParams } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import MyButton from "../UI/MyButton";
import MyButton2 from "../UI/MyButton2";
// Define the top 12 genres
const TOP_GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Romance",
  "Science Fiction",
  "Thriller",
  "Mystery",
  "Documentary",
  "Animation",
];

const CombinedComponent = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");
  const [movieCount, setMovieCount] = useState(null);
  const [showCount, setShowCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(
    new Array(TOP_GENRES.length).fill(0)
  );
  const { currentUser } = useAuth();
  const { userId } = useParams();

  const handleMoviesExploreAll = () => {
    const path = userId
      ? `/listofallwatchedmovies/${userId}`
      : "/listofallwatchedmovies";
    navigate(path);
  };

  const handleShowsExploreAll = () => {
    const path = userId
      ? `/listofallwatchedshows/${userId}`
      : "/listofallwatchedshows";
    navigate(path);
  };

  useEffect(() => {
    const fetchCounts = async () => {
      const userIdToLookFor = userId ? userId : currentUser.uid;
      if (userIdToLookFor) {
        try {
          const userDocRef = doc(db, "users", userIdToLookFor);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setMovieCount(userData.WatchedMovies.length);
            setShowCount(userData.WatchedShows.length);

            // Calculate chart data for movies and shows
            const genreCounts = new Array(TOP_GENRES.length).fill(0);

            const countGenres = (items) => {
              items.forEach((item) => {
                item.genres.forEach((genre) => {
                  const index = TOP_GENRES.indexOf(genre);
                  if (index !== -1) {
                    genreCounts[index]++;
                  }
                });
              });
            };

            countGenres(userData.WatchedMovies);
            countGenres(userData.WatchedShows);
            console.log(genreCounts);
            setChartData(genreCounts);
          }
        } catch (error) {
          console.error("Error fetching watched counts:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchCounts();
  }, [currentUser, userId]);

  // Determine the maximum count and its index
  const maxCount = Math.max(...chartData);
  // console.log(maxCount);
  const maxCountIndex = chartData.indexOf(maxCount);
  // console.log(maxCountIndex);

  // Define chart labels and background colors
  const chartLabels = TOP_GENRES;
  const chartBackgroundColors = [
    "#FF5733",
    "#C70039",
    "#FFC300",
    "#DAF7A6",
    "#FF6F61",
    "#C4E538",
    "pink",
    "#1E88E5",
    "#43A047",
    "#FF8C00",
    "#FF6F61",
    "#9C27B0",
  ];
  return (
    <Box
      component="div"
      display="flex"
      flexDirection="row"
      alignItems="flex-start"
      justifyContent="space-between"
      bgcolor="#ffffff"
      boxShadow="0px 2px 8px rgba(2, 255, 255, 0.6), 0px 0px 20px rgba(255, 255, 255, 0.8)" // Bright edge glow
      borderRadius={10}
      padding={2}
    >
      <Box
        component="div"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        bgcolor="#ffffff"
        marginTop={0}
        padding={0}
      >
        <MovieIcon sx={{ fontSize: isMobile ? 30 : 45, color: "#e5383b" }} />
        <Typography
          variant={isMobile ? "body1" : "h6"}
          color="#3c3c3c"
          marginTop={1}
        >
          Movies Watched
        </Typography>
        <Typography
          variant={isMobile ? "h6" : "h4"}
          color="#e5383b"
          marginTop={1}
        >
          {loading ? "Loading..." : movieCount}
        </Typography>
        <MyButton2
          variant="contained"
          sx={{
            backgroundColor: "#6a4c93",
            color: "white",
            marginTop: 2,
            fontSize: isMobile ? "0.70rem" : "0.8rem",
            textTransform: "none",
          }}
          onClick={handleMoviesExploreAll}
        >
          Explore All
        </MyButton2>
        <TvIcon
          sx={{
            fontSize: isMobile ? 30 : 45,
            color: "#eb5e28",
            marginTop: 5.5,
          }}
        />
        <Typography
          variant={isMobile ? "body2" : "body1"}
          color="#3c3c3c"
          marginTop={1}
          sx={{ fontWeight: "bold" }}
        >
          TV Shows Watched
        </Typography>
        <Typography
          variant={isMobile ? "h6" : "h4"}
          color="#e5383b"
          marginTop={1}
        >
          {loading ? "Loading..." : showCount}
        </Typography>
        <MyButton2
          variant="contained"
          sx={{
            backgroundColor: "#6a4c93",
            color: "white",
            marginTop: 4,
            marginBottom: 2,
            textTransform: "none",
            fontSize: isMobile ? "0.50rem" : "0.7rem",
          }}
          onClick={handleShowsExploreAll}
        >
          Explore All
        </MyButton2>
      </Box>

      <Box
        component="div"
        display="flex"
        flexDirection="column"
        alignItems="center"
        bgcolor="#ffffff"
        marginTop={2}
        padding={2}
      >
        <CustomDoughnut
          data={chartData.every((count) => count === 0) ? [0] : chartData}
          backgroundColors={
            chartData.every((count) => count === 0)
              ? ["#34a336"]
              : chartBackgroundColors
          }
          genre={
            chartData.every((count) => count === 0)
              ? "No Data"
              : chartLabels[maxCountIndex]
          }
          colour={
            chartBackgroundColors[maxCountIndex]
          }
        />

        <Box
          component="div"
          display="grid"
          gridTemplateColumns={isMobile ? "repeat(3, 1fr)" : "repeat(4, 1fr)"}
          gridGap="15px"
          marginTop={0}
        >
          {chartLabels.map((label, index) => (
            <Box
              key={index}
              display="flex"
              flexDirection="column"
              alignItems="center"
              textAlign="center"
            >
              <Box
                sx={{
                  backgroundColor: chartBackgroundColors[index],
                  borderRadius: "50%",
                  width: 15,
                  height: 15,
                  marginBottom: 1,
                }}
              />
              <Typography variant="body2" color="#3c3c3c">
                {label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default CombinedComponent;
