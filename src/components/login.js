import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Header from "./Header";
import LoginIcon from '@mui/icons-material/Login';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loginStatus, setLoginStatus] = useState("");
  const navigate = useNavigate(); // Initialize the navigation function

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (user) =>
        user.username === credentials.username &&
        user.password === credentials.password
    );

    if (user && user.is_activated) {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      setLoginStatus("success");
      navigate("/"); // Navigate to the home page on successful login
    } else if (user && !user.is_activated) {
      setLoginStatus("blocked");
    } else {
      setLoginStatus("error");
    }
  };

  const sections = [];

  return (
    <>
      <CssBaseline />
      <Container component="main" maxWidth="lg">
        <Header sections={sections} title="Login" />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: { xs: 2, sm: 3 }, // Add responsive padding
          }}
        >
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 0 }}>
            {loginStatus === "error" && (
              <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
                Login failed: Incorrect username or password.
              </Alert>
            )}
            {loginStatus === "blocked" && (
              <Alert severity="warning" sx={{ width: "100%", mt: 2 }}>
                Your account is blocked. Please contact support.
              </Alert>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={credentials.username}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={credentials.password}
              onChange={handleChange}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              startIcon={<LoginIcon />}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Login;
