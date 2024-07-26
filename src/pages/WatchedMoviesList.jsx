import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/FirebaseConfig";
import {
  Box,
  CircularProgress,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { styled } from "@mui/system";

const StyledListItem = styled(ListItem)(({ theme }) => ({
  backgroundColor: "#f0f0f0",
  margin: "8px",
  borderRadius: "8px",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
}));

const StyledBox = styled(Box)(({ theme }) => ({
  padding: "24px",
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
}));

const WatchedMoviesList = () => {
  const { currentUser } = useAuth();
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWatchedMovies = async () => {
      if (currentUser) {
        try {
          const q = query(
            collection(db, "watchedMovies"),
            where("userId", "==", currentUser.uid)
          );
          const querySnapshot = await getDocs(q);
          const movies = querySnapshot.docs.map((doc) => doc.data());
          setWatchedMovies(movies);
        } catch (err) {
          setError("Failed to fetch watched movies");
          console.error("Error fetching watched movies:", err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchWatchedMovies();
  }, [currentUser]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="body1" color="error">
        {error}
      </Typography>
    );
  }

  if (watchedMovies.length === 0) {
    return (
      <Typography variant="body1" color="textSecondary">
        No watched movies found.
      </Typography>
    );
  }

  return (
    <StyledBox>
      <Typography variant="h4" gutterBottom>
        Watched Movies
      </Typography>
      <List>
        {watchedMovies.map((movie) => (
          <React.Fragment key={movie.imdbID}>
            <StyledListItem>
              <ListItemText
                primary={movie.title}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="textPrimary">
                      Rating: {movie.rating}
                    </Typography>
                    {" | Watched on: "}
                    <Typography component="span" variant="body2" color="textSecondary">
                      {new Date(movie.watchedOn.seconds * 1000).toLocaleDateString()}
                    </Typography>
                  </>
                }
              />
            </StyledListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
    </StyledBox>
  );
};

export default WatchedMoviesList;
