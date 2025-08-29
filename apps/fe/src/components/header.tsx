import {AppBar, Box, Button, Toolbar, Typography} from "@mui/material";

function Header() {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4DCCA6' }}>
          TEI Explorer
        </Typography>
        <Box>
          {['About', 'Features', 'Docs', 'Contact'].map((label) => (
            <Button key={label} color="inherit">
              {label}
            </Button>
          ))}
          <Button variant="outlined" sx={{ ml: 2 }}>
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
export default Header
