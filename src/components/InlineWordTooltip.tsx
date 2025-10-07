import React from 'react';
import {
  Tooltip,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import type { TEIWord } from '../utils/teiParser.ts';

interface InlineWordTooltipProps {
  word: TEIWord;
  children: React.ReactNode;
}

const InlineWordTooltip: React.FC<InlineWordTooltipProps> = ({ word, children }) => {
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
      <Box
        component="span"
        sx={{
          cursor: 'help',
          fontWeight: 'bold',
          color: 'primary.main',
          textDecoration: 'underline',
          textDecorationColor: 'primary.main',
          textDecorationStyle: 'dotted',
          '&:hover': {
            backgroundColor: 'primary.main',
            color: 'white',
            textDecoration: 'none',
          },
          transition: 'all 0.2s ease-in-out',
          display: 'inline',
        }}
      >
        {children}
      </Box>
    </Tooltip>
  );
};

export default InlineWordTooltip;
