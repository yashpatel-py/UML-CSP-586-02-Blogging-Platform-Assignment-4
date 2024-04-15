import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function FeaturedPost(props) {
  const { post } = props;
  console.log(post);
  const navigate = useNavigate();

  const handleReadMoreClick = (e) => {
    e.preventDefault();
    navigate(`/read-post/${post.id}`);
    console.log(post.id);
  };

  // Format the date and time
  const date = new Date(post.createdAt);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Grid item xs={12} md={6}>
      <Card
        sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}
      >
        <CardContent sx={{ flex: 1 }}>
          <Typography component="h2" variant="h5">
            {post.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {formattedDate} at {formattedTime}
          </Typography>
          <Typography
            variant="subtitle1"
            paragraph
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {post.content}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleReadMoreClick}
            endIcon={<ArrowForwardIcon />} // Add the icon to the button
            sx={{ mt: 2 }}
          >
            Read Post
          </Button>
        </CardContent>
        {post.imageUrl && (
          <CardMedia
            component="img"
            sx={{ width: 160, display: { xs: "none", sm: "block" } }}
            image={post.imageUrl || "default-image-url.jpg"} // Fallback to a default image if `post.imageUrl` is not available
            alt={post.title || "Post Image"} // Fallback alt text
          />
        )}
      </Card>
    </Grid>
  );
}

FeaturedPost.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default FeaturedPost;
