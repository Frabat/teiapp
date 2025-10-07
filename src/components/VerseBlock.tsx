import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Chip,
  Divider,
} from '@mui/material';
import type { TEISegment, TEILine } from '../utils/teiParser';
import WordTooltip from './WordTooltip';
import InlineWordTooltip from './InlineWordTooltip';

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

  const renderTextWithInlineTooltips = (line: TEILine) => {
    if (!line.content) return line.content;

    let content = line.content;
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    // Sort words by their position in the content
    const sortedWords = line.words.sort((a, b) => {
      const aIndex = content.indexOf(a.content);
      const bIndex = content.indexOf(b.content);
      return aIndex - bIndex;
    });

    sortedWords.forEach((word, wordIndex) => {
      const wordIndex_inContent = content.indexOf(word.content, lastIndex);
      
      if (wordIndex_inContent !== -1) {
        // Add text before the word
        if (wordIndex_inContent > lastIndex) {
          elements.push(
            <span key={`text-${wordIndex}`}>
              {content.slice(lastIndex, wordIndex_inContent)}
            </span>
          );
        }
        
        // Add the word with tooltip
        elements.push(
          <InlineWordTooltip key={`word-${word.id}`} word={word}>
            {word.content}
          </InlineWordTooltip>
        );
        
        lastIndex = wordIndex_inContent + word.content.length;
      }
    });

    // Add remaining text
    if (lastIndex < content.length) {
      elements.push(
        <span key="text-end">
          {content.slice(lastIndex)}
        </span>
      );
    }

    return elements.length > 0 ? elements : content;
  };

  const renderSegmentContent = (segment: TEISegment, sectionType: string) => {
    if (!segment.content) return null;

    // For source sections, render line-by-line with line numbers
    if (sectionType === 'source' && segment.lines.length > 0) {
      return (
        <Box sx={{ width: '100%' }}>
          {segment.lines.map((line, lineIndex) => (
            <Box
              key={line.id}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                mb: lineIndex < segment.lines.length - 1 ? 1 : 0,
                gap: 1,
              }}
            >
              {/* Line number on the left */}
              <Typography
                variant="caption"
                sx={{
                  minWidth: '40px',
                  textAlign: 'right',
                  color: 'text.secondary',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  flexShrink: 0,
                  pt: 0.2, // Slight top padding to align with text
                }}
              >
                {line.number}
              </Typography>
              
              {/* Line content with inline tooltips */}
              <Typography
                variant="body2"
                sx={{
                  lineHeight: 1.8,
                  textAlign: 'left',
                  fontFamily: 'inherit',
                  fontSize: '0.95rem',
                  color: 'text.primary',
                  flex: 1,
                  margin: 0,
                  padding: 0,
                }}
              >
                {renderTextWithInlineTooltips(line)}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }

    // For non-source sections, use the original rendering
    const formattedContent = segment.content
      .trim() // Remove leading/trailing whitespace
      .replace(/\n\s*\n/g, '\n') // Remove multiple consecutive line breaks
      .replace(/\s+/g, ' ') // Normalize whitespace within lines
      .replace(/\n/g, '\n'); // Preserve intentional line breaks
    
    return (
      <Typography
        variant="body2"
        sx={{
          lineHeight: 1.8,
          whiteSpace: 'pre-line', // Preserves line breaks but collapses other whitespace
          textAlign: 'left',
          fontFamily: 'inherit',
          fontSize: '0.95rem',
          color: 'text.primary',
          // Ensure proper text flow and alignment
          display: 'block',
          width: '100%',
          // Remove any default margins that might cause alignment issues
          margin: 0,
          padding: 0,
        }}
      >
        {formattedContent}
      </Typography>
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
          display: 'flex',
          flexDirection: 'column',
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
        <Box sx={{ 
          minHeight: '60px', // Ensure consistent minimum height
          display: 'flex',
          alignItems: 'flex-start',
          width: '100%'
        }}>
          {renderSegmentContent(segment, sectionType)}
        </Box>

        {/* Annotated Words - Only show for non-source sections */}
        {sectionType !== 'source' && renderWordsWithTooltips(segment)}

        {/* Line Numbers - Only show for non-source sections */}
        {sectionType !== 'source' && renderLineNumbers(segment)}
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
        <Grid container spacing={2} sx={{ mb: 2, alignItems: 'stretch' }}>
          {otherSegments.map((segmentData) => (
            <Grid
              key={segmentData.segment.id}
              size={{ xs: 12, md: 12 / otherSegments.length }}
              sx={{ 
                minHeight: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
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
