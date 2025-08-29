import React from 'react';
import {
  Box,
  IconButton,
  Typography,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  NavigateBefore,
  NavigateNext,
  FirstPage,
  LastPage,
} from '@mui/icons-material';

interface VerseNavigationProps {
  currentVerseIndex: number;
  totalVerses: number;
  onPrevious: () => void;
  onNext: () => void;
  onFirst: () => void;
  onLast: () => void;
  currentVerseNumber: string;
}

const VerseNavigation: React.FC<VerseNavigationProps> = ({
  currentVerseIndex,
  totalVerses,
  onPrevious,
  onNext,
  onFirst,
  onLast,
  currentVerseNumber,
}) => {
  const isFirst = currentVerseIndex === 0;
  const isLast = currentVerseIndex === totalVerses - 1;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        mb: 2,
      }}
    >
      {/* Left Side - Navigation Controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title="First Verse">
          <span>
            <IconButton
              onClick={onFirst}
              disabled={isFirst}
              size="small"
              sx={{
                color: isFirst ? 'text.disabled' : 'primary.main',
              }}
            >
              <FirstPage />
            </IconButton>
          </span>
        </Tooltip>
        
        <Tooltip title="Previous Verse">
          <span>
            <IconButton
              onClick={onPrevious}
              disabled={isFirst}
              size="small"
              sx={{
                color: isFirst ? 'text.disabled' : 'primary.main',
              }}
            >
              <NavigateBefore />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      {/* Center - Verse Information */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Verse {currentVerseNumber}
        </Typography>
        
        <Chip
          label={`${currentVerseIndex + 1} of ${totalVerses}`}
          size="small"
          color="primary"
          variant="outlined"
        />
      </Box>

      {/* Right Side - Navigation Controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title="Next Verse">
          <span>
            <IconButton
              onClick={onNext}
              disabled={isLast}
              size="small"
              sx={{
                color: isLast ? 'text.disabled' : 'primary.main',
              }}
            >
              <NavigateNext />
            </IconButton>
          </span>
        </Tooltip>
        
        <Tooltip title="Last Verse">
          <span>
            <IconButton
              onClick={onLast}
              disabled={isLast}
              size="small"
              sx={{
                color: isLast ? 'text.disabled' : 'primary.main',
              }}
            >
              <LastPage />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default VerseNavigation;
