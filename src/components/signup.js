import React, { useState } from "react";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Header from "./Header";

const SignUp = () => {
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student", // Assign 'student' role by default
    is_activated: true, // Default is_activated field to true
  });
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const usernameExists = users.some(
      (user) => user.username === userDetails.username
    );
    const emailExists = users.some((user) => user.email === userDetails.email);

    if (usernameExists) {
      setFeedback({ type: "error", message: "Username already exists." });
      return;
    }

    if (emailExists) {
      setFeedback({ type: "error", message: "Email already exists." });
      return;
    }

    if (userDetails.password !== userDetails.confirmPassword) {
      setFeedback({ type: "error", message: "Passwords do not match!" });
      return;
    }

    users.push({
      ...userDetails,
      password: userDetails.password,
    });

    localStorage.setItem("users", JSON.stringify(users));
    setFeedback({ type: "success", message: "Account created successfully!" });
    setUserDetails({
      username: "",
      email: "",
      password: "",
      role: "student",
      is_activated: true,
    });
  };

  // Define the sections for the Header
  const sections = [];

  return (
    <>
      <CssBaseline />
      <Container component="main">
        <Header sections={sections} title="Sign Up" />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {feedback.message && (
            <Alert severity={feedback.type} sx={{ width: "100%", mb: 2 }}>
              {feedback.message}
            </Alert>
          )}
          <Typography component="h1" variant="h5" sx={{ mt: 4 }}>
            Sign Up as a Student
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={userDetails.username}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={userDetails.email}
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
              autoComplete="new-password"
              value={userDetails.password}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={userDetails.confirmPassword}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default SignUp;
