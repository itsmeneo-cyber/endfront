import React, { useState, useEffect } from "react";
import { Box, CircularProgress, List, ListItem, ListItemAvatar, Avatar, ListItemText, ListItemSecondaryAction, IconButton, Tooltip, Badge, Paper, Typography } from "@mui/material";
import { Chat as ChatIcon, Notifications as NotificationsIcon, RemoveCircleOutline as RemoveIcon, Person as PersonIcon } from "@mui/icons-material";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebase/FirebaseConfig";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const MyFriends = () => {
  const { currentUser } = useAuth();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;

    const userRef = doc(db, "users", currentUser.uid);

    // Set up real-time listener for the user's document
    const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
      const userData = docSnapshot.data();
      if (userData && userData.friends) {
        // Update the friends list with the latest data
        const updatedFriends = [...userData.friends];
        
        // Sort friends by lastMessageReceived
        updatedFriends.sort((a, b) => (b.lastMessageReceived?.toDate() || 0) - (a.lastMessageReceived?.toDate() || 0));

        setFriends(updatedFriends);
        setLoading(false);
      }
    });

    // Cleanup function to unsubscribe from the listener
    return () => {
      unsubscribe();
    };
  }, [currentUser]);

  const handleRemoveFriend = async (friendId) => {
    try {
      // Remove friend from Firestore
      const userRef = doc(db, "users", currentUser.uid);
      const updatedFriends = friends.filter((friend) => friend.uid !== friendId);
      await updateDoc(userRef, {
        friends: updatedFriends,
      });

      // Remove friend locally
      setFriends(updatedFriends);
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  const handleViewProfile = (friend) => {
    navigate(`/profile/${friend.uid}`);
  };

  const handleStartChat = (friend) => {
    navigate(`/chat/${friend.uid}`); // Navigate to the chat room
  };

  const handleNotificationClick = (friend) => {
    console.log("Notification clicked for", friend.displayName);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={2}>
      {friends.length === 0 ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <Typography variant="h6" color="textSecondary">
            Hey, you don't have any friends. Start making friends! 😊
          </Typography>
        </Box>
      ) : (
        <List>
          {friends.map((friend) => (
            <Paper key={friend.uid} sx={{ mb: 2, p: 1, borderRadius: 3 }}>
              <ListItem disablePadding button onClick={() => handleStartChat(friend)} sx={{ alignItems: "center", height: 64 }}>
                <ListItemAvatar>
                  <Badge
                    color="secondary"
                    variant="dot"
                    invisible={friend.notificationCount === 0}
                  >
                    <Avatar alt={`${friend.displayName}'s profile picture`} src={friend.photoURL} sx={{ width: 48, height: 48 }} />
                  </Badge>
                </ListItemAvatar>
                <ListItemText primary={friend.displayName} sx={{ ml: 2, fontSize: "1rem" }} />
                <ListItemSecondaryAction sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Tooltip title={`Notifications: ${friend.notificationCount}`}>
                    <IconButton edge="end" aria-label="Notifications" onClick={() => handleNotificationClick(friend)}>
                      <Badge badgeContent={friend.notificationCount} color="error">
                        <NotificationsIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="View Profile">
                    <IconButton edge="end" aria-label="View Profile" onClick={() => handleViewProfile(friend)}>
                      <PersonIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Remove Friend">
                    <IconButton edge="end" aria-label="Remove Friend" onClick={() => handleRemoveFriend(friend.uid)}>
                      <RemoveIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Start Chat">
                    <IconButton edge="end" aria-label="Start Chat" onClick={() => handleStartChat(friend)}>
                      <ChatIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            </Paper>
          ))}
        </List>
      )}
    </Box>
  );
};

export default MyFriends;
