import React, { useState } from "react";
import { TextField, Button, Typography, Box, Avatar, Input ,IconButton} from "@mui/material";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebase/FirebaseConfig";
import { setDoc, doc, query, where, collection, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import StylishLoader from "../utils/StylishLoader"; // Import the StylishLoader component
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import MyButton from "../UI/MyButton";
import MyButton2 from "../UI/MyButton2";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const CustomTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    color: "#333", 
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#ccc", 
    },
    "&:hover fieldset": {
      borderColor: "#888", 
    },
    "&.Mui-focused fieldset": {
      borderColor: "#007bff", 
    },
  },
  "& .MuiInputLabel-root": {
    color: "#666", 
  },
  "& .MuiInputLabel-shrink": {
    color: "#007bff", 
  },
  "& .MuiFormHelperText-root": {
    color: "#d9534f", 
  },
}));

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
       
          const maxWidth = 200; 
          const maxHeight = 200; 

          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });

            setImage(resizedFile);
            setImagePreview(URL.createObjectURL(resizedFile));
          }, file.type);
        };
        img.src = event.target.result;
      };

      reader.readAsDataURL(file);
    }
  };
  const handleGoBack = () => {
    navigate(-1); 
  };
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true); 
    try {

      const displayNameExists = await checkDisplayNameExists(displayName.toLowerCase());
      if (displayNameExists) {
        setError("CineConnect says: Display Name already exists 😔");
        setLoading(false);
        return; // Exit early to prevent sign-up
      }

   
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      const lowercaseDisplayName = displayName.toLowerCase();
      let imageUrl = "";

      if (image) {
        const imageRef = ref(storage, `profileImages/${user.uid}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      await updateProfile(user, {
        displayName: lowercaseDisplayName,
        photoURL: imageUrl,
      });

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        displayName: lowercaseDisplayName,
        photoURL: imageUrl,
        friends: [],
        friendRequestsSent: [],
        friendRequestsReceived: [],
        WatchedMovies: [],
        WatchedShows: [],
        timeWatched: 0,
        Favourites: [],
        reviewCount: 0,
        location: location,
      });

  
      navigate("/");
    } catch (error) {
      console.error("Error creating user: ", error);
      setError(`CineConnect says: ${error.message.replace("Firebase: ", "")}`);
    } finally {
      setLoading(false); 
    }
  };

 
  const checkDisplayNameExists = async (displayName) => {
    try {
      const q = query(
        collection(db, "users"),
        where("displayName", "==", displayName)
      );
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty; 
    } catch (error) {
      console.error("Error checking display name:", error);
      return false;
    }
  };

  return (
    <Box p={3} bgcolor="#f4f7fa" minHeight="100vh">
       <Box display="flex" alignItems="center" mb={2}>
       <IconButton
          onClick={handleGoBack}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            borderRadius: "10px",
            padding: "10px",
            boxShadow: "0px 0px 14px -7px #0056b3",
            transition: "0.5s",
            "&:hover": {
              backgroundColor: "#0056b3",
              boxShadow: "0px 0px 14px -7px #003d7a",
            },
            "&:active": {
              transform: "scale(0.95)",
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" ml={2} sx={{ color: "#007bff" }}>
          Sign Up
        </Typography>
      </Box>
      <form onSubmit={handleSignUp}>
        <CustomTextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
          autoComplete="off"
        />
        <CustomTextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
          autoComplete="off"
        />
        <CustomTextField
          label="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          fullWidth
          margin="normal"
          required
          autoComplete="off"
        />
        <CustomTextField
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          fullWidth
          margin="normal"
          required
          autoComplete="off"
        />
        <div style={{display:"flex",flexDirection:"column",alignItems:"center"}} >
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }} 
            id="image-upload-input"
          />
          <label htmlFor="image-upload-input">
            <Button
              variant="contained"
              component="span"
              color="info"
              disabled={loading}
              startIcon={<CloudUploadIcon />}
              sx={{ mt: 2,mb:2 }}
            >
              Upload Image
            </Button>
          </label>

          {imagePreview && (
            <Avatar
              src={imagePreview}
              alt="Preview"
              sx={{ width: 100, height: 100, marginTop: 2 }}
            />
          )}
          {error && (
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          )}
          <MyButton
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading} 
            sx={{ mt: 2 }}
          >
            {loading ? <StylishLoader /> : "Sign Up"}
          </MyButton>
        </div>
      </form>
    </Box>
  );
};

export default SignUp;
