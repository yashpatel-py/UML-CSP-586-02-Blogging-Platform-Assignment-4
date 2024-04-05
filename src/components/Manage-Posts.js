import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Card,
  CardActions,
  CardContent,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "./Header";

const defaultTheme = createTheme();

const ManagePosts = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  const sections = [];

  useEffect(() => {
    if (!loggedInUser || loggedInUser.role !== "moderator") {
      navigate("/");
      return;
    }

    const storedPosts = JSON.parse(localStorage.getItem("blogPosts") || "[]");
    setPosts(storedPosts);
  }, [navigate, loggedInUser]);

  const handleDelete = (postId) => {
    const updatedPosts = posts.filter((post) => post.id !== postId);
    localStorage.setItem("blogPosts", JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
  };

  // Function to format date and time
  const formatDateTime = (datetime) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return new Date(datetime).toLocaleDateString("en-US", options);
  };

  if (!loggedInUser || loggedInUser.role !== "moderator") {
    return (
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <Container maxWidth="md">
          <Typography variant="h5" align="center" marginTop={8}>
            You are not allowed here.
          </Typography>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Header sections={sections} title="Sign Up" />
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom>
          Manage Posts
        </Typography>
        {posts.map((post) => (
          <Card key={post.id} variant="outlined" sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h5">{post.title}</Typography>
              {/* Use the formatDateTime function to display the date and time */}
              <Typography variant="body2">
                Created At: {formatDateTime(post.createdAt)}
              </Typography>
              <Typography variant="subtitle1">Author: {post.author}</Typography>
              <Typography variant="body1">{post.content}</Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                color="error"
                onClick={() => handleDelete(post.id)}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        ))}
      </Container>
    </ThemeProvider>
  );
};

export default ManagePosts;
