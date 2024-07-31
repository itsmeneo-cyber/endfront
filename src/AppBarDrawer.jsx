import React from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  InputBase,
  Paper,
  Avatar,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import GroupIcon from "@mui/icons-material/Group";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MailIcon from "@mui/icons-material/Mail";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ClearIcon from "@mui/icons-material/Clear";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useAuth } from "./contexts/AuthContext";
import { useMediaQuery } from "@mui/material";

const drawerWidth = 220;

const theme = createTheme({
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
  palette: {
    primary: {
      main: "#6200ea",
    },
    secondary: {
      main: "#03dac6",
    },
    background: {
      default: "#f5f5f5",
    },
  },
});

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.45),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
  display: "flex",
  alignItems: "center",
  border: `3px solid ${alpha(theme.palette.common.black, 0.25)}`,
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  right: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  pointerEvents: "none",
}));

const ClearIconWrapper = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  right: theme.spacing(3),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  border: "3px solid #a9d6e5",
  borderRadius: theme.shape.borderRadius,
  boxShadow: `0 0 10px #a9d6e5`,
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: theme.spacing(2),
    transition: theme.transitions.create("width"),
    width: "100%",
    fontStyle: "italic",
    [theme.breakpoints.up("md")]: {
      width: "30ch",
    },
  },
}));

const HoverableListItem = styled(ListItem)(({ theme }) => ({
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.1)",
  },
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
}));

const DrawerPaper = styled(Paper)(({ theme }) => ({
  height: "100vh",
  width: drawerWidth,
  boxSizing: "border-box",
  backgroundColor: "#1f1f1f",
  color: "#fff",
  elevation: 40,
  border: "none",
  overflow: "hidden",
}));

const HeaderTypography = styled(Typography)(({ theme }) => ({
  color: "white",
  marginLeft: theme.spacing(2),
  marginTop: theme.spacing(1),
  fontFamily: "Poppins, sans-serif",
  fontWeight: "lighter",
}));

const AppBarDrawer = ({ children }) => {
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const [query, setQuery] = React.useState("");
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  React.useEffect(() => {
    if (!location.pathname.startsWith("/search")) {
      setQuery("");
    }
  }, [location.pathname]);

  const handleSearch = (e) => {
    if (e.key === "Escape") {
      setQuery("");
    } else {
      const value = e.target.value;
      setQuery(value);
      if (value.trim() !== "") {
        navigate(`/search?q=${encodeURIComponent(value)}`);
      } else {
        navigate("/");
      }
    }
  };

  const clearSearch = () => {
    setQuery("");
    navigate("/");
  };

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const handleListItemClick = async (link) => {
    setOpenDrawer(false);
    if (link === "/signup" && currentUser) {
      try {
        await logout();
      } catch (error) {
        console.error("Error logging out:", error);
      } finally {
        navigate(link);
      }
    } else {
      navigate(link);
    }
  };

  const drawer = (
    <DrawerPaper>
      <Toolbar />
      <HeaderTypography variant="h6" sx={{ fontStyle: "italic" }}>
        Menu
      </HeaderTypography>
      <List>
        {[
          {
            text: "Home",
            icon: <HomeIcon style={{ color: "#fff" }} />,
            link: "/",
          },
          {
            text: "Account Details",
            icon: <AccountBoxIcon style={{ color: "#fff" }} />,
            link: "/myaccountdetails",
          },
          {
            text: "Friends",
            icon: <GroupIcon style={{ color: "#fff" }} />,
            link: "/display-friends",
          },
          {
            text: "Search User",
            icon: <SearchIcon style={{ color: "#fff" }} />,
            link: "/searchuser",
          },
          {
            text: "Friend Requests",
            icon: <PersonAddIcon style={{ color: "#fff" }} />,
            link: "/friend-requests",
          },
          {
            text: "Sign Up",
            icon: <ExitToAppIcon style={{ color: "#fff" }} />,
            link: "/signup",
          },
          {
            text: "Logout",
            icon: <ExitToAppIcon style={{ color: "#fff" }} />,
            link: "/logout",
          },
        ].map((item, index) => (
          <HoverableListItem
            button
            key={index}
            onClick={() => handleListItemClick(item.link)}
          >
            <ListItemIcon sx={{ paddingBottom: "20px" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                sx: {
                  color: "#fff",
                  fontStyle: "italic",
                  paddingBottom: "20px",
                },
              }}
            />
          </HoverableListItem>
        ))}
      </List>
    </DrawerPaper>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: "#1f1f1f",
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              sx={{ mr: 2, display: { sm: "none" } }}
              onClick={toggleDrawer}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                display: { xs: "none", sm: "block" },
                fontStyle: "italic",
                marginRight: "15px",
                background: "linear-gradient(to right, #BDC3C7, #ffffff)",
                WebkitBackgroundClip: "text",
                color: "transparent",
                fontWeight: "bold",
              }}
            >
              CineConnect
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
              <Search>
                <StyledInputBase
                  placeholder="Search Movies…"
                  inputProps={{ "aria-label": "search" }}
                  value={query}
                  onChange={handleSearch}
                  sx={{ backgroundColor: "#000000" }}
                />
                {query && (
                  <ClearIconWrapper onClick={clearSearch}>
                    <ClearIcon style={{ color: "#ffffff" }} />
                  </ClearIconWrapper>
                )}
                <SearchIconWrapper>
                  <SearchIcon style={{ color: "#ffffff" }} />
                </SearchIconWrapper>
              </Search>
            </Box>
            {currentUser && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  alt={currentUser.displayName}
                  src={currentUser.photoURL}
                />
                <Typography variant="body1" sx={{ ml: 2 }}>
                  {currentUser.displayName}
                </Typography>
              </Box>
            )}
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          <Drawer
            variant="temporary"
            open={openDrawer}
            onClose={toggleDrawer}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                elevation: 40,
                border: "none",
                overflow: "hidden",
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                elevation: 40,
                border: "none",
                overflow: "hidden",
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: isSmallScreen ? "100%" : `calc(100% - ${drawerWidth}px)`,
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Toolbar />
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AppBarDrawer;
