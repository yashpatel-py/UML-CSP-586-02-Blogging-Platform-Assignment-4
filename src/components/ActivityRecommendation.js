import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    TextField,
    Button,
    Typography,
    CircularProgress,
    Container,
    CssBaseline,
    InputAdornment,
    Alert
} from '@mui/material';
import Header from "./Header";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WeatherIcon from '@mui/icons-material/WbSunny';
import SearchIcon from '@mui/icons-material/Search';

// Use your own proxy or a service like CORS Anywhere in a development environment
const corsProxy = 'https://cors-anywhere.herokuapp.com/';
const serpApiKey = process.env.REACT_APP_SERP_API_KEY;

const ActivityRecommendation = () => {
    const [userInput, setUserInput] = useState('');
    const [recommendation, setRecommendation] = useState('');
    const [weather, setWeather] = useState(null);
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchLocation();
    }, []);

    const fetchLocation = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://ipapi.co/json/');
            setLocation(response.data);
            fetchWeather(response.data.latitude, response.data.longitude);
        } catch (error) {
            console.error('Error fetching location:', error);
            setError('Error fetching location');
            setLoading(false);
        }
    };

    const fetchWeather = async (latitude, longitude) => {
        try {
            const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
            setWeather(response.data.current_weather);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching weather:', error);
            setError('Error fetching weather');
            setLoading(false);
        }
    };

    const fetchOpenAIResponse = async () => {
        if (!userInput.trim()) {
            alert('Please enter your query for a recommendation.');
            return '';
        }
        setLoading(true);
        try {
            const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: 'I am an AI designed to recommend activities based on weather conditions, current events, and user location.',
                        },
                        {
                            role: 'user',
                            content: userInput,
                        },
                    ],
                },
                {
                    headers: {
                        Authorization: `Bearer ${openaiApiKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('Error fetching response from OpenAI:', error);
            setError('There was an error communicating with the chat service.');
            return '';
        }
    };

    const fetchSERPData = async () => {
        try {
            const serpResponse = await axios.get(`${corsProxy}https://serpapi.com/search.json`, {
                params: {
                    q: userInput,
                    location: `${location.city}, ${location.country_name}`,
                    hl: 'en',
                    gl: 'us',
                    google_domain: 'google.com',
                    api_key: serpApiKey,
                    engine: 'google',
                },
            });
            return serpResponse.data;
        } catch (error) {
            console.error('Error fetching SERP data:', error);
            setError('Error fetching SERP data');
            return null;
        }
    };

    const handleUserInputChange = (event) => {
        setUserInput(event.target.value);
    };

    const handleGetRecommendation = async () => {
        setError('');
        if (!userInput.trim()) {
            alert('Please enter your query for a recommendation.');
            return;
        }
        setLoading(true);

        const openAiRecommendation = await fetchOpenAIResponse();
        if (!openAiRecommendation) {
            setLoading(false);
            return;
        }

        const serpData = await fetchSERPData();
        if (!serpData) {
            setLoading(false);
            return;
        }

        const combinedRecommendation = `${openAiRecommendation} Also, consider checking out these links: ` +
            serpData.organic_results.map(result => result.link).join(', ');

        setRecommendation(combinedRecommendation);
        setLoading(false);
    };

    const extractLinks = (text) => {
        const linkRegex = /(http(s)?:\/\/[^\s]+)/g;
        return text.match(linkRegex) || [];
    };

    const renderLinks = (links) => {
        return (
            <ul>
                {links.map((link, index) => (
                    <li key={index}>
                        <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                    </li>
                ))}
            </ul>
        );
    };

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

    return (
        <>
            <CssBaseline />
            <Container component="main" maxWidth="lg">
                <Header sections={blogSections} title="Activity Recommendation" />
                <Box sx={{ my: 4, display: 'flex', flexDirection: 'column'}}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Activity Recommendation
                    </Typography>
                    <TextField
                        fullWidth
                        label="Ask for activity suggestions"
                        value={userInput}
                        onChange={handleUserInputChange}
                        margin="normal"
                        variant="outlined"
                        disabled={loading}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {weather && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                            <WeatherIcon sx={{ color: 'action.active', mr: 1 }} />
                            <Typography>
                                Current weather: {weather.temperature}°C, {weather.weather_code}
                            </Typography>
                        </Box>
                    )}
                    {location && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <LocationOnIcon sx={{ color: 'action.active', mr: 1 }} />
                            <Typography>
                                Your location: {location.city}, {location.country_name}
                            </Typography>
                        </Box>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleGetRecommendation}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={24} /> : null}
                        sx={{ mt: 2, mb: 2 }}
                    >
                        Get Recommendation
                    </Button>
                    <Typography sx={{ mt: 2 }}>Recommendation: {recommendation}</Typography>
                    {recommendation && renderLinks(extractLinks(recommendation))}
                </Box>
            </Container>
        </>
    );
};

export default ActivityRecommendation;
