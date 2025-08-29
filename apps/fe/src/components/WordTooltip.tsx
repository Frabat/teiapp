import React from 'react';
import {
  Tooltip,
  Chip,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import type { TEIWord } from '../utils/teiParser';

interface WordTooltipProps {
  word: TEIWord;
}

const WordTooltip: React.FC<WordTooltipProps> = ({ word }) => {
  const renderTooltipContent = () => (
    <Box sx={{ maxWidth: 300, p: 1 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
        {word.content}
      </Typography>
      
      {word.anchors.length > 0 && (
        <>
          <Divider sx={{ my: 1 }} />
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Critical Apparatus:
          </Typography>
          
          {word.anchors.map((anchor, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {anchor.id}:
              </Typography>
              <Typography variant="caption" sx={{ ml: 1 }}>
                {anchor.content || 'No content'}
              </Typography>
            </Box>
          ))}
        </>
      )}
      
      <Divider sx={{ my: 1 }} />
      <Typography variant="caption" color="text.secondary">
        Word ID: {word.id}
      </Typography>
    </Box>
  );

  return (
    <Tooltip
      title={renderTooltipContent()}
      arrow
      placement="top"
      enterDelay={500}
      leaveDelay={200}
      PopperProps={{
        sx: {
          '& .MuiTooltip-tooltip': {
            bgcolor: 'background.paper',
            color: 'text.primary',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: 3,
            fontSize: '0.75rem',
            maxWidth: 350,
          },
        },
      }}
    >
      <Chip
        label={word.content}
        size="small"
        variant="outlined"
        sx={{
          cursor: 'help',
          borderColor: 'primary.main',
          color: 'primary.main',
          fontWeight: 'bold',
          '&:hover': {
            bgcolor: 'primary.main',
            color: 'white',
          },
          transition: 'all 0.2s ease-in-out',
        }}
      />
    </Tooltip>
  );
};

export default WordTooltip;
