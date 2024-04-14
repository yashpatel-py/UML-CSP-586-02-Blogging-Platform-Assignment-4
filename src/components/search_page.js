import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Box, TextField, CircularProgress, Typography, Container, Grid } from '@mui/material';
import FeaturedPost from './FeaturedPost';
import Header from './Header';
import _ from 'lodash';

function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // useCallback to memoize the search function so it doesn't get recreated on every render
    const search = useCallback(async (searchQuery) => {
        setIsLoading(true);
        setError('');

        // Trim the query and check its length to determine the search type
        const trimmedQuery = searchQuery.trim();
        const queryType = trimmedQuery.length === 1
            ? {
                prefix: {
                    title: trimmedQuery.toLowerCase()
                }
            }
            : {
                multi_match: {
                    query: trimmedQuery,
                    fields: ["title"],
                    type: "cross_fields",
                    operator: "and"
                }
            };

        try {
            const response = await axios.post('http://localhost:9200/blogposts/_search', {
                query: queryType
            });

            setResults(response.data.hits.hits.map(hit => ({ ...hit._source, id: hit._id })));
        } catch (error) {
            console.error('Failed to search posts:', error);
            setError('Failed to search posts. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, []); // Dependencies are empty since `setIsLoading`, `setError`, and `setResults` are stable

    // Debounce the search function using useCallback and include `search` as a dependency
    const debouncedSearch = useCallback(_.debounce((query) => {
        search(query);
    }, 300), [search]);

    // useEffect for handling the search functionality
    useEffect(() => {
        if (query) {
            debouncedSearch(query);
        } else {
            setResults([]);
            setIsLoading(false);
        }

        // Cleanup function to cancel the debounce when the component unmounts or query changes
        return () => {
            debouncedSearch.cancel();
        };
    }, [query, debouncedSearch]); // `query` and `debouncedSearch` are dependencies

    // Parse blog sections from localStorage
    const blogSections = JSON.parse(localStorage.getItem('blogSections') || '[]');

    // Render the component
    return (
        <Container>
            <Header title="Blog Search" sections={blogSections} />
            <Box sx={{ my: 4 }}>
                {/* <Typography variant="h4" gutterBottom align="center">
                    Blog Search
                </Typography> */}
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
