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
import ChatBot from './ChatBot';
import Fab from '@mui/material/Fab';
import ChatIcon from '@mui/icons-material/Chat';

const defaultTheme = createTheme();

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [blogSections, setBlogSections] = useState([]); // Now we will fetch and set blog sections
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {

    // This section is fetching the blogSections and passing to the header component
    const fetchSections = async () => {
      try {
        const response = await fetch('http://localhost:9200/blogsections/_search', {
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
        const sections = result.hits.hits.map((hit) => ({
          title: hit._source.title,
          url: hit._source.url,
        }));

        setBlogSections(sections);
      } catch (error) {
        console.error('There was an error fetching the sections:', error);
      }
    };

    // Fetching the posts
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

    fetchSections();
    fetchPosts();
  }, []);

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
        <Footer title="Footer" description="Something here to give the footer a purpose!" />
      </Container>
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
