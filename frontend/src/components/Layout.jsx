import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ShoppingCart from "./ShoppingCart";

const DRAWER_WIDTH = 240;

const Layout = () => {
  const theme = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  // Function to check if the current path matches the path we're checking
  const isCurrentPath = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const drawer = (
    <Box
      sx={{
        overflow: "auto",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src="/logo.png"
          alt="Logo"
          style={{
            maxWidth: "64px",
            height: "auto",
          }}
        />
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/dashboard"
            sx={{
              letterSpacing: "2.14%",
              bgcolor: isCurrentPath("/dashboard")
                ? theme.palette.primary.main
                : "transparent",
              color: isCurrentPath("/dashboard") ? "white" : "inherit",
              "&:hover": {
                bgcolor: isCurrentPath("/dashboard")
                  ? theme.palette.primary.dark
                  : "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: isCurrentPath("/dashboard") ? "inherit" : undefined,
                minWidth: 40,
              }}
            >
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText
              primary="Dashboard"
              primaryTypographyProps={{
                fontWeight: 600,
                letterSpacing: "2.14%",
              }}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            component="a"
            href="/store"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              letterSpacing: "2.14%",
              bgcolor: isCurrentPath("/store")
                ? theme.palette.primary.main
                : "transparent",
              color: isCurrentPath("/store") ? "white" : "inherit",
              "&:hover": {
                bgcolor: isCurrentPath("/store")
                  ? theme.palette.primary.dark
                  : "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: isCurrentPath("/store") ? "inherit" : undefined,
                minWidth: 40,
              }}
            >
              <StorefrontIcon />
            </ListItemIcon>
            <ListItemText
              primary="Store"
              secondary="Customer View"
              primaryTypographyProps={{
                fontWeight: 600,
                letterSpacing: "2.14%",
              }}
              secondaryTypographyProps={{
                fontSize: '0.7rem',
                color: 'text.secondary',
              }}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/dashboard/products"
            sx={{
              letterSpacing: "2.14%",
              bgcolor: isCurrentPath("/dashboard/products")
                ? theme.palette.primary.main
                : "transparent",
              color: isCurrentPath("/dashboard/products") ? "white" : "inherit",
              "&:hover": {
                bgcolor: isCurrentPath("/dashboard/products")
                  ? theme.palette.primary.dark
                  : "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: isCurrentPath("/dashboard/products") ? "inherit" : undefined,
                minWidth: 40,
              }}
            >
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText
              primary="Products"
              primaryTypographyProps={{
                fontWeight: 600,
                letterSpacing: "2.14%",
              }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/dashboard/categories"
            sx={{
              letterSpacing: "2.14%",
              bgcolor: isCurrentPath("/dashboard/categories")
                ? theme.palette.primary.main
                : "transparent",
              color: isCurrentPath("/dashboard/categories") ? "white" : "inherit",
              "&:hover": {
                bgcolor: isCurrentPath("/dashboard/categories")
                  ? theme.palette.primary.dark
                  : "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: isCurrentPath("/dashboard/categories") ? "inherit" : undefined,
                minWidth: 40,
              }}
            >
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText
              primary="Categories"
              primaryTypographyProps={{
                fontWeight: 600,
                letterSpacing: "2.14%",
              }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/dashboard/settings"
            sx={{
              letterSpacing: "2.14%",
              bgcolor: isCurrentPath("/dashboard/settings")
                ? theme.palette.primary.main
                : "transparent",
              color: isCurrentPath("/dashboard/settings") ? "white" : "inherit",
              "&:hover": {
                bgcolor: isCurrentPath("/dashboard/settings")
                  ? theme.palette.primary.dark
                  : "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: isCurrentPath("/dashboard/settings") ? "inherit" : undefined,
                minWidth: 40,
              }}
            >
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText
              primary="Settings"
              primaryTypographyProps={{
                fontWeight: 600,
                letterSpacing: "2.14%",
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          bgcolor: "white",
          color: "text.primary",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* Shopping Cart */}
            <ShoppingCart />
            
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                borderRadius: 1,
                p: 1,
                "&:hover": {
                  bgcolor: "rgba(0, 0, 0, 0.04)",
                },
              }}
              onClick={handleProfileMenuOpen}
            >
              <Avatar src="https://i.pravatar.cc/40" alt="User" />
              <Box sx={{ display: { xs: "none", md: "block" }, ml: 1 }}>
                <Typography variant="body2" fontWeight={600}>
                  Moni Roy
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Admin
                </Typography>
              </Box>
              <KeyboardArrowDownIcon
                fontSize="small"
                color="action"
                sx={{ ml: 0.5 }}
              />
            </Box>

            <Menu
              anchorEl={profileMenuAnchor}
              open={Boolean(profileMenuAnchor)}
              onClose={handleProfileMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem
                component={Link}
                to="/profile"
                onClick={handleProfileMenuClose}
              >
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem
                component={Link}
                to="/logout"
                onClick={handleProfileMenuClose}
              >
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
              zIndex: theme.zIndex.drawer,
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
              width: DRAWER_WIDTH,
              zIndex: theme.zIndex.drawer,
              borderRight: "1px solid",
              borderColor: theme.palette.divider,
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
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: 8,
        }}
      >
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
