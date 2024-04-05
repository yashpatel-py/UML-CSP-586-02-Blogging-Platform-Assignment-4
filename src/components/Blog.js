import React, { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from './Header';
import FeaturedPost from './FeaturedPost';
import Footer from './Footer';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import ChatBot from './ChatBot'; // Import the ChatBot component
import Fab from '@mui/material/Fab';
import ChatIcon from '@mui/icons-material/Chat'; // This is a chat bubble icon

const defaultTheme = createTheme();
export default function Blog() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const localBlogSections = localStorage.getItem('blogSections');
    if (!localBlogSections) {
      const blogSections = [
        { title: 'Academic Resources', url: '/academic-resources' },
        { title: 'Career Services', url: '/career-services' },
        { title: 'Campus', url: '/campus' },
        { title: 'Local Community Resources', url: '/local-community-resources' },
        { title: 'Social', url: '/social' },
        { title: 'Sports', url: '/sports' },
        { title: 'Health and Wellness', url: '/health' },
        { title: 'Technology', url: '/technology' },
        { title: 'Travel', url: '/travel' },
        { title: 'Alumni', url: '/alumni' },
      ];
      localStorage.setItem('blogSections', JSON.stringify(blogSections));
    }

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:9200/blogposts/_search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: {
              match_all: {},
            },
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const hits = result.hits.hits.map((hit) => ({
          id: hit._id,
          ...hit._source,
        }));

        setBlogPosts(hits);
      } catch (error) {
        console.error('There was an error fetching the posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Retrieve the blog sections from localStorage
  const blogSections = JSON.parse(localStorage.getItem('blogSections'));
  console.log(blogSections);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header title="Blog Platform" sections={blogSections} />
        <main>
          {loading ? (
            <Grid container justifyContent="center" alignItems="center" style={{ height: '80vh' }}>
              <CircularProgress />
            </Grid>
          ) : blogPosts.length > 0 ? (
            <Grid container spacing={4}>
              {blogPosts.map((post) => (
                <FeaturedPost key={post.id} post={post} />
              ))}
            </Grid>
          ) : (
            <Typography variant="h6" align="center" marginTop={2}>
              No blogs to show.
            </Typography>
          )}
        </main>

        {showChat && <ChatBot onClose={() => setShowChat(false)} />}
        {/* Rest of your content */}
        <Footer title="Footer" description="Something here to give the footer a purpose!" />
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
}
