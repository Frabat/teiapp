import React, { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  IconButton,
  Tooltip as MuiTooltip,
} from '@mui/material';
import {
  Fullscreen,
  FullscreenExit,
  ZoomIn,
  ZoomOut,
  Refresh,
} from '@mui/icons-material';
import type { ParsedTEIDocument } from '../utils/teiParser';
import { groupSegmentsByNumber } from '../utils/teiParser';
import TEIColumn from './TEIColumn';

interface TEIViewerProps {
  parsedDocument: ParsedTEIDocument;
  isLoading?: boolean;
  error?: string | null;
}

const TEIViewer: React.FC<TEIViewerProps> = ({
  parsedDocument,
  isLoading = false,
  error = null,
}) => {
  const [highlightedSegmentId, setHighlightedSegmentId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Group segments by their numeric identifier for alignment
  const groupedSegments = useMemo(() => {
    return groupSegmentsByNumber(parsedDocument.sections);
  }, [parsedDocument.sections]);

  // Get all unique segment numbers for consistent ordering
  const segmentNumbers = useMemo(() => {
    const numbers = Array.from(groupedSegments.keys()).sort((a, b) => {
      const [aBook, aLine] = a.split('.').map(Number);
      const [bBook, bLine] = b.split('.').map(Number);
      
      if (aBook !== bBook) return aBook - bBook;
      return aLine - bLine;
    });
    return numbers;
  }, [groupedSegments]);

  const handleSegmentClick = (segmentId: string) => {
    setHighlightedSegmentId(segmentId);
    
    // Auto-clear highlight after 3 seconds
    setTimeout(() => {
      setHighlightedSegmentId(null);
    }, 3000);
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!parsedDocument.sections.length) {
    return (
      <Alert severity="warning" sx={{ m: 2 }}>
        No text sections found in the document.
      </Alert>
    );
  }

  return (
    <Box
      sx={{
        height: isFullscreen ? '100vh' : 'auto',
        bgcolor: 'background.default',
        p: isFullscreen ? 0 : 2,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          mb: 2,
          bgcolor: 'background.paper',
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
              {parsedDocument.metadata.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              by {parsedDocument.metadata.author} • Edited by {parsedDocument.metadata.editor} • {parsedDocument.metadata.date}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={parsedDocument.metadata.language}
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
            
            <MuiTooltip title="Zoom In">
              <IconButton size="small" onClick={handleZoomIn}>
                <ZoomIn />
              </IconButton>
            </MuiTooltip>
            
            <MuiTooltip title="Zoom Out">
              <IconButton size="small" onClick={handleZoomOut}>
                <ZoomOut />
              </IconButton>
            </MuiTooltip>
            
            <MuiTooltip title="Reset Zoom">
              <IconButton size="small" onClick={handleResetZoom}>
                <Refresh />
              </IconButton>
            </MuiTooltip>
            
            <Divider orientation="vertical" flexItem />
            
            <MuiTooltip title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}>
              <IconButton size="small" onClick={handleFullscreenToggle}>
                {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
              </IconButton>
            </MuiTooltip>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {parsedDocument.sections.length} text sections • {segmentNumbers.length} segments
          </Typography>
          
          {highlightedSegmentId && (
            <Chip
              label={`Highlighted: ${highlightedSegmentId}`}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
      </Paper>

      {/* Main Content */}
      <Box
        sx={{
          height: isFullscreen ? 'calc(100vh - 120px)' : 'auto',
          overflow: 'auto',
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'top left',
          transition: 'transform 0.2s ease-in-out',
        }}
      >
        <Grid container spacing={3} sx={{ minHeight: '100%' }}>
          {parsedDocument.sections.map((section) => (
            <Grid
              key={section.id}
              size={{ xs: 12, lg: 12 / parsedDocument.sections.length }}
              sx={{ minHeight: '100%' }}
            >
              <TEIColumn
                section={section}
                segments={section.segments}
                onSegmentClick={handleSegmentClick}
                highlightedSegmentId={highlightedSegmentId || undefined}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Footer */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mt: 2,
          bgcolor: 'background.paper',
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            TEI XML Document Viewer • Zoom: {Math.round(zoomLevel * 100)}%
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Click on segments to highlight corresponding content across columns
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default TEIViewer;
