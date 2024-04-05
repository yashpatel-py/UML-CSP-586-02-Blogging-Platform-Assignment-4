// Import necessary modules/components
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
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "./Header";
import { styled } from "@mui/material/styles";
// import Alert from "@mui/material/Alert";
import axios from "axios";
import Snackbar from '@mui/material/Snackbar';
import ChatIcon from '@mui/icons-material/Chat'; // This is a chat bubble icon
import Fab from '@mui/material/Fab';
import ChatBot from './ChatBot'; // Import the ChatBot component
import CardMedia from '@mui/material/CardMedia';

// Create a default MUI theme
const defaultTheme = createTheme();

// Styled components for customizing Card styles
const CommentCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "&:last-child": {
    marginBottom: 0,
  },
}));

const ReplyCard = styled(Card)(({ theme }) => ({
  marginLeft: theme.spacing(4),
  marginTop: theme.spacing(1),
  background: theme.palette.grey[100],
}));

// Main component for reading a post
const ReadPost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showReplyField, setShowReplyField] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const sections = [];
  const [suggestion] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showChat, setShowChat] = useState(false);

  const fetchCommentSuggestion = async (blogTitle, blogCategory) => {
    try {
      const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;

      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Suggest a comment for the blog post titled "${blogTitle}" in the category "${blogCategory}":`
          }
        ]
      }, {
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.choices && response.data.choices.length > 0) {
        const suggestion = response.data.choices[0].message.content;
        setNewComment(suggestion); // Directly set the newComment to the suggestion
        setSnackbarMessage('Suggestion fetched successfully');
        setOpenSnackbar(true);
      } else {
        setSnackbarMessage('Failed to get suggestion');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Error fetching comment suggestion from OpenAI:', error);
      setSnackbarMessage('Failed to get suggestion');
      setOpenSnackbar(true);
    }
  };


  // Function to close snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  // Effect hook to fetch post and comments data
  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const response = await axios.get(`http://localhost:9200/blogposts/_doc/${postId}`);
        if (response.data.found) {
          setPost(response.data._source);
        } else {
          console.log('Post not found');
          setPost(null);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
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

  // Handle reply submission
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

    setComments(comments.map(comment =>
      comment.id === commentId
        ? { ...comment, replies: [...comment.replies, replyObject] }
        : comment
    ));

    const storedComments = JSON.parse(localStorage.getItem("comments")) || {};
    const postComments = storedComments[postId] || [];
    const commentIndex = postComments.findIndex(comment => comment.id === commentId);
    if (commentIndex !== -1) {
      postComments[commentIndex].replies = [...postComments[commentIndex].replies, replyObject];
    }
    storedComments[postId] = postComments;
    localStorage.setItem("comments", JSON.stringify(storedComments));

    setReplyContent("");
    setShowReplyField(null);
  };

  // Function to submit a new comment
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

    setComments(prevComments => [...prevComments, comment]);
    const allComments = JSON.parse(localStorage.getItem("comments")) || {};
    allComments[postId] = [...(allComments[postId] || []), comment];
    localStorage.setItem("comments", JSON.stringify(allComments));

    setNewComment("");
  };

  // Render UI
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container>
        {/* Header */}
        <Header sections={sections} title="Blog Platform" />

        {/* Post Details */}
        <Typography variant="h3" gutterBottom>
          {post && post.title}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Author: {post && post.author}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Category: {post && post.category}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Created At: {post && post.createdAt}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Content: {post && post.content}
        </Typography>
        {post && post.imageUrl && (
  <CardMedia
    component="img"
    image={post.imageUrl}
    alt={post.title}
    sx={{ width: '100%', height: 'auto' }}
  />
)}

        {/* Comments Section */}
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          Comments
        </Typography>
        {comments.map((comment) => (
          <CommentCard key={comment.id}>
            {/* Comment Content */}
            <CardContent>
              <Typography variant="subtitle2">{comment.author}</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {comment.content}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {new Date(comment.createdAt).toLocaleString()}
              </Typography>

              {/* Reply Button */}
              {loggedInUser && (
                <Button
                  size="small"
                  onClick={() => setShowReplyField(showReplyField === comment.id ? null : comment.id)}
                >
                  Reply
                </Button>
              )}

              {/* Reply Field */}
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
                  >
                    Submit Reply
                  </Button>
                </Box>
              )}

              {/* Replies */}
              {comment.replies && comment.replies.map((reply) => (
                <ReplyCard key={reply.id}>
                  <CardContent>
                    <Typography variant="subtitle2">{reply.author}</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {reply.content}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {new Date(reply.createdAt).toLocaleString()}
                    </Typography>
                  </CardContent>
                </ReplyCard>
              ))}
            </CardContent>
          </CommentCard>
        ))}

        {/* Comment Form */}
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
            <Button onClick={submitComment} variant="contained" sx={{ mt: 1 }}>
              Post Comment
            </Button>

            {/* Get Comment Suggestion Button */}
            <Button onClick={() => fetchCommentSuggestion(post.title, post.category)} variant="contained" color="primary" sx={{ mt: 1 }}>
              Get Comment Suggestion
            </Button>
            {suggestion && (
              <Typography variant="body1" gutterBottom>
                Suggested Comment: {suggestion}
              </Typography>
            )}

            {/* Snackbar for notifications */}
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
      <Fab color="primary" aria-label="chat" onClick={() => setShowChat(true)} style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
      }}>
        <ChatIcon />
      </Fab>
    </ThemeProvider>
  );
};

export default ReadPost;
