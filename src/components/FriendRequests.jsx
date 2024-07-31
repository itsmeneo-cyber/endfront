import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tabs,
  Tab,
} from "@mui/material";
import { db } from "../firebase/FirebaseConfig";
import {
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import CloseIcon from "@mui/icons-material/Close";

const FriendRequests = () => {
  const { currentUser: alpha } = useAuth();
  const [friendRequestsReceived, setFriendRequestsReceived] = useState([]);
  const [friendRequestsSent, setFriendRequestsSent] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", alpha.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setFriendRequestsReceived(data.friendRequestsReceived || []);
          setFriendRequestsSent(data.friendRequestsSent || []);
        }
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [alpha.uid]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAcceptRequest = async (uid) => {
    setLoading(true);

    try {
      const chatRoomId = [alpha.uid, uid].sort().join("_");
      const betaDoc = await getDoc(doc(db, "users", uid));
      if (betaDoc.exists()) {
        const betaData = betaDoc.data();

        // Add the sender to the current user's friends list
        await updateDoc(doc(db, "users", alpha.uid), {
          friends: arrayUnion({
            uid: uid,
            displayName: betaData.displayName,
            photoURL: betaData.photoURL || "",
            chatRoomId: chatRoomId,
            notificationCount: 0,
            lastMessageReceivedTime: new Date(),
          }),
          friendRequestsReceived: arrayRemove(uid),
        });

        // Add the current user to the sender's friends list
        await updateDoc(doc(db, "users", uid), {
          friends: arrayUnion({
            uid: alpha.uid,
            displayName: alpha.displayName,
            photoURL: alpha.photoURL || "",
            chatRoomId: chatRoomId,
            notificationCount: 0,
            lastMessageReceivedTime: new Date(),
          }),
          friendRequestsSent: arrayRemove(alpha.uid),
        });

        setFriendRequestsReceived((prev) => prev.filter((id) => id !== uid));
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeclineRequest = async (uid) => {
    setLoading(true);
    try {
      // Remove the request from current user's friendRequestsReceived
      await updateDoc(doc(db, "users", alpha.uid), {
        friendRequestsReceived: arrayRemove(uid),
      });
      await updateDoc(doc(db, "users", uid), {
        friendRequestsSent: arrayRemove(alpha.uid),
      });
      // Update state to reflect changes
      setFriendRequestsReceived((prev) => prev.filter((id) => id !== uid));
    } catch (error) {
      console.error("Error declining friend request:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (uid) => {
    setLoading(true);
    try {
      // Remove the request from current user's friendRequestsSent
      await updateDoc(doc(db, "users", alpha.uid), {
        friendRequestsSent: arrayRemove(uid),
      });

      // Remove the current user from the receiver's friendRequestsReceived
      await updateDoc(doc(db, "users", uid), {
        friendRequestsReceived: arrayRemove(alpha.uid),
      });

      // Update state to reflect changes
      setFriendRequestsSent((prev) => prev.filter((id) => id !== uid));
    } catch (error) {
      console.error("Error cancelling friend request:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInfo = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
    return null;
  };

  const renderFriendRequests = (requests, isReceived) => {
    return (
      <List>
        {requests.map((uid) => (
          <FriendRequestItem
            key={uid}
            uid={uid}
            isReceived={isReceived}
            onAccept={handleAcceptRequest}
            onDecline={handleDeclineRequest}
            onCancel={handleCancelRequest}
            fetchUserInfo={fetchUserInfo}
          />
        ))}
      </List>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Tabs value={tabValue} onChange={handleTabChange} centered>
        <Tab label="Received Requests" />
        <Tab label="Sent Requests" />
      </Tabs>
      {tabValue === 0 ? (
        renderFriendRequests(friendRequestsReceived, true)
      ) : (
        renderFriendRequests(friendRequestsSent, false)
      )}
    </Box>
  );
};

const FriendRequestItem = ({ uid, isReceived, onAccept, onDecline, onCancel, fetchUserInfo }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const info = await fetchUserInfo(uid);
      setUserInfo(info);
      setLoading(false);
    };

    fetchUser();
  }, [uid, fetchUserInfo]);

  if (loading) {
    return (
      <ListItem>
        <CircularProgress />
      </ListItem>
    );
  }

  if (!userInfo) {
    return null;
  }

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar src={userInfo.photoURL} alt={userInfo.displayName} />
      </ListItemAvatar>
      <ListItemText
        primary={userInfo.displayName}
        secondary={userInfo.email}
      />
      {isReceived ? (
        <>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon />}
            onClick={() => onAccept(uid)}
          >
            Accept
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<CloseIcon />}
            onClick={() => onDecline(uid)}
            sx={{ ml: 1 }}
          >
            Decline
          </Button>
        </>
      ) : (
        <Button
          variant="contained"
          color="error"
          startIcon={<PersonRemoveIcon />}
          onClick={() => onCancel(uid)}
        >
          Cancel Request
        </Button>
      )}
    </ListItem>
  );
};

export default FriendRequests;
