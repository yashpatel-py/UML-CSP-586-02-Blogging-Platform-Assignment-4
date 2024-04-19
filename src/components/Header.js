import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import LinkIcon from '@mui/icons-material/Link';

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
    setAnchorEl(null);
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
                <AddCircleOutlineIcon sx={{ mr: 1 }} /> Create Blog Post
              </MenuItem>
              <MenuItem
                onClick={handleClose}
                component={RouterLink}
                to="/acivity_recomend"
              >
                <LinkIcon sx={{ color: 'action.active', mr: 1 }} />
                Activity Recommendation
              </MenuItem>
              {user.role === "admin" && (
                <MenuItem
                  onClick={handleClose}
                  component={RouterLink}
                  to="/manage-users"
                >
                  <SupervisorAccountIcon sx={{ mr: 1 }} /> Manage All Users
                </MenuItem>
              )}
              {user.role === "moderator" && (
                <MenuItem
                  onClick={handleClose}
                  component={RouterLink}
                  to="/manage-posts"
                >
                  <EditIcon sx={{ mr: 1 }} /> Manage All Posts
                </MenuItem>
              )}
              <MenuItem onClick={handleSignOut}>
                <ExitToAppIcon sx={{ mr: 1 }} /> Sign Out
              </MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <RouterLink to="/login" style={{ textDecoration: "none" }}>
              <Button variant="outlined" size="small" sx={{ margin: "0 5px" }}>
                <LoginIcon sx={{ mr: 1 }} /> Login
              </Button>
            </RouterLink>
            <RouterLink to="/signup" style={{ textDecoration: "none" }}>
              <Button variant="outlined" size="small">
                <PersonAddAltIcon sx={{ mr: 1 }} /> Sign up
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
