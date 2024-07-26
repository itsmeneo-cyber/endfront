import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Grid,
  CircularProgress,
  IconButton,
  Button
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/FirebaseConfig";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ITEMS_PER_PAGE = 4;

const Listofallshowswatched = () => {
  const { currentUser } = useAuth();
  const [watchedShows, setWatchedShows] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatchedShows = async () => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setWatchedShows(userData.WatchedShows || []);
          }
        } catch (error) {
          console.error("Error fetching watched shows:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchWatchedShows();
  }, [currentUser]);

  const paginatedShows = watchedShows.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const handleNextPage = () => {
    if ((currentPage + 1) * ITEMS_PER_PAGE < watchedShows.length) {
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
      borderRadius={4}
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
          sx={{ flex: 1 }}
        >
          Watched Shows
        </Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={2}>
            {paginatedShows.map((show, index) => (
              <Grid item xs={12} key={index}>
                <Card
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '150px',
                    width: '100%',
                    backgroundColor: "#fff",
                    borderRadius: 4,
                    boxShadow: 3
                  }}
                >
                  <CardMedia
                    component="img"
                    image={show.poster}
                    alt={show.title}
                    sx={{ width: 100, height: '100%' }}
                  />
                  <CardContent sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      component="div"
                    >
                      {show.title} ({show.year})
                    </Typography>
                    <Box display="flex" alignItems="center" sx={{ marginBottom: 1 }}>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ marginRight: 1 }}
                      >
                        <strong>IMDb Rating:</strong>
                      </Typography>
                      <Rating
                        name="imdb-rating"
                        value={show.imdbRating} // Assuming the IMDb rating is out of 10
                        readOnly
                        max={10}
                        precision={0.5}
                      />
                    </Box>
                    <Box display="flex" alignItems="center" sx={{ marginBottom: 1 }}>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ marginRight: 3 }}
                      >
                        <strong>My Rating:</strong>
                      </Typography>
                      <Rating
                        name="user-rating"
                        value={show.rating}
                        readOnly
                        max={10}
                        precision={0.5}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                    >
                      <strong>Review:</strong> {show.review}
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
              disabled={(currentPage + 1) * ITEMS_PER_PAGE >= watchedShows.length}
            >
              Next
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Listofallshowswatched;
