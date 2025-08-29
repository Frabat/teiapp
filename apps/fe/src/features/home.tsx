import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {signOut} from 'firebase/auth';
import {auth} from '../firebase';
import {removeUser} from '../auth/authSlice';
import {
  Avatar, 
  Box, 
  Button, 
  Card, 
  Chip, 
  Grid, 
  IconButton, 
  LinearProgress, 
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  AccountCircle, 
  Business, 
  CloudUpload, 
  Group, 
  Notifications, 
  Person, 
  Settings,
  Logout,
  Email,
  Badge,
} from '@mui/icons-material';
import FileUploadModal from '../components/FileUploadModal';
import FileGrid from '../components/FileGrid';
import type {RootState} from '../store/store';

interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  createdAt: Date;
}

const Home: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const { files } = useSelector((state: RootState) => state.files);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [accountMenuAnchor, setAccountMenuAnchor] = useState<null | HTMLElement>(null);

  const handleUploadClick = () => {
    setUploadModalOpen(true);
  };

  const handleAccountMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAccountMenuAnchor(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAccountMenuAnchor(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(removeUser());
      navigate('/welcome', { replace: true });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    return null;
  }

  const totalFiles = files.length;
  const totalSize = files.reduce((acc: number, file: FileItem) => acc + (file.size || 0), 0);
  const recentFiles = files.slice(0, 3);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f5f4 0%, #e7e5e4 100%)',
      p: 3,
    }}>
      {/* Main Dashboard Container */}
      <Card sx={{ 
        maxWidth: 1400, 
        mx: 'auto',
        background: 'linear-gradient(135deg, #fefefe 0%, #fafaf9 100%)',
        borderRadius: 4,
        overflow: 'hidden',
      }}>
        {/* Header/Navigation Bar */}
        <Box sx={{ 
          p: 3, 
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <Button
            variant="contained"
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 'bold',
              fontSize: '1.1rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            FocusApp
          </Button>

          {/* Navigation */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {[
              { label: 'Dashboard', active: true },
              { label: 'Files', active: false },
              { label: 'Analytics', active: false },
              { label: 'Settings', active: false },
            ].map((item) => (
              <Button
                key={item.label}
                variant={item.active ? 'contained' : 'text'}
                sx={{
                  bgcolor: item.active ? 'primary.main' : 'transparent',
                  color: item.active ? 'white' : 'text.primary',
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  minWidth: 'auto',
                  '&:hover': {
                    bgcolor: item.active ? 'primary.dark' : 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Utility Icons */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton sx={{ color: 'text.primary' }}>
              <Settings />
            </IconButton>
            <IconButton sx={{ color: 'text.primary' }}>
              <Notifications />
            </IconButton>
            <IconButton 
              sx={{ color: 'text.primary' }}
              onClick={handleAccountMenuOpen}
            >
              <AccountCircle />
            </IconButton>
          </Box>
        </Box>

        {/* Account Menu */}
        <Menu
          anchorEl={accountMenuAnchor}
          open={Boolean(accountMenuAnchor)}
          onClose={handleAccountMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 280,
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {/* Account Header */}
          <Box sx={{ p: 3, textAlign: 'center', borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                mx: 'auto',
                mb: 2,
                bgcolor: 'primary.main',
                fontSize: '1.5rem',
              }}
            >
              {user.email?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              {user.email?.split('@')[0]}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>

          {/* Account Details */}
          <MenuItem sx={{ py: 2, px: 3 }}>
            <ListItemIcon>
              <Badge sx={{ color: 'primary.main' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Account Details" 
              secondary="View and edit your profile"
            />
          </MenuItem>

          <MenuItem sx={{ py: 2, px: 3 }}>
            <ListItemIcon>
              <Email sx={{ color: 'primary.main' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Email Settings" 
              secondary="Manage notifications and preferences"
            />
          </MenuItem>

          <Divider sx={{ my: 1 }} />

          {/* Logout Button */}
          <MenuItem 
            onClick={handleLogout}
            sx={{ 
              py: 2, 
              px: 3,
              color: 'error.main',
              '&:hover': {
                bgcolor: 'error.main',
                color: 'white',
              },
            }}
          >
            <ListItemIcon>
              <Logout sx={{ color: 'inherit' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Sign Out" 
              secondary="Log out of your account"
            />
          </MenuItem>
        </Menu>

        {/* Main Content */}
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Left Column */}
            <Grid size={{ xs: 12, lg: 8 }}>
              {/* Welcome Section */}
              <Card sx={{ mb: 3, p: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, color: 'text.primary' }}>
                  Welcome in, {user.email?.split('@')[0]}
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Files Uploaded
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min((totalFiles / 50) * 100, 100)} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: 'primary.main',
                        },
                      }} 
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      {totalFiles}/50 files
                    </Typography>
                  </Grid>
                  
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Storage Used
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min((totalSize / (100 * 1024 * 1024)) * 100, 100)} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: 'secondary.main',
                        },
                      }} 
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      {Math.round(totalSize / (1024 * 1024))} MB / 100 MB
                    </Typography>
                  </Grid>
                  
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Recent Activity
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={60} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: 'grey.400',
                          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.3) 4px, rgba(255,255,255,0.3) 8px)',
                        },
                      }} 
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      60% active
                    </Typography>
                  </Grid>
                  
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Performance
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={85} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: 'grey.300',
                        },
                      }} 
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      85% optimal
                    </Typography>
                  </Grid>
                </Grid>
              </Card>

              {/* Key Metrics */}
              <Card sx={{ mb: 3, p: 3, bgcolor: 'rgba(251, 191, 36, 0.1)' }}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Person sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        {totalFiles}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Files
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Group sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        {Math.round(totalSize / (1024 * 1024))}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        MB Used
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Business sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        {recentFiles.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Recent Files
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Card>

              {/* File Management Section */}
              <Card sx={{ mb: 3, p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    File Management
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<CloudUpload />}
                    onClick={handleUploadClick}
                    sx={{
                      bgcolor: 'secondary.main',
                      color: 'secondary.contrastText',
                      '&:hover': {
                        bgcolor: 'secondary.dark',
                      },
                    }}
                  >
                    Upload Files
                  </Button>
                </Box>
                
                <FileGrid userId={user.uid} />
              </Card>
            </Grid>

            {/* Right Column */}
            <Grid size={{ xs: 12, lg: 4 }}>
              {/* User Profile Card */}
              <Card sx={{ mb: 3, p: 3, textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    mb: 2,
                    bgcolor: 'primary.main',
                    fontSize: '2rem',
                  }}
                >
                  {user.email?.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {user.email?.split('@')[0]}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  File Manager
                </Typography>
                <Chip
                  label={`${totalFiles} files managed`}
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                />
              </Card>


            </Grid>
          </Grid>
        </Box>
      </Card>

      {/* File Upload Modal */}
      <FileUploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        userId={user.uid}
      />
    </Box>
  );
};

export default Home;
