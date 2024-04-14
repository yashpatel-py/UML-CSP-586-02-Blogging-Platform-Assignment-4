import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, CircularProgress, Typography, Container, Grid } from '@mui/material';
import FeaturedPost from './FeaturedPost'; // Ensure this import path is correct
import Header from './Header';

function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        setIsLoading(true);
        setError('');
        setResults([]);

        if (!query.trim()) {
            setError('Please enter a search term.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:9200/blogposts/_search', {
                query: {
                    match: {
                        title: query
                    }
                }
            });

            setResults(response.data.hits.hits.map(hit => ({ ...hit._source, id: hit._id })));
        } catch (error) {
            console.error('Failed to search posts:', error);
            setError('Failed to search posts. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Retrieve the blog sections from localStorage
    const blogSections = JSON.parse(localStorage.getItem('blogSections') || '[]');

    return (
        <Container>
            <Header title="Blog Platform" sections={blogSections} />
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" gutterBottom align="center">
                    Blog Search
                </Typography>
                <Box display="flex" justifyContent="center" alignItems="center" my={2}>
                    <TextField
                        fullWidth
                        label="Search blog posts by title"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        margin="normal"
                        variant="outlined"
                        sx={{ flex: 1, mr: 1 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSearch}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} /> : 'Search'}
                    </Button>
                </Box>
                {error && <Typography color="error" align="center">{error}</Typography>}
                {isLoading ? (
                    <Box display="flex" justifyContent="center"><CircularProgress /></Box>
                ) : (
                    <Grid container spacing={4} justifyContent="center">
                        {results.length > 0 ? (
                            results.map((post) => (
                                // Ensure that post.id is unique
                                <FeaturedPost key={post.id} post={post} />
                            ))
                        ) : (
                            !isLoading && query && (
                                <Typography mt={4} align="center">
                                    No results found for "{query}".
                                </Typography>
                            )
                        )}
                    </Grid>
                )}
            </Box>
        </Container>
    );
}

export default SearchPage;
