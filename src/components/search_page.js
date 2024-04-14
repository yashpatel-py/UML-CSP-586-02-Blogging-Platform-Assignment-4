import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, CircularProgress, Typography, Container, Grid } from '@mui/material';
import FeaturedPost from './FeaturedPost';
import Header from './Header';
import _ from 'lodash'; // Ensure lodash is installed

function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const debouncedSearch = _.debounce(async (searchQuery) => {
            if (!searchQuery.trim()) {
                setResults([]);
                setError('');
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError('');

            try {
                const response = await axios.post('http://localhost:9200/blogposts/_search', {
                    query: {
                        match: {
                            title: searchQuery
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
        }, 300); // Debounce the search

        debouncedSearch(query);

        // Cleanup function to cancel the debounce on component unmount
        return () => {
            debouncedSearch.cancel();
        };
    }, [query]); // Only re-run the effect if query changes

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
                    {isLoading && <CircularProgress size={24} />}
                </Box>
                {error && <Typography color="error" align="center">{error}</Typography>}
                {isLoading ? (
                    <Box display="flex" justifyContent="center"><CircularProgress /></Box>
                ) : (
                    <Grid container spacing={4} justifyContent="center">
                        {results.length > 0 ? (
                            results.map((post) => (
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
