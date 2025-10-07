import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Divider,
} from '@mui/material';
import type { TEITextSection, TEISegment, TEILine } from '../utils/teiParser.ts';
import WordTooltip from './WordTooltip.tsx';
import InlineWordTooltip from './InlineWordTooltip.tsx';

interface TEIColumnProps {
  section: TEITextSection;
  segments: TEISegment[];
  onSegmentClick?: (segmentId: string) => void;
  highlightedSegmentId?: string;
}

const TEIColumn: React.FC<TEIColumnProps> = ({
  section,
  segments,
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

  const renderSegmentContent = (segment: TEISegment) => {
    if (!segment.content) return null;

    // For source sections, render line-by-line with line numbers
    if (section.type === 'source' && segment.lines.length > 0) {
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
          {segment.lineNumbers.map((lineNumber, index) => (
            <Chip
              key={index}
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

  return (
    <Box sx={{ height: '100%' }}>
      {/* Column Header */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          mb: 2,
          bgcolor: 'background.paper',
          border: `2px solid ${getSectionColor(section.type)}`,
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: getSectionColor(section.type),
            }}
          >
            {getSectionTitle(section.type, section.language)}
          </Typography>
          <Chip
            label={section.language.toUpperCase()}
            size="small"
            sx={{
              bgcolor: getSectionColor(section.type),
              color: 'white',
              fontWeight: 'bold',
            }}
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary">
          {section.segments.length} segments
        </Typography>
      </Paper>

      {/* Segments Content */}
      <Box sx={{ height: 'calc(100% - 120px)', overflow: 'auto' }}>
        {segments.map((segment) => (
          <Paper
            key={segment.id}
            elevation={1}
            sx={{
              p: 2,
              mb: 2,
              cursor: onSegmentClick ? 'pointer' : 'default',
              border: highlightedSegmentId === segment.id ? `2px solid ${getSectionColor(section.type)}` : '1px solid',
              borderColor: highlightedSegmentId === segment.id ? getSectionColor(section.type) : 'divider',
              bgcolor: highlightedSegmentId === segment.id ? 'action.hover' : 'background.paper',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: 2,
                transform: 'translateY(-1px)',
              },
            }}
            onClick={() => onSegmentClick?.(segment.id)}
          >
            {/* Segment Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 'bold',
                  color: getSectionColor(section.type),
                  fontFamily: 'monospace',
                }}
              >
                {segment.id}
              </Typography>
              
              {segment.lineNumbers.length > 0 && (
                <Chip
                  label={`${segment.lineNumbers.length} lines`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              )}
            </Box>

            <Divider sx={{ mb: 1.5 }} />

            {/* Segment Content */}
            <Box sx={{ 
              minHeight: '60px', // Ensure consistent minimum height
              display: 'flex',
              alignItems: 'flex-start',
              width: '100%'
            }}>
              {renderSegmentContent(segment)}
            </Box>

            {/* Annotated Words - Only show for non-source sections */}
            {section.type !== 'source' && renderWordsWithTooltips(segment)}

            {/* Line Numbers - Only show for non-source sections */}
            {section.type !== 'source' && renderLineNumbers(segment)}
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default TEIColumn;
