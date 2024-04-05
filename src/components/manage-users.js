import React, { useState, useEffect } from 'react';
import { Container, List, ListItem, ListItemText, Button, ListItemSecondaryAction } from '@mui/material';
import { CheckCircleOutline, HighlightOff } from '@mui/icons-material';
import Header from './Header';

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  const sections = [
    { title: 'Academic Resources', url: '/technology' },
    { title: 'Career Services', url: '/lifestyle' },
    { title: 'Campus', url: '/travel' },
    { title: 'Local Community Resources', url: '/food' },
    { title: 'Social, Sports', url: '/culture' },
    { title: 'Health and Wellness', url: '/health' },
    { title: 'Technology', url: '/tech' },
    { title: 'Travel', url: '/travel' },
    { title: 'Alumni', url: '/alumni' },
  ];

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    setUsers(storedUsers);
  }, []);

  const toggleActivation = (username) => {
    const updatedUsers = users.map((user) => {
      if (user.username === username) {
        return { ...user, is_activated: !user.is_activated };
      }
      return user;
    });

    // Update local storage and state
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };



  return (
    <Container>
      <Header sections={sections} title="Login" />
      <List>
        {users.map((user, index) => (
          <ListItem key={index} divider>
            <ListItemText primary={user.username} secondary={user.email} />
            <ListItemSecondaryAction>
              <Button
                variant="contained"
                color={user.is_activated ? 'secondary' : 'primary'}
                startIcon={user.is_activated ? <HighlightOff /> : <CheckCircleOutline />}
                onClick={() => toggleActivation(user.username)}
              >
                {user.is_activated ? 'Deactivate' : 'Activate'}
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default UserManagement;
