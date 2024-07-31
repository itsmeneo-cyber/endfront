// NOW WE WILL MIGRATE TO WATCHMOVIE
import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useMediaQuery,
  Chip,
  Backdrop,
  Divider,
  Stack,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/FirebaseConfig";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import TvIcon from "@mui/icons-material/Tv";
import { HashLoader } from "react-spinners";
import StarRateIcon from "@mui/icons-material/StarRate";
import MovieIcon from "@mui/icons-material/Movie";
import ReleasedIcon from "@mui/icons-material/EventAvailableOutlined";
import DirectorIcon from "@mui/icons-material/PersonOutlined";
import WriterIcon from "@mui/icons-material/CreateOutlined";
import ActorsIcon from "@mui/icons-material/PeopleAltOutlined";
import LanguageIcon from "@mui/icons-material/LanguageOutlined";
import CountryIcon from "@mui/icons-material/PublicOutlined";
import AwardsIcon from "@mui/icons-material/EmojiEventsOutlined";
import IMDbIcon from "@mui/icons-material/StarBorderOutlined";
import MetascoreIcon from "@mui/icons-material/MovieFilterOutlined";
import DVDIcon from "@mui/icons-material/EventOutlined";
import BoxOfficeIcon from "@mui/icons-material/MonetizationOnOutlined";
import ProductionIcon from "@mui/icons-material/BusinessOutlined";
import WebsiteIcon from "@mui/icons-material/LanguageOutlined"; // Example icon imports
import TitleIcon from "@mui/icons-material/Title";
import TypeIcon from "@mui/icons-material/Category";
import UserRatingIcon from "@mui/icons-material/Star";
import CriticScoreIcon from "@mui/icons-material/Grade";
import UsRatingIcon from "@mui/icons-material/ThumbUpAlt";
import PopularityIcon from "@mui/icons-material/TrendingUp";
import {
  ArrowBack as ArrowBackIcon,
  MovieFilter as MovieFilterIcon,
  Add as AddIcon,
} from "@mui/icons-material"; 
import { keyframes } from "@mui/system";
import { MovieFilter } from "@mui/icons-material";

const scaleAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

const renderIcon = (label) => {
  switch (label.toLowerCase()) {
    case "original title":
      return <TitleIcon fontSize="small" />;
    case "type":
      return <TypeIcon fontSize="small" />;
    case "release date":
      return <ReleasedIcon fontSize="small" />;
    case "user rating":
      return <UserRatingIcon fontSize="small" />;
    case "critic score":
      return <CriticScoreIcon fontSize="small" />;
    case "us rating":
      return <UsRatingIcon fontSize="small" />;
    case "original language":
      return <LanguageIcon fontSize="small" />;
    case "popularity percentile":
      return <PopularityIcon fontSize="small" />;
    default:
      return null; // Default case, no icon
  }
};

