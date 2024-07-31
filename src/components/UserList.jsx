import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, CircularProgress, Avatar, Button } from "@mui/material";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove ,setDoc,serverTimestamp} from "firebase/firestore";
import { db } from "../firebase/FirebaseConfig";
import { useAuth } from "../contexts/AuthContext";

const UserList = () => {
  const { currentUser: alpha } = useAuth(); 
  const { userId } = useParams(); 
  const [betaInfo, setBetaInfo] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [isFriend, setIsFriend] = useState(false);
  const [sentRequest, setSentRequest] = useState(false);
  const [receivedRequest, setReceivedRequest] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const betaDoc = await getDoc(doc(db, "users", userId));
        if (betaDoc.exists()) {
          const betaData = { ...betaDoc.data(), uid: userId }; 
          const betaInfo = {
            displayName: betaData.displayName,
            photoURL: betaData.photoURL || "", 
          };
          setBetaInfo(betaInfo); 
  
          // Fetch alphaData
          const alphaDoc = await getDoc(doc(db, "users", alpha.uid));
          if (alphaDoc.exists()) {
            const alphaData = alphaDoc.data(); 
            checkFriendStatus(alphaData, betaData);
          } else {
            console.log("Current user not found");
          }
        } else {
          console.log("User not found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
       
        setTimeout(() => {
          setLoading(false);
        }, 500); 
      }
    };
  
    const checkFriendStatus = (alphaData, betaData) => {
      if (alphaData && betaData) {
        const alphaFriends = alphaData.friends || [];
        const alphaSentRequests = alphaData.friendRequestsSent || [];
        const alphaReceivedRequests = alphaData.friendRequestsReceived || [];
    
        // Debugging logs
        console.log("Alpha's Friends List: ", alphaFriends);
        console.log("Alpha's Sent Requests: ", alphaSentRequests);
        console.log("Alpha's Received Requests: ", alphaReceivedRequests);
        console.log("Beta's UID: ", betaData.uid);
    
       
        const isFriend = alphaFriends.some(friend => friend.uid === betaData.uid);
    
        const sentRequest = alphaSentRequests.some(request => request === betaData.uid);
    
      
        const receivedRequest = alphaReceivedRequests.some(request => request === betaData.uid);
    
        console.log("Is Friend: ", isFriend);
        console.log("Sent Request: ", sentRequest);
        console.log("Received Request: ", receivedRequest);
    
        setIsFriend(isFriend); 
        setSentRequest(sentRequest); 
        setReceivedRequest(receivedRequest);
      }
    };
    
  
    fetchUserData();
  }, [userId, alpha]); 
  

  const handleSendRequest = async () => {
    setLoading(true)
    try {
      await updateDoc(doc(db, "users", userId), {
        friendRequestsReceived: arrayUnion(alpha.uid)
      });
      await updateDoc(doc(db, "users", alpha.uid), {
        friendRequestsSent: arrayUnion(userId)
      });
      setSentRequest(true);
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
    finally{
      setLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(db, "users", alpha.uid), {
        friendRequestsSent: arrayRemove(userId)
      });
      await updateDoc(doc(db, "users", userId), {
        friendRequestsReceived: arrayRemove(alpha.uid)
      });
      setSentRequest(false);
    } catch (error) {
      console.error("Error canceling friend request:", error);
    }
    finally{
      setLoading(false);
    }
  };

  const handleAcceptRequest = async () => {
    setLoading(true);
    try {
      const chatRoomId = [alpha.uid, userId].sort().join("_");
  
     
      await updateDoc(doc(db, "users", alpha.uid), {
        friends: arrayUnion({
          uid: userId,
          displayName: betaInfo.displayName,
          photoURL: betaInfo.photoURL || "",
          chatRoomId: chatRoomId,
          notificationCount: 0, 
          lastMessageReceivedTime:new Date(),
        }),
        friendRequestsReceived: arrayRemove(userId),
      });
  
     
      await updateDoc(doc(db, "users", userId), {
        friends: arrayUnion({
          uid: alpha.uid,
          displayName: alpha.displayName,
          photoURL: alpha.photoURL || "",
          chatRoomId: chatRoomId,
          notificationCount: 0, 
          lastMessageReceivedTime:new Date(),

        }),
        friendRequestsSent: arrayRemove(alpha.uid),
      });
   
      setReceivedRequest(false);
      setIsFriend(true);
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
    finally{
      setLoading(false);
    }
  };
  
  

 
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

 
  if (!betaInfo) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>User not found</Typography>
      </Box>
    );
  }
  
  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
      <Avatar
        src={betaInfo.photoURL}
        alt={`${betaInfo.displayName}'s profile picture`}
        sx={{ width: 100, height: 100, marginBottom: 2 }}
      />
      <Typography variant="h4" gutterBottom>
        {betaInfo.displayName}'s Profile
      </Typography>
      {isFriend ? (
        <Typography variant="h6" color="primary">
          You guys are friends
        </Typography>
      ) : (
        <>
          {sentRequest ? (
            <Button variant="contained" color="secondary" onClick={handleCancelRequest}>
              Cancel Request
            </Button>
          ) : receivedRequest ? (
            <>
              <Button variant="contained" color="primary" onClick={handleAcceptRequest}>
                Accept Request
              </Button>
              <Button variant="outlined" onClick={handleCancelRequest} sx={{ marginLeft: 1 }}>
                Decline
              </Button>
            </>
          ) : (
            <Button variant="contained" color="primary" onClick={handleSendRequest}>
              Send Friend Request
            </Button>
          )}
        </>
      )}
    </Box>
  );
};

export default UserList;
