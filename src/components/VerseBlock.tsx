import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Chip,
  Divider,
} from '@mui/material';
import type { TEISegment } from '../utils/teiParser';
import WordTooltip from './WordTooltip';

interface VerseBlockProps {
  verseNumber: string;
  segments: TEISegment[];
  sectionTypes: string[];
  onSegmentClick?: (segmentId: string) => void;
  highlightedSegmentId?: string;
}

const VerseBlock: React.FC<VerseBlockProps> = ({
  verseNumber,
  segments,
  sectionTypes,
  onSegmentClick,
  highlightedSegmentId,
}) => {
  const getSectionTitle = (type: string, language: string) => {
    switch (type) {
      case 'source':
        return language === 'la' ? 'Latin Source' : 'Source Text';
      case 'translation':
        return language === 'it' ? 'Italian Translation' : 'Translation';
      case 'commentary':
        return language === 'it' ? 'Italian Commentary' : 'Commentary';
      default:
        return 'Text Section';
    }
  };

  const getSectionColor = (type: string) => {
    switch (type) {
      case 'source':
        return 'primary.main';
      case 'translation':
        return 'secondary.main';
      case 'commentary':
        return 'success.main';
      default:
        return 'grey.500';
    }
  };

  const renderSegmentContent = (segment: TEISegment) => {
    if (!segment.content) return null;

    // Split content by line breaks and render each line
    const lines = segment.content.split('\n');
    
    return (
      <Box>
        {lines.map((line, lineIndex) => (
          <Typography
            key={lineIndex}
            variant="body2"
            sx={{
              mb: lineIndex < lines.length - 1 ? 1 : 0,
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
            }}
          >
            {line}
          </Typography>
        ))}
      </Box>
    );
  };

  const renderWordsWithTooltips = (segment: TEISegment) => {
    if (segment.words.length === 0) return null;

    return (
      <Box sx={{ mt: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          Annotated words:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {segment.words.map((word) => (
            <WordTooltip key={word.id} word={word} />
          ))}
        </Box>
      </Box>
    );
  };

  const renderLineNumbers = (segment: TEISegment) => {
    if (segment.lineNumbers.length === 0) return null;

    return (
      <Box sx={{ mt: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
          Lines:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {segment.lineNumbers.map((lineNumber) => (
            <Chip
              key={lineNumber}
              label={lineNumber}
              size="small"
              variant="outlined"
              sx={{
                fontSize: '0.7rem',
                height: '20px',
                '& .MuiChip-label': {
                  px: 1,
                },
              }}
            />
          ))}
        </Box>
      </Box>
    );
  };

  // Separate commentary sections from other sections
  const commentarySegments: Array<{ segment: TEISegment; sectionType: string; language: string }> = [];
  const otherSegments: Array<{ segment: TEISegment; sectionType: string; language: string }> = [];

  segments.forEach((segment, index) => {
    const sectionType = sectionTypes[index] || 'unknown';
    const language = segment.id.includes('la') ? 'la' : 
                    segment.id.includes('it') ? 'it' : 'unknown';
    
    const segmentData = { segment, sectionType, language };
    
    if (sectionType === 'commentary') {
      commentarySegments.push(segmentData);
    } else {
      otherSegments.push(segmentData);
    }
  });

  const renderSegmentPaper = (segmentData: { segment: TEISegment; sectionType: string; language: string }) => {
    const { segment, sectionType, language } = segmentData;
    
    return (
      <Paper
        elevation={1}
        sx={{
          p: 2,
          height: '100%',
          cursor: onSegmentClick ? 'pointer' : 'default',
          border: highlightedSegmentId === segment.id ? `2px solid ${getSectionColor(sectionType)}` : '1px solid',
          borderColor: highlightedSegmentId === segment.id ? getSectionColor(sectionType) : 'divider',
          bgcolor: highlightedSegmentId === segment.id ? 'action.hover' : 'background.paper',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: 2,
            transform: 'translateY(-1px)',
          },
        }}
        onClick={() => onSegmentClick?.(segment.id)}
      >
        {/* Section Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 'bold',
              color: getSectionColor(sectionType),
            }}
          >
            {getSectionTitle(sectionType, language)}
          </Typography>
          {language !== 'unknown' && <Chip
            label={language.toUpperCase()}
            size="small"
            sx={{
              bgcolor: getSectionColor(sectionType),
              color: 'white',
              fontWeight: 'bold',
            }}
          />}
        </Box>

        <Divider sx={{ mb: 1.5 }} />

        {/* Segment Content */}
        {renderSegmentContent(segment)}

        {/* Annotated Words */}
        {renderWordsWithTooltips(segment)}

        {/* Line Numbers */}
        {renderLineNumbers(segment)}
      </Paper>
    );
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Verse Header */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 2,
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: '2px solid',
          borderColor: 'primary.main',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              fontFamily: 'monospace',
            }}
          >
            Verse {verseNumber}
          </Typography>
          <Chip
            label={`${segments.length} sections`}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>
      </Paper>

      {/* Non-Commentary Sections - Side by Side */}
      {otherSegments.length > 0 && (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {otherSegments.map((segmentData) => (
            <Grid
              key={segmentData.segment.id}
              size={{ xs: 12, md: 12 / otherSegments.length }}
              sx={{ minHeight: '100%' }}
            >
              {renderSegmentPaper(segmentData)}
            </Grid>
          ))}
        </Grid>
      )}

      {/* Commentary Sections - Full Width Below */}
      {commentarySegments.map((segmentData, index) => (
        <Box
          key={segmentData.segment.id}
          sx={{
            mt: index === 0 ? 0 : 2,
            width: '100%',
          }}
        >
          {renderSegmentPaper(segmentData)}
        </Box>
      ))}
    </Box>
  );
};

export default VerseBlock;
