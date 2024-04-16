import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  TextField,
  Box,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "./Header";
import { styled } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";
import ChatIcon from "@mui/icons-material/Chat";
import Fab from "@mui/material/Fab";
import ChatBot from "./ChatBot";
import CardMedia from "@mui/material/CardMedia";
import axios from "axios";
import SendIcon from "@mui/icons-material/Send";
import ReplyIcon from "@mui/icons-material/Reply";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LabelIcon from "@mui/icons-material/Label";

const defaultTheme = createTheme();

const CommentCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[100],
  boxShadow: theme.shadows[2],
}));

const ReplyCard = styled(Card)(({ theme }) => ({
  marginLeft: theme.spacing(4),
  marginTop: theme.spacing(1),
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.grey[200],
  boxShadow: theme.shadows[1],
}));

const ReadPost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showReplyField, setShowReplyField] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const sections = [];
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showChat, setShowChat] = useState(false);

  const fetchCommentSuggestion = async (blogTitle, blogCategory) => {
    try {
      const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `Suggest a comment for the blog post titled "${blogTitle}" in the category "${blogCategory}":`,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${openaiApiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.choices && response.data.choices.length > 0) {
        const suggestion = response.data.choices[0].message.content;
        setNewComment(suggestion); // Directly set the newComment to the suggestion
        setSnackbarMessage("Suggestion fetched successfully");
        setOpenSnackbar(true);
      } else {
        setSnackbarMessage("Failed to get suggestion");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error fetching comment suggestion from OpenAI:", error);
      setSnackbarMessage("Failed to get suggestion");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9200/blogposts/_doc/${postId}`
        );
        if (response.data.found) {
          setPost(response.data._source);
        } else {
          console.log("Post not found");
          setPost(null);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        setPost(null);
      }

      const storedComments = JSON.parse(localStorage.getItem("comments")) || {};
      const postComments = storedComments[postId] || [];
      setComments(postComments);
    };

    if (postId) {
      fetchPostAndComments();
    }
  }, [postId]);

  const handleReplySubmit = (commentId) => {
    if (!replyContent.trim()) {
      return;
    }
    const replyObject = {
      id: Date.now(),
      author: post.username,
      content: replyContent,
      createdAt: new Date().toISOString(),
    };

    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, replies: [...comment.replies, replyObject] }
          : comment
      )
    );

    const storedComments = JSON.parse(localStorage.getItem("comments")) || {};
    const postComments = storedComments[postId] || [];
    const commentIndex = postComments.findIndex(
      (comment) => comment.id === commentId
    );
    if (commentIndex !== -1) {
      postComments[commentIndex].replies = [
        ...postComments[commentIndex].replies,
        replyObject,
      ];
    }
    storedComments[postId] = postComments;
    localStorage.setItem("comments", JSON.stringify(storedComments));

    setReplyContent("");
    setShowReplyField(null);
  };

  const submitComment = () => {
    if (!newComment.trim()) {
      setSnackbarMessage("Comment cannot be blank.");
      setOpenSnackbar(true);
      return;
    }
    const comment = {
      id: Date.now(),
      author: loggedInUser.username,
      content: newComment,
      createdAt: new Date().toISOString(),
      replies: [],
    };

    setComments((prevComments) => [...prevComments, comment]);
    const allComments = JSON.parse(localStorage.getItem("comments")) || {};
    allComments[postId] = [...(allComments[postId] || []), comment];
    localStorage.setItem("comments", JSON.stringify(allComments));

    setNewComment("");
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header sections={sections} title="Blog Platform" />

        {post && (
          <Card raised sx={{ mb: 4 }}>
            {post.imageUrl && (
              <CardMedia
                component="img"
                image={post.imageUrl}
                alt={post.title}
                sx={{ maxHeight: 700, objectFit: "cover" }}
              />
            )}
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  my: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AccountCircleIcon color="action" />
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Author:{" "}
                    <span style={{ fontWeight: "normal" }}>{post.author}</span>
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LabelIcon color="action" />
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Category:{" "}
                    <span style={{ fontWeight: "normal" }}>
                      {post.category}
                    </span>
                  </Typography>
                  <CalendarTodayIcon color="action" />
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Created At:{" "}
                    <span style={{ fontWeight: "normal" }}>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </Typography>
                </Box>
              </Box>
              <Typography
                variant="h4"
                gutterBottom
                component="div"
                align="center"
              >
                {post.title}
              </Typography>
              <Typography variant="body1">{post.content}</Typography>
            </CardContent>
          </Card>
        )}

        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          Comments
        </Typography>

        {comments.map((comment, index) => (
          <Box key={comment.id}>
            <CommentCard>
              <CardContent>
                <Typography variant="subtitle2">{comment.author}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {comment.content}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {new Date(comment.createdAt).toLocaleString()}
                </Typography>

                {loggedInUser && (
                  <Button
                    size="small"
                    onClick={() =>
                      setShowReplyField(
                        showReplyField === comment.id ? null : comment.id
                      )
                    }
                    startIcon={<ReplyIcon />}
                  >
                    Reply
                  </Button>
                )}

                {showReplyField === comment.id && (
                  <Box mt={2}>
                    <TextField
                      label="Write a reply"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={2}
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      margin="normal"
                    />
                    <Button
                      onClick={() => handleReplySubmit(comment.id)}
                      variant="contained"
                      size="small"
                      sx={{ mt: 1 }}
                      startIcon={<ReplyIcon />}
                    >
                      Submit Reply
                    </Button>
                  </Box>
                )}

                {comment.replies &&
                  comment.replies.map((reply) => (
                    <ReplyCard key={reply.id}>
                      <CardContent>
                        <Typography variant="subtitle2">
                          {reply.author}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          {reply.content}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          {new Date(reply.createdAt).toLocaleString()}
                        </Typography>
                      </CardContent>
                    </ReplyCard>
                  ))}
              </CardContent>
            </CommentCard>
            {index < comments.length - 1 && <Divider sx={{ my: 2 }} />}
          </Box>
        ))}

        {loggedInUser && (
          <Box my={2}>
            <TextField
              label="Leave a comment"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              margin="normal"
            />
            <Button
              startIcon={<SendIcon />}
              onClick={submitComment}
              variant="contained"
              sx={{ mt: 1 }}
            >
              Post Comment
            </Button>
            <Button
              onClick={() => fetchCommentSuggestion(post.title, post.category)}
              variant="contained"
              color="primary"
              sx={{ ml: 1, mt: 1 }}
            >
              Get Comment Suggestion
            </Button>
            <Snackbar
              open={openSnackbar}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              message={snackbarMessage}

            />
          </Box>
        )}
      </Container>

      {showChat && <ChatBot onClose={() => setShowChat(false)} />}

      <Fab
        color="primary"
        aria-label="chat"
        onClick={() => setShowChat(true)}
        style={{ position: "fixed", bottom: "20px", right: "20px" }}
      >
        <ChatIcon />
      </Fab>
    </ThemeProvider>
  );
};

export default ReadPost;
