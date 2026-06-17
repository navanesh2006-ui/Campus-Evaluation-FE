import React from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  BottomNavigation,
  BottomNavigationAction,
  CssBaseline,
  useMediaQuery,
  useTheme,
  Container,
  CircularProgress,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import StarIcon from "@mui/icons-material/Star";

import { BEARER_TOKEN, initializeAuth } from "./auth/token";
import { setAuthToken, Log } from "./middleware/logger";
import { NotificationProvider } from "./state/notificationStore";
import { AllNotificationsPage } from "./pages/AllNotificationsPage";
import { PriorityInboxPage } from "./pages/PriorityInboxPage";
import { NotificationBadge } from "./components/NotificationBadge";

// Set Auth Token immediately on start
setAuthToken(BEARER_TOKEN);

// Log application initialization
void Log("frontend", "info", "config", "Application initialised");

const drawerWidth = 240;

const AppContent: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const navigate = useNavigate();

  // Highlight active path
  const currentPath = location.pathname;

  const handleNavigation = (path: string) => {
    navigate(path);
    void Log(
      "frontend",
      "info",
      "config",
      `Route navigation triggered — target: ${path}`
    );
  };

  // Get current page title
  const getPageTitle = () => {
    if (currentPath === "/priority") {
      return "Priority Inbox";
    }
    return "All Notifications";
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}>
      <CssBaseline />

      {/* Top Header Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: "#1e293b", // Slate color
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, fontWeight: "bold", letterSpacing: 0.5 }}
          >
            {getPageTitle()}
          </Typography>
          <NotificationBadge />
        </Toolbar>
      </AppBar>

      {/* Desktop Sidebar navigation */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: "#0f172a", // Darker Slate
              color: "#ffffff",
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto", mt: 2 }}>
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  selected={currentPath === "/notifications" || currentPath === "/"}
                  onClick={() => handleNavigation("/notifications")}
                  sx={{
                    mx: 1,
                    borderRadius: 1,
                    mb: 1,
                    color: "#94a3b8",
                    "&.Mui-selected": {
                      backgroundColor: "primary.main",
                      color: "#ffffff",
                      "& .MuiListItemIcon-root": {
                        color: "#ffffff",
                      },
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                    },
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.08)",
                      color: "#ffffff",
                      "& .MuiListItemIcon-root": {
                        color: "#ffffff",
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                    <NotificationsIcon />
                  </ListItemIcon>
                  <ListItemText primary="All Notifications" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  selected={currentPath === "/priority"}
                  onClick={() => handleNavigation("/priority")}
                  sx={{
                    mx: 1,
                    borderRadius: 1,
                    color: "#94a3b8",
                    "&.Mui-selected": {
                      backgroundColor: "primary.main",
                      color: "#ffffff",
                      "& .MuiListItemIcon-root": {
                        color: "#ffffff",
                      },
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                    },
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.08)",
                      color: "#ffffff",
                      "& .MuiListItemIcon-root": {
                        color: "#ffffff",
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                    <StarIcon />
                  </ListItemIcon>
                  <ListItemText primary="Priority Inbox" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>
      )}

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: isMobile ? 0 : `${drawerWidth}px`,
          mt: 8,
          mb: isMobile ? 8 : 0,
          backgroundColor: "#f8fafc", // Very light slate bg
          minHeight: `calc(100vh - ${isMobile ? 128 : 64}px)`,
        }}
      >
        <Container maxWidth="md" disableGutters>
          <Routes>
            <Route path="/" element={<Navigate to="/notifications" replace />} />
            <Route path="/notifications" element={<AllNotificationsPage />} />
            <Route path="/priority" element={<PriorityInboxPage />} />
            <Route path="*" element={<Navigate to="/notifications" replace />} />
          </Routes>
        </Container>
      </Box>

      {/* Mobile Bottom Navigation bar */}
      {isMobile && (
        <BottomNavigation
          value={currentPath === "/priority" ? 1 : 0}
          onChange={(_event, newValue) => {
            const dest = newValue === 1 ? "/priority" : "/notifications";
            handleNavigation(dest);
          }}
          showLabels
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            borderTop: "1px solid #e2e8f0",
            backgroundColor: "#ffffff",
            zIndex: 1000,
          }}
        >
          <BottomNavigationAction
            label="All"
            icon={<NotificationsIcon />}
            sx={{
              color: currentPath !== "/priority" ? "primary.main" : "text.secondary",
            }}
          />
          <BottomNavigationAction
            label="Priority"
            icon={<StarIcon />}
            sx={{
              color: currentPath === "/priority" ? "primary.main" : "text.secondary",
            }}
          />
        </BottomNavigation>
      )}
    </Box>
  );
};

export const App: React.FC = () => {
  const [initialized, setInitialized] = React.useState(false);

  React.useEffect(() => {
    initializeAuth()
      .then(() => {
        setInitialized(true);
      })
      .catch(() => {
        setInitialized(true); // Proceed even on error to allow fallback/offline behavior
      });
  }, []);

  if (!initialized) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f8fafc",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  );
};

export default App;
