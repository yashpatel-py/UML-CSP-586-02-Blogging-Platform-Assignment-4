import React, { useState, useEffect } from 'react';
import { Switch, FormControlLabel, Grid, Card, CardContent, Typography, Snackbar, Alert } from '@mui/material';
import Header from './Header';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Footer from './Footer';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();

const SubscribePage = () => {
    const navigate = useNavigate();
    const [sections, setSections] = useState([]);
    const [userSubscriptions, setUserSubscriptions] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!user) {
            // Redirect to login page or display a message
            navigate('/login'); // Assuming you have a route set up for login
            return;
        }
        setLoggedInUser(user);

        // Load categories from local storage
        const storedSections = JSON.parse(localStorage.getItem('blogSections')) || [];
        setSections(storedSections);

        // Load user subscriptions from local storage
        const storedSubscriptions = JSON.parse(localStorage.getItem('subscribed_category')) || {};
        setUserSubscriptions(storedSubscriptions[user.username] || {});
    }, [navigate]);

    const handleSubscriptionChange = (title) => {
        if (!loggedInUser) {
            // Show an error or redirect to login
            setSnackbar({
                open: true,
                message: 'You must be logged in to subscribe or unsubscribe.',
                severity: 'error'
            });
            return;
        }

        const updatedSubscriptions = {
            ...userSubscriptions,
            [title]: !userSubscriptions[title]
        };
        setUserSubscriptions(updatedSubscriptions);

        let storedSubscriptions = JSON.parse(localStorage.getItem('subscribed_category')) || {};
        storedSubscriptions[loggedInUser.username] = updatedSubscriptions;
        localStorage.setItem('subscribed_category', JSON.stringify(storedSubscriptions));

        setSnackbar({
            open: true,
            message: `You have ${updatedSubscriptions[title] ? 'subscribed to' : 'unsubscribed from'} ${title}.`,
            severity: updatedSubscriptions[title] ? 'success' : 'error'
        });
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <CssBaseline />
            <Container maxWidth="lg">
                <Header title="Blog Platform" sections={sections} />
                <main>
                    <Grid container spacing={2}>
                        {sections.map((section) => (
                            <Grid item xs={12} sm={6} md={4} key={section.title}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>{section.title}</Typography>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={!!userSubscriptions[section.title]}
                                                    onChange={() => handleSubscriptionChange(section.title)}
                                                    name={section.title}
                                                    color="primary"
                                                    disabled={!loggedInUser} // Disable if no user is logged in
                                                />
                                            }
                                            label={userSubscriptions[section.title] ? 'Subscribed' : 'Subscribe'}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </main>
                <Footer title="Footer" description="Something here to give the footer a purpose!" />
            </Container>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </ThemeProvider>
    );
};

export default SubscribePage;