const MovieDetails = () => {
  const { imdbID } = useParams();
  const [watchmodeMovie, setWatchmodeMovie] = useState(null); // State for Watchmode data
  const [omdbMovie, setOmdbMovie] = useState(null); // State for OMDB data
  const [isLoading, setIsLoading] = useState(true);
  const [posterLoading, setPosterLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [isInWatchListMovies, setIsInWatchListMovies] = useState(false);
  const [isInWatchListShows, setIsInWatchListShows] = useState(false);
  const { currentUser } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [review, setReview] = useState("");
  const [typeToAdd, setTypeToAdd] = useState("");
  const [streamingPlatforms, setStreamingPlatforms] = useState([]);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const API_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const controller = new AbortController();

    const loadImage = async (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = (error) => reject(error);
        img.src = url;
      });
    };

    const fetchMovieData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/movie-details?imdbID=${imdbID}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await res.json();

        // Load poster image asynchronously
        if (data.omdb.Poster) {
          try {
            const posterURL = await loadImage(data.omdb.Poster);
            data.omdb.Poster = posterURL;
            setPosterLoading(false);
          } catch (error) {
            console.error("Failed to load poster image:", error);
            setPosterLoading(false);
          }
        }

        setWatchmodeMovie(data.watchmode);
        setOmdbMovie(data.omdb);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Failed to fetch movie details");
        }
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUserMovieData = async () => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();

            // Check if the movie/show is in WatchedMovies or WatchedShows
            const isMovieInWatchedMovies = userData.WatchedMovies?.some(
              (movie) => movie.imdbID === imdbID
            );
            const isMovieInWatchedShows = userData.WatchedShows?.some(
              (show) => show.imdbID === imdbID
            );

            setIsInWatchListMovies(isMovieInWatchedMovies);
            setIsInWatchListShows(isMovieInWatchedShows);

            // Set user rating if available
            if (isMovieInWatchedMovies || isMovieInWatchedShows) {
              const watchedList = isMovieInWatchedMovies
                ? userData.WatchedMovies
                : userData.WatchedShows;

              const movieData = watchedList.find(
                (item) => item.imdbID === imdbID
              );
              setUserRating(movieData?.rating || 0); // Default to 0 if no rating found
            }
          }
        } catch (error) {
          console.error("Error fetching user movie data:", error);
        }
      }
    };

    fetchMovieData();
    fetchUserMovieData();

    return () => {
      controller.abort();
    };
  }, [currentUser, imdbID]);
  const handleAddToWatched = async (type) => {
    if (!userRating) {
      alert("Please rate the movie before adding it to the watched list.");
      return;
    }
    setTypeToAdd(type);
    setReviewDialogOpen(true);
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleConfirmAddToWatched = async () => {
    setReviewDialogOpen(false);
  
    if (currentUser) {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
  
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const watchedList =
          typeToAdd === "movie"
            ? userData.WatchedMovies
            : userData.WatchedShows;
  
        const currentReviewCount = Number.isFinite(userData.reviewCount) ? userData.reviewCount : 0;
  
        const updatedWatchedList = [
          ...watchedList.filter(item => item.imdbID !== imdbID), // Remove the existing entry if it exists
          {
            imdbID,
            title: omdbMovie.Title,
            runtime: omdbMovie.Runtime,
            year: omdbMovie.Year,
            poster: omdbMovie.Poster,
            review: review,
            watchedOn: new Date(),
            genres: watchmodeMovie.genre_names,
            rating: userRating, 
          },
        ];
  
    
        await setDoc(
          userDocRef,
          {
            [typeToAdd === "movie" ? "WatchedMovies" : "WatchedShows"]:
              updatedWatchedList,
            reviewCount: currentReviewCount + 1, 
          },
          { merge: true }
        );
  
        if (typeToAdd === "movie") {
          setIsInWatchListMovies(true);
          setIsInWatchListShows(false);
        } else {
          setIsInWatchListShows(true);
          setIsInWatchListMovies(false);
        }
      }
    } else {
      alert("Please sign in to add to watched list.");
    }
  };
  

  const handleRemoveFromWatched = async (type) => {
    if (currentUser) {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
  
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const watchedList =
          type === "movie" ? userData.WatchedMovies : userData.WatchedShows;
  
        const updatedWatchedList = watchedList.filter(
          (item) => item.imdbID !== imdbID
        );
  
        
        const currentReviewCount = Number.isFinite(userData.reviewCount) ? userData.reviewCount : 0;
  
        await setDoc(
          userDocRef,
          {
            [type === "movie" ? "WatchedMovies" : "WatchedShows"]:
              updatedWatchedList,
            reviewCount: Math.max(currentReviewCount - 1, 0), 
          },
          { merge: true }
        );
  
        if (type === "movie") {
          setIsInWatchListMovies(false);
        } else {
          setIsInWatchListShows(false);
        }
  
        setUserRating(0);
        alert(
          `Movie removed from watched ${type === "movie" ? "movies" : "shows"} list!`
        );
      }
    }
  };
  
  const handleRatingChange = async (event, newValue) => {
    setUserRating(newValue);

  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPosterLoading(false);
    }, 2000); 

    return () => clearTimeout(timeout);
  }, []);

  const getUniqueStreamingPlatforms = (sources) => {
    const uniquePlatforms = sources.reduce((acc, source) => {
      if (!acc.find((item) => item.name === source.name)) {
        acc.push(source);
      }
      return acc;
    }, []);

    return uniquePlatforms.slice(0, 4); 
  };

  const getPlatformIcon = (name) => {
    switch (name.toLowerCase()) {
      case "hotstar":
        return (
          <img
            src="/hotstar.png"
            alt="Hotstar"
            style={{ width: 24, height: 24 }}
          />
        );
      case "netflix":
        return (
          <img
            src="/netflix.png"
            alt="Netflix"
            style={{ width: 24, height: 24 }}
          />
        );
      case "hulu":
        return (
          <img src="/hulu.png" alt="Hulu" style={{ width: 24, height: 24 }} />
        );
      case "paramount":
        return (
          <img
            src="/paramount.png"
            alt="Paramount"
            style={{ width: 24, height: 24 }}
          />
        );
      case "prime video":
        return (
          <img
            src="/prime.png"
            alt="Prime Video"
            style={{ width: 24, height: 24 }}
          />
        );
      case "max":
        return (
          <img src="/max.png" alt="Max" style={{ width: 24, height: 24 }} />
        );
      case "disney":
        return (
          <img
            src="/disney.png"
            alt="Disney"
            style={{ width: 24, height: 24 }}
          />
        );
        case "binge":
          return (
            <img
              src="/binge.png"
              alt="Binge"
              style={{ width: 24, height: 24 }}
            />
          );
          case "crave":
            return (
              <img
                src="/crave.png"
                alt="Crave"
                style={{ width: 24, height: 24 }}
              />
            );
            case "apple":
              return (
                <img
                  src="/apple.png"
                  alt="Apple"
                  style={{ width: 24, height: 24 }}
                />
              );
              case "youtube":
                return (
                  <img
                    src="/youtube.png"
                    alt="Apple"
                    style={{ width: 24, height: 24 }}
                  />
                );
      default:
        return <MovieFilter />; // Default icon for unknown platforms
    }
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (action) => {
    console.log(action);
    handleClose();
  };
  return (
    <Box
      pl={isSmallScreen ? 0 : 10}
      pr={isSmallScreen ? 0 : 10} 
    
      bgcolor="#000000"
      borderRadius={0}
      boxShadow={0}
      key={1}
      minHeight="100vh"
    >
      {" "}
      {isLoading && (
        <Backdrop
          sx={{
            color: "#00000",
            zIndex: (theme) => theme.zIndex.drawer + 10,
            marginLeft: isSmallScreen ? "0" : "220px",
        
            marginTop: isSmallScreen ? "56px" : "64px",
          }}
          open={true}
        >
          <HashLoader color="#ffff32" size={80} />
        </Backdrop>
      )}
      <Dialog
        open={reviewDialogOpen}
        onClose={() => setReviewDialogOpen(false)}
      >
        <DialogTitle>Add Your Review</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Review"
            type="text"
            fullWidth
            multiline
            minRows={4}
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmAddToWatched} color="primary">
            Add to Watched List
          </Button>
        </DialogActions>
      </Dialog>
      {!isLoading && !error && !posterLoading && (
        <Box key={11}>
          <Box display="flex" key={12}>
            <IconButton
              onClick={() => window.history.back()}
              edge="start"
              color="inherit"
              aria-label="back"
              sx={{
                margin: 1,
                color: "#fff",
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Box>

          {/* Row2 */}
          <Box
            display="flex"
            sx={{
              marginTop: 2,
              margin: 1,
              padding: 1,
              justifyContent: isSmallScreen ? "space-between" : "space-around",
            }}
          >
            {" "}
            {posterLoading ? (
              <Box
                sx={{
                  width: "100px",
                  height: "160px",
                  backgroundColor: "white",
                  borderRadius: 2,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <Box display="flex" flexDirection="column">
                <Box
                  component="img"
                  src={omdbMovie?.Poster}
                  alt={`${omdbMovie?.Title} Poster`}
                  sx={{
                    width: "120px",
                    height: "180px",
                    borderRadius: 2,
                    objectFit: "cover",
                    marginRight: 5,
                  }}
                />
                <Box display="flex" flexDirection="row">
                  {isInWatchListMovies || isInWatchListShows ? (
                    <Typography variant="body2" color="textSecondary">
                      My rating {userRating}
                    </Typography>
                  ) : (
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="start"
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#ffffff", // White text color
                          fontWeight: "bold", // Increased font weight
                          // fontStyle: "italic", // Italic style if needed
                          marginLeft: "0px",
                          marginBottom: "5px", // Add some space below the text
                        }}
                      >
                        <span style={{ marginLeft: "0px" }}>
                          Rate this Movie/Show
                        </span>
                      </Typography>
                      <Rating
                        name="user-rating"
                        value={userRating}
                        onChange={handleRatingChange}
                        max={10}
                        size="small"
                        sx={{
                          marginLeft: 0, 
                          "& .MuiRating-icon": {
                            width: "14px", 
                            height: "14px", 
                            marginRight: "0px", 
                            color: "#ffffff", 
                          },
                        }}
                      />
                    </Box>
                  )}
                </Box>
                {isInWatchListMovies ? (
                 <Button
                 variant="contained"
                 color="error"
                 startIcon={<RemoveCircleOutlineIcon />}
                 onClick={() => handleRemoveFromWatched("movie")}
                 sx={{
                   marginLeft: 0,
                   fontSize: isSmallScreen ? "0.75rem" : "0.875rem",
                   padding: isSmallScreen ? "4px 8px" : "8px 16px", 
                   borderRadius: "4px", 
                   backgroundColor: isSmallScreen ? "#e57373" : "#f44336", 
                   color: "#ffffff", // White text for contrast
                   border: isSmallScreen ? "1px solid #e57373" : "1px solid #f44336", 
                   "&:hover": {
                     backgroundColor: isSmallScreen ? "#ef5350" : "#d32f2f", 
                     borderColor: isSmallScreen ? "#ef5350" : "#d32f2f",
                   },
                   "&:active": {
                     backgroundColor: isSmallScreen ? "#c62828" : "#c62828", 
                     borderColor: isSmallScreen ? "#c62828" : "#c62828",
                   },
                 }}
               >
                 Remove
               </Button>
                ) : isInWatchListShows ? (
                  <Button
                  variant="contained"
                  color="error"
                  startIcon={<RemoveCircleOutlineIcon />}
                  onClick={() => handleRemoveFromWatched("show")}
                  sx={{
                    marginLeft: 0,
                    fontSize: isSmallScreen ? "0.75rem" : "0.875rem",
                    padding: isSmallScreen ? "4px 8px" : "8px 16px", 
                    borderRadius: "4px", 
                    backgroundColor: isSmallScreen ? "#e57373" : "#f44336", 
                    color: "#ffffff", // White text for contrast
                    border: isSmallScreen ? "1px solid #e57373" : "1px solid #f44336", 
                    "&:hover": {
                      backgroundColor: isSmallScreen ? "#ef5350" : "#d32f2f", 
                    },
                    "&:active": {
                      backgroundColor: isSmallScreen ? "#c62828" : "#c62828",
                      borderColor: isSmallScreen ? "#c62828" : "#c62828",
                    },
                  }}
                >
                  Remove
                </Button>
                ) : (
                  <>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={handleClick}
                        sx={{
                          width: "24px",
                          height: "24px",
                          backgroundColor: "#f78940",
                          color: "#fff",
                          "&:hover": {
                            backgroundColor: "#f9027e",
                          },
                          marginRight: "10px",
                          marginTop: "8px",
                        }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                      >
                        <MenuItem
                          onClick={() => handleAddToWatched("movie")}
                          sx={{
                            fontSize: "0.75rem",
                            color: "#000", 
                            backgroundColor: "#fff",
                            "&:hover": {
                              backgroundColor: "#444",
                            },
                          }}
                        >
                          Add to Watched Movies
                        </MenuItem>
                        <MenuItem
                          onClick={() => handleAddToWatched("show")}
                          sx={{
                            color: "#000",
                            fontSize: "0.75rem", 
                            backgroundColor: "#fff",
                            "&:hover": {
                              backgroundColor: "#444",
                            },
                          }}
                        >
                          Add to Watched Shows
                        </MenuItem>
                      </Menu>
                    </Box>
                  </>
                )}
              </Box>
            )}
            <Box display="flex" flexDirection="column">
              <Box
                sx={{
                  margin: 0,
                  borderRadius: 1,
                  boxShadow: 1,
                  backgroundColor: "#000000", 
                  width: "100%", 
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 1,
                }}
              >
                <Typography
                  variant="h5" 
                  color="white"
                  sx={{
                    fontWeight: "500",
                    overflow: "hidden", 
                    textOverflow: "ellipsis", 
                    whiteSpace: "normal", 
                    lineHeight: 1.4,
                    wordBreak: "break-word", 
                    width: "100%", 
                  }}
                >
                  {omdbMovie?.Title || "Untitled"}
                </Typography>
              </Box>

              <Box
                display="flex"
                flexDirection="row"
                flexWrap="wrap"
                alignItems="center"
              >
                {(omdbMovie.Genre ? omdbMovie.Genre.split(", ") : []).map(
                  (genre, index) => (
                    <Chip
                      key={index}
                      label={genre}
                      variant="outlined"
                      size="medium"
                      sx={{
                        backgroundColor: "#333333", 
                        color: "#ffffff", 
                        border: "1px solid #444444", 
                        marginRight: 1,
                        marginBottom: isSmallScreen ? 1 : 2,
                      }}
                    />
                  )
                )}
              </Box>

              <Box
                display="flex"
                flexDirection="row"
                flexWrap="wrap"
                alignItems="center"
              >
         
                <Chip
                  label={`Year: ${omdbMovie?.Year || "N/A"}`}
                  variant="outlined"
                  size="medium"
                  sx={{
                    backgroundColor: "#333333", 
                    color: "#ffffff", 
                    border: "1px solid #444444", 
                    marginRight: 2,
                    marginBottom: isSmallScreen ? 1 : 0,
                  }}
                />

                <Chip
                  label={`Runtime: ${
                    omdbMovie?.Runtime ? omdbMovie.Runtime : "N/A"
                  }`}
                  variant="outlined"
                  size="medium"
                  sx={{
                    backgroundColor: "#333333",
                    color: "#ffffff",
                    marginRight: 1,
                    marginBottom: isSmallScreen ? 1 : 0,
                    border: "1px solid #444444", 
                  }}
                />
              </Box>
              <Box display="flex" flexDirection="column">
                {omdbMovie?.Ratings && omdbMovie.Ratings.length > 0 ? (
                  omdbMovie.Ratings.map((rating, index) => {
                    let color;
                    let icon;

                    switch (rating.Source.toLowerCase()) {
                      case "internet movie database":
                      case "imdb":
                        color = "#fff";
                        icon = "/imdb.png";
                        break;
                      case "rotten tomatoes":
                      case "rottentomatoes":
                        color = "#fff";
                        icon = "/rottentomato.png"; 
                        break;
                      case "metacritic":
                        color = "#fff";
                        icon = "/metacritic.png"; 
                        break;
                      default:
                        color = "tomato";
                        icon = "https://example.com/default-icon.png"; 
                    }

                    return (
                      <Box
                        key={index}
                        display="flex"
                        alignItems="center"
                        mb={1}
                        mt={1}
                      >
                        <img
                          src={icon}
                          alt={rating.Source}
                          style={{
                            width: 20,
                            height: 20,
                            marginLeft: 4,
                            marginRight: 12,
                            borderRadius: "50%", 
                            objectFit: "cover", 
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            color: color,
                            fontSize: "0.65rem",
                            fontWeight: "200",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {rating.Source === "Internet Movie Database"
                            ? "IMDb"
                            : rating.Source}
                          : {rating.Value}
                        </Typography>
                      </Box>
                    );
                  })
                ) : (
                  <Typography
                    variant="body2"
                    sx={{ color: "gray", fontSize: "0.65rem" }}
                  >
                    No ratings available
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
          {/* {Row 2 ends here} */}
          <Box
            sx={{
              margin: 1,
              padding: 2,
              borderRadius: 1,
              boxShadow: 1,
            }}
          >
            <Typography
              variant="h4" 
              color="white" 
              sx={{
                textAlign: "left",
                lineHeight: 1.5, 
                fontWeight: "bold",
                mb: 1, 
              }}
            >
              Plot:
            </Typography>
            <Typography
              variant="body1"
              color="white"
              sx={{
                fontSize: "1rem", 
                lineHeight: 1.4,
                fontWeight: "100", 
                textAlign: "justify",
                color: "#e5e5e5",
              }}
            >
              {omdbMovie?.Plot || "No plot available"}
            </Typography>
          </Box>

          <Box
            sx={{
              margin: 1,
              padding: 2,
              borderRadius: 1,
              boxShadow: 1,
            }}
          >
            <Typography
              variant="h4"
              color="white"
              sx={{
                fontWeight: "bold",
                mb: 1, 
                textAlign: "left",
              }}
            >
              Cast:
            </Typography>

            <Typography
              variant="body1"
              color="white"
              sx={{
                fontSize: "1rem",
                lineHeight: 1.4,
                fontWeight: "100",
                textAlign: "left", 
                mb: 1, 
              }}
            >
              <span style={{  color: "#e5e5e5" }}>
                Director:
              </span>{" "}
              {omdbMovie?.Director || "N/A"}
            </Typography>

            <Typography
              variant="body1"
              color="white"
              sx={{
                fontSize: "1rem",
                lineHeight: 1.4,
                fontWeight: "100",
                textAlign: "left", // Align text to the left
                mb: 1, // Margin bottom for spacing
              }}
            >
              <span style={{  color: "#e5e5e5" }}>
                Writer:
              </span>{" "}
              {omdbMovie?.Writer || "N/A"}
            </Typography>

            <Typography
              variant="body1"
              color="white"
              sx={{
                fontSize: "1rem",
                lineHeight: 1.4,
                fontWeight: "100",
                textAlign: "left", // Align text to the left
                mb: 1, // Margin bottom for spacing
              }}
            >
              <span style={{  color: "#e5e5e5" }}>
                Actors:
              </span>{" "}
              {omdbMovie?.Actors || "N/A"}
            </Typography>
          </Box>

          <Box
            sx={{
              marginLeft: 1,
              padding: 2,
              borderRadius: 1,
              boxShadow: 1,
             
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              color="white"
              sx={{
                textAlign: "left",
                lineHeight: 1.5,
                fontWeight: "bold",
                mb: 1,
              }}
            >
              Financials:
            </Typography>
            <Typography
              variant="body1"
              color="white"
              sx={{
                fontSize: "1rem",
                lineHeight: 1.4,
                fontWeight: "100",
                textAlign: "justify",
                color: "#e5e5e5",
              }}
            >
              Box Office: {omdbMovie?.BoxOffice || "N/A"}
            </Typography>
          </Box>
          <Stack spacing={1} sx={{ marginTop: 0 }}>
            {!isLoading &&
              !posterLoading &&
              watchmodeMovie?.sources?.length > 0 && (
                <>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="start"
                    mb={2}
                  >
                    <Typography
                      variant={isSmallScreen ? "h4" : "h6"} 
                      sx={{
                        marginBottom: 1,
                        marginLeft:3,
                        color: "#22cfff",
                        fontWeight: "bold",
                        animation: `${scaleAnimation} 3s infinite`, 
                      }}
                    >
                      Streaming Platforms
                    </Typography>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="start"
                      mb={2}
                    >
                      <Box display="flex" flexDirection="row" flexWrap="wrap">
                        {getUniqueStreamingPlatforms(
                          watchmodeMovie?.sources
                        ).map((source, index) => (
                          <Chip
                            key={index}
                            label={source.name}
                            variant="outlined"
                            size={isSmallScreen ? "small" : "medium"} 
                            icon={getPlatformIcon(source.name)}
                            sx={{
                              cursor: "pointer",
                              margin: 1,
                             
                              animation: `${scaleAnimation} 3s infinite`,
                          
                              fontSize: isSmallScreen ? "0.8rem" : "1rem",
                              padding: isSmallScreen ? "4px 8px" : "8px 16px",
                             
                              color: "#e5e5e5",
                              backgroundColor: "#121212",
                            }}
                            component="a"
                            href={source.web_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </>
              )}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default MovieDetails;
