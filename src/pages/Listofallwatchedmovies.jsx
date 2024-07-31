import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  useMediaQuery,
  CircularProgress,
  IconButton,
  Button,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/FirebaseConfig";
import { useAuth } from "../contexts/AuthContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ITEMS_PER_PAGE = 4;

const Listofallmovieswatched = () => {
  const { currentUser } = useAuth();
  const { userId } = useParams();
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    const fetchWatchedMovies = async () => {
      const userIdToLookFor = userId || currentUser.uid;
      if (userIdToLookFor) {
        try {
          const userDocRef = doc(db, "users", userIdToLookFor);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setWatchedMovies(userData.WatchedMovies || []);
          }
        } catch (error) {
          console.error("Error fetching watched movies:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchWatchedMovies();
  }, [currentUser, userId]);

  const paginatedMovies = watchedMovies.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const handleNextPage = () => {
    if ((currentPage + 1) * ITEMS_PER_PAGE < watchedMovies.length) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  return (
    <Box
      p={3}
      bgcolor="#f5f5f5"
      borderRadius={0}
      boxShadow={3}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton component={Link} to="/" color="primary">
          <ArrowBackIcon />
        </IconButton>
        <Typography
          variant="h4"
          gutterBottom
          color="primary"
          align="center"
          sx={{ fontSize: isSmallScreen ? '1.5rem' : '2rem', flex: 1 }}
        >
          Watched Movies
        </Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={2}>
            {paginatedMovies.map((movie, index) => (
              <Grid item xs={12} key={index}>
                <Card
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    backgroundColor: "#fff",
                    borderRadius: 4,
                    boxShadow: 3,
                    cursor: 'pointer',
                    "&:hover": {
                      boxShadow: "0px 12px 20px rgba(0, 0, 0, 0.2)",
                    }
                  }}
                  component={Link}
                  to={`/movie/${movie.imdbID}`}
                >
                  <CardMedia
                    component="img"
                    image={movie.poster}
                    alt={movie.title}
                    sx={{ width: 100, height: '100%' }}
                  />
                  <CardContent sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ fontSize: isSmallScreen ? '0.9rem' : '1.2rem' }}
                    >
                      {movie.title} ({movie.year})
                    </Typography>
                    <Box display="flex" alignItems="center" sx={{ marginBottom: 1 }}>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ marginRight: 3, fontSize: isSmallScreen ? '0.75rem' : '0.875rem' }}
                      >
                        <strong>My Rating:</strong> {movie.rating}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" sx={{ marginBottom: 1 }}>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ marginRight: 3, fontSize: isSmallScreen ? '0.75rem' : '0.875rem' }}
                      >
                        <strong>Watched On:</strong> {new Date(movie.watchedOn?.toDate()).toLocaleString()}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ fontSize: isSmallScreen ? '0.75rem' : '0.875rem' }}
                    >
                      <strong>Review:</strong> {movie.review}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePreviousPage}
              disabled={currentPage === 0}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNextPage}
              disabled={(currentPage + 1) * ITEMS_PER_PAGE >= watchedMovies.length}
            >
              Next
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Listofallmovieswatched;
