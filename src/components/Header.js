import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

function Header(props) {
  const { sections, title } = props;
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("loggedInUser");
    setUser(null);
    setAnchorEl(null); // Close the menu
    // Additional sign-out actions such as redirecting to the home page
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Toolbar sx={{ borderBottom: 1, borderColor: "divider" }}>
        <RouterLink to="/subscribe-page" style={{ textDecoration: "none" }}>
          <Button size="small">Subscribe</Button>
        </RouterLink>
        <Typography
          component={RouterLink}
          to="/"
          variant="h5"
          color="inherit"
          align="center"
          noWrap
          sx={{ flex: 1 }}
        >
          {title}
        </Typography>
        <IconButton
          component={RouterLink}
          to="/search-page"
          color="inherit"
        >
          <SearchIcon />
        </IconButton>
        {user ? (
          <>
            <Button
              sx={{ margin: "0 5px" }}
              onClick={handleMenu}
              color="inherit"
            >
              {user.username}
            </Button>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem
                onClick={handleClose}
                component={RouterLink}
                to="/create-post"
              >
                Create Blog Post
              </MenuItem>
              {user.role === "admin" && ( // Render if user is admin
                <MenuItem
                  onClick={handleClose}
                  component={RouterLink}
                  to="/manage-users"
                >
                  Manage All Users
                </MenuItem>
              )}
              {user.role === "moderator" && (
                <MenuItem
                  onClick={handleClose}
                  component={RouterLink}
                  to="/manage-posts"
                >
                  Manage All Posts
                </MenuItem>
              )}
              <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <RouterLink to="/login" style={{ textDecoration: "none" }}>
              <Button variant="outlined" size="small" sx={{ margin: "0 5px" }}>
                Login
              </Button>
            </RouterLink>
            <RouterLink to="/signup" style={{ textDecoration: "none" }}>
              <Button variant="outlined" size="small">
                Sign up
              </Button>
            </RouterLink>
          </>
        )}
      </Toolbar>
      <Toolbar
        component="nav"
        variant="dense"
        sx={{ justifyContent: "space-between", overflowX: "auto" }}
      >
        {sections.map((section) => (
          <Link
            component={RouterLink}
            to={section.url}
            color="inherit"
            noWrap
            key={section.title}
            variant="body2"
            sx={{ p: 1, flexShrink: 0 }}
          >
            {section.title}
          </Link>
        ))}
      </Toolbar>
    </React.Fragment>
  );
}

Header.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ).isRequired,
  title: PropTypes.string.isRequired,
};

export default Header;
