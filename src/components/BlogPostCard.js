import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

const BlogPostCard = ({ post }) => {
  const navigate = useNavigate();

  const handleReadMoreClick = () => {
    navigate(`/post/${post.id}`);
  };

  return (
    <Card sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
      <CardContent sx={{ flex: 1 }}>
        <Typography component="h2" variant="h5">
          {post.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {post.date}
        </Typography>
        <Typography variant="subtitle1" paragraph>
          {post.description}
        </Typography>
        <CardActions>
          <Button size="small" onClick={handleReadMoreClick}>
            Continue reading...
          </Button>
        </CardActions>
      </CardContent>
      <CardMedia
        component="img"
        sx={{ width: 160, display: { xs: 'none', sm: 'block' } }}
        image={post.image}
        alt={post.imageLabel}
      />
    </Card>
  );
};

export default BlogPostCard;
