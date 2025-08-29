import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase.ts';
import { removeUser } from '../auth/authSlice.ts';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Avatar
} from '@mui/material';
import { LogoutOutlined, Person, Dashboard as DashboardIcon } from '@mui/icons-material';
import type { RootState } from '../store/store.ts';

const Dashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      dispatch(removeUser());
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <DashboardIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            FocusApp Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <Avatar sx={{ mr: 1, bgcolor: 'secondary.main' }}>
              <Person />
            </Avatar>
            <Typography variant="body2">
              {user.email}
            </Typography>
          </Box>
          <Button
            color="inherit"
            startIcon={<LogoutOutlined />}
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user.email?.split('@')[0]}!
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 3, mt: 2, flexWrap: 'wrap' }}>
          <Card sx={{ flex: '1 1 300px', minWidth: '250px' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{ mb: 1 }}
                onClick={() => navigate('/')}
              >
                Go to Home
              </Button>
              <Button
                variant="outlined"
                fullWidth
                sx={{ mb: 1 }}
                onClick={() => navigate('/dashboard/settings')}
              >
                Settings
              </Button>
            </CardContent>
          </Card>
          
          <Paper sx={{ p: 3, flex: '2 1 400px', minWidth: '300px' }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No recent activity to display.
            </Typography>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;
