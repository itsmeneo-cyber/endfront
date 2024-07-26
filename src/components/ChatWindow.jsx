import React, { useState, useEffect, useRef } from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  IconButton,
  CircularProgress,
  Box,
  Typography,
  Avatar,
} from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import { useParams } from "react-router-dom";
import { db } from "../firebase/FirebaseConfig";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  getDocs,
  limit,
  startAfter,
  updateDoc,
  doc,
  where,
  getDoc,
  setDoc
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import SendIcon from "@mui/icons-material/Send";
import { FetchFriendInfo } from "../utils/FetchFreindInfo";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
const ChatWindow = () => {
  const Navigate = useNavigate();
  
  const { currentUser } = useAuth();
  const { id } = useParams();
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [isFriends, setIsFriends] = useState(null); // New state to track friendship
  const messagesEndRef = useRef(null);
  const chatRoomId = [currentUser?.uid, id].sort().join("_");
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // Fetch friend info useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        const friendInfo = await FetchFriendInfo(id);
        setDisplayName(friendInfo.displayName);
        setPhotoURL(friendInfo.photoURL);
      } catch (error) {
        console.error("Error fetching friend data:", error);
      }
    };

    fetchData();
  }, [id]);

  // Check if users are friends
  useEffect(() => {
    const checkFriendship = async () => {
      try {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnapshot = await getDoc(userRef);
        if (userSnapshot.exists()) {
          const friendsData = userSnapshot.data().friends || [];
          const isFriends = friendsData.some((friend) => friend.uid === id);
          setIsFriends(isFriends);
        } else {
          setIsFriends(false);
        }
      } catch (error) {
        console.error("Error checking friendship:", error);
        setIsFriends(false);
      }
    };

    if (currentUser && id) {
      checkFriendship();
    }
  }, [currentUser, id]);

  // Fetch initial batch of messages
  useEffect(() => {
    if (isFriends === false) {
      // If they are not friends, redirect or show a message
      Navigate("/");
      return;
    }

    if (isFriends && chatRoomId) {
      const fetchMessages = async () => {
        try {
          // Ensure chatroom document exists
        

          const q = query(
            collection(db, "chats", chatRoomId, "messages"),
            orderBy("createdAt", "desc")
          );

          const unsub = onSnapshot(q, (querySnapshot) => {
            const fetchedMessages = [];
            querySnapshot.forEach((doc) => {
              fetchedMessages.unshift({ id: doc.id, ...doc.data() });
            });
            setMessages(fetchedMessages);
            setLoadingMessages(false);
            setTimeout(scrollToBottom, 200);
          });

          return () => unsub();
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

      fetchMessages();
      markMessagesAsRead(); // Mark messages as read when chat is opened
    }
  }, [isFriends, chatRoomId]);
  const handleClick = () => {
    Navigate(-1); // Go back to the previous page
  };
  const markMessagesAsRead = async () => {
    try {
      const q = query(
        collection(db, "chats", chatRoomId, "messages"),
        where("receiverId", "==", currentUser.uid),
        where("isRead", "==", false)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        await updateDoc(doc.ref, { isRead: true });
      });

      // Update friend's notification count to 0
      const userRef = doc(db, "users", currentUser.uid);
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        const friendsData = userSnapshot.data().friends || [];
        const updatedFriends = friendsData.map((friend) => {
          if (friend.uid === id) {
            return {
              ...friend,
              notificationCount: 0,
            };
          }
          return friend;
        });

        // Update the friends array in user's document
        await updateDoc(userRef, { friends: updatedFriends });
      }
    } catch (error) {
      console.error("Error marking messages as read and updating notification count:", error);
    }
  };

  const fetchMoreMessages = async () => {
    if (isFetchingMore) return;
    setIsFetchingMore(true);

    try {
      const lastMessage = messages[messages.length - 1];
      const q = query(
        collection(db, "chats", chatRoomId, "messages"),
        orderBy("createdAt", "desc"),
        startAfter(lastMessage.createdAt),
        limit(20)
      );

      const querySnapshot = await getDocs(q);
      const fetchedMessages = [];
      querySnapshot.forEach((doc) => {
        fetchedMessages.unshift({ id: doc.id, ...doc.data() });
      });

      setMessages((prevMessages) => [...prevMessages, ...fetchedMessages]);
    } catch (error) {
      console.error("Error fetching more messages:", error);
    } finally {
      setIsFetchingMore(false);
    }
  };
  const sendMessage = async () => {
    try {
      if (!currentUser || newMessage.trim() === "") return;
  
      const message = {
        text: newMessage,
        senderId: currentUser.uid,
        receiverId: id,
        createdAt: serverTimestamp(),
        isRead: false,
      };
  
      // Add message to Firestore
      await addDoc(collection(db, "chats", chatRoomId, "messages"), message);
      setNewMessage("");
  
      // Directly update the lastMessageReceived field for the friend
      const friendRef = doc(db, "users", id);
      const friendSnapshot = await getDoc(friendRef);
      if (friendSnapshot.exists()) {
        const friendsData = friendSnapshot.data().friends || [];
        const updatedFriends = friendsData.map(friend => {
          if (friend.uid === currentUser.uid) {
            return {
              ...friend,
              notificationCount: (friend.notificationCount || 0) + 1,
              lastMessageReceived:new Date(),
            };
          }
          return friend;
        });
  
        // Update the entire friends array
        await updateDoc(friendRef, { friends: updatedFriends });
      }

  
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  

  const handleInputChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (isFriends === null || loadingMessages) {
    return (
      <Box p={2} height="100%" display="flex" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (isFriends === false) {
    return (
      <Box p={2} height="100%" display="flex" alignItems="center" justifyContent="center">
        <Typography variant="h6" color="error">
          You are not friends with this user.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
  p={0}
  height="100%"
  display="flex"
  flexDirection="column"
  sx={{
    backgroundColor: "#e5e5f7",
    opacity: 0.9,
    backgroundImage: "linear-gradient(-45deg, #e5e5f7, #e5e5f7 50%, #d5d7ff 50%, #fefae0)",
    backgroundSize: "10px 10px"
  }}
>
  <Box
    display="flex"
    alignItems="center"
    justifyContent="space-between"
    position="sticky"
    top={60}
    zIndex={100}
    bgcolor="#ffffff"
    color="#1b2021"
    p={2}
    boxShadow="0px 2px 4px rgba(0, 0, 0, 0.7)"
  >
       <Box display="flex" alignItems="center">
      <IconButton onClick={handleClick} color="primary">
        <ArrowBackIcon />
      </IconButton>
      <Avatar
    src={photoURL}
    alt={displayName}
    sx={{
      border: '3px solid #007bff', // Blue border similar to Instagram's story border
      boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.5)' // Optional: Adds a white shadow for a better look
    }}
  />      <Box ml={2}>
        <Typography variant="h6" style={{ fontFamily: 'Roboto', display: 'flex', alignItems: 'center',fontWeight: 'bold', }}>
          <span>{displayName}</span>
          <CheckCircleIcon style={{ color: '#007bff', fontSize: '20px', marginLeft: '8px' }} />
        </Typography>
        <Typography variant="body2" style={{ color: '#000000', fontFamily: 'Roboto' }}>
          Lives in Delhi <LocationOnIcon fontSize="small" style={{ verticalAlign: 'middle', color: '#7cb518', marginLeft: '5px' }} />
        </Typography>
      </Box>
    </Box>
  </Box>

  <Box flex="1" overflow="auto" onScroll={(e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    if (scrollTop === 0 && !isFetchingMore) {
      fetchMoreMessages();
    }
  }}>
    <List>
      {messages.map((message) => (
        <ListItem
          key={message.id}
          alignItems="flex-start"
          style={{
            justifyContent: message.senderId === currentUser?.uid ? "flex-end" : "flex-start",
            marginLeft: message.senderId === currentUser?.uid ? "auto" : "unset",
            marginRight: message.senderId === currentUser?.uid ? "unset" : "auto",
            width: "fit-content",
          }}
        >
          {message.senderId !== currentUser?.uid && (
            <ListItemAvatar>
              <Avatar src={photoURL} />
            </ListItemAvatar>
          )}
          <ListItemText
            primary={message.text}
            secondary={
              <Typography
                variant="caption"
                color={message.senderId === currentUser?.uid ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.6)"}
              >
                {message.createdAt?.seconds
                  ? new Date(message.createdAt.seconds * 1000).toLocaleString()
                  : "Sending..."}
              </Typography>
            }
            primaryTypographyProps={{
              align: message.senderId === currentUser?.uid ? "right" : "left",
              color: message.senderId === currentUser?.uid ? "white" : "black",
            }}
            secondaryTypographyProps={{
              align: message.senderId === currentUser?.uid ? "right" : "left",
            }}
            style={{
              backgroundColor: message.senderId === currentUser?.uid ? "#6200ea" : "#f1f1f1",
              padding: "10px",
              borderRadius: "10px",
              marginBottom: "10px",
              alignSelf: message.senderId === currentUser?.uid ? "flex-end" : "flex-start",
            }}
          />
          {message.senderId === currentUser?.uid && (
            <ListItemAvatar>
              <Avatar src={currentUser?.photoURL} />
            </ListItemAvatar>
          )}
        </ListItem>
      ))}
      <div ref={messagesEndRef} />
      {isFetchingMore && (
        <CircularProgress style={{ margin: "10px auto", display: "block" }} />
      )}
    </List>
  </Box>

  <Box display="flex" alignItems="center" mt={2}>
    <TextField
      placeholder="Type a message..."
      variant="outlined"
      fullWidth
      value={newMessage}
      onChange={handleInputChange}
      onKeyPress={handleKeyPress}
    />
    <IconButton onClick={sendMessage}>
      <SendIcon />
    </IconButton>
  </Box>
</Box>

  );
};

export default ChatWindow;
