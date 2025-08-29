import {AppBar, Box, Button, Card, CardContent, Container, Toolbar, Typography,} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { useLogout } from '../auth/useLogout';
import { Dashboard as DashboardIcon, LogoutOutlined } from '@mui/icons-material';

// —— Data for the “feature” cards ——
const features = [
  {
    title: 'TEI XML Viewer',
    icon: <MenuBookIcon sx={{ fontSize: 40, color: '#4DCCA6' }} />,
    description: 'Visualize and navigate TEI-encoded texts in a friendly UI.',
  },
  {
    title: 'Search & Filter',
    icon: <SearchIcon sx={{ fontSize: 40, color: '#4DCCA6' }} />,
    description: 'Quickly locate specific elements across your corpus.',
  },
  {
    title: 'Annotation Editor',
    icon: <EditIcon sx={{ fontSize: 40, color: '#4DCCA6' }} />,
    description: 'Create, edit, and export custom TEI annotations.',
  },
];

function Header() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { logout } = useLogout();
  
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4DCCA6' }}>
          FocusApp
        </Typography>
        <Box>
          {['About', 'Features', 'Docs', 'Contact'].map((label) => (
            <Button key={label} color="inherit">
              {label}
            </Button>
          ))}
          {isAuthenticated ? (
            <>
              <Button 
                variant="contained" 
                sx={{ ml: 2 }}
                startIcon={<DashboardIcon />}
                onClick={() => navigate('/')}
              >
                Home
              </Button>
              <Button 
                variant="outlined" 
                sx={{ ml: 1 }}
                startIcon={<LogoutOutlined />}
                onClick={logout}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button 
              variant="outlined" 
              sx={{ ml: 2 }}
              onClick={() => navigate('/auth/signin')}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

function Hero() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', minHeight: '80vh' }}>
      {/* Background shapes */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: '-10%',
          width: '70%',
          height: '120%',
          bgcolor: '#FFFBEA',
          borderRadius: '50% 50% 0 0',
          transform: 'rotate(-10deg)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: '-5%',
          width: '50%',
          height: '60%',
          bgcolor: '#4DCCA6',
          borderRadius: '0 0 50% 50%',
        }}
      />

      <Container
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          py: 8,
        }}
      >
        {/* Left text column */}
        <Box sx={{ flex: 1, pr: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Unlock Insights from Your Texts
          </Typography>
          <Typography variant="h6" gutterBottom>
            Explore and annotate your documents with the power of TEI.
          </Typography>
          <Typography variant="body1" paragraph>
            FocusApp gives you an interactive interface to view, search, and edit
            TEI-encoded manuscripts. Structure your analysis, customize annotations,
            and export your work in one place.
          </Typography>
          {isAuthenticated ? (
            <Button 
              variant="contained" 
              size="large"
              startIcon={<DashboardIcon />}
              onClick={() => navigate('/')}
            >
              Go to Home
            </Button>
          ) : (
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/auth/signup')}
            >
              Get Started
            </Button>
          )}
        </Box>

        {/* Right feature cards */}
        <Box sx={{ flex: 1, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {features.map((f) => (
            <Card key={f.title} sx={{ boxShadow: 3, flex: '1 1 300px', minWidth: '250px' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                {f.icon}
                <Typography variant="h6" gutterBottom>
                  {f.title}
                </Typography>
                <Typography variant="body2">{f.description}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

function Footer() {
  return (
    <Box sx={{ py: 4, textAlign: 'center' }}>
      <Typography variant="caption" display="block" gutterBottom>
        As featured in
      </Typography>
      {/* Replace these with real TEI-consortium or partner logos */}
      <Box
        component="img"
        src="/logos/tei-consortium.svg"
        alt="TEI Consortium"
        sx={{ mx: 2, height: 32 }}
      />
      <Box
        component="img"
        src="/logos/dh-logo.svg"
        alt="Digital Humanities"
        sx={{ mx: 2, height: 32 }}
      />
      <Box
        component="img"
        src="/logos/library-logo.svg"
        alt="Scholarly Libraries"
        sx={{ mx: 2, height: 32 }}
      />
    </Box>
  );
}

export default function Welcome() {
  return (
    <>
      <Header />
      <Hero />
      <Footer />
    </>
  );
}
