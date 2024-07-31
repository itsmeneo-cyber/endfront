import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppBarDrawer from "./AppBarDrawer";
import RestPage from "./pages/RestPage";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./contexts/ProtectedRoute";
import Logout from "./contexts/Logout";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import SearchMovie from "./components/SearchMovie";
import MovieDetails from "./components/MovieDetails";
import SearchUser from "./components/SearchUser";
import FriendRequests from "./components/FriendRequests";
import MyAccountDetails from "./pages/MyAccountDetails";
import Listofallmovieswatched from "./pages/Listofallwatchedmovies";
import Listofallwatchedshows from "./pages/Listofallwatchedshows";
import MyFriends from "./components/MyFriends";
import FriendProfile from "./components/FriendProfile";
import UserList from "./components/UserList";
import ChatWindow from "./components/ChatWindow";
import LatestMovies from "./pages/LatestMovies";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppBarDrawer>
          <Routes>
            <Route path="/" element={<ProtectedRoute element={RestPage} />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/search" element={<SearchMovie />} />
            <Route path="/movie/:imdbID" element={<ProtectedRoute element={MovieDetails} />} />
            <Route path="/searchuser" element={<ProtectedRoute element={SearchUser} />} />
            <Route path="/friend-requests" element={<ProtectedRoute element={FriendRequests}/>}/>
            <Route path="/myaccountdetails" element={<ProtectedRoute element={MyAccountDetails} />} />
            <Route path="/listofallwatchedmovies/:userId?" element={<ProtectedRoute element={Listofallmovieswatched} />} />
            <Route path="/listofallwatchedshows/:userId?" element={<ProtectedRoute element={Listofallwatchedshows} />} />
            <Route path="/display-friends" element={<ProtectedRoute element={MyFriends} />} />
            <Route path="/profile/:userId" element={<ProtectedRoute element={FriendProfile} />} />
            <Route path="/user/:userId" element={<UserList />} />
            <Route path="/chat/:id" element={<ChatWindow />} />          
            <Route path="/latestMovies" element={<LatestMovies />} />
            <Route path="*" element={<NotFound />} /> {/* Handle all undefined routes */}
          </Routes>
        </AppBarDrawer>
      </Router>
    </AuthProvider>
  );
}

export default App;
