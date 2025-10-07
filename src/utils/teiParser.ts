export interface TEIWord {
  id: string;
  content: string;
  anchors: Array<{
    id: string;
    content: string;
  }>;
}

export interface TEILine {
  id: string;
  number: string;
  content: string;
  words: TEIWord[];
}

export interface TEISegment {
  id: string;
  content: string;
  words: TEIWord[];
  lineNumbers: string[];
  lines: TEILine[];
}

export interface TEITextSection {
  type: string;
  language: string;
  id: string;
  segments: TEISegment[];
}

export interface ParsedTEIDocument {
  sections: TEITextSection[];
  metadata: {
    title: string;
    author: string;
    editor: string;
    date: string;
    language: string;
  };
}

export class TEIParser {
  private xmlDoc: Document | null = null;

  constructor(xmlContent: string) {
    try {
      const parser = new DOMParser();
      this.xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
      
      // Check for parsing errors
      const parseError = this.xmlDoc.querySelector('parsererror');
      if (parseError) {
        throw new Error('XML parsing failed: ' + parseError.textContent);
      }
    } catch (error) {
      console.error('Error parsing TEI XML:', error);
      throw error;
    }
  }

  parse(): ParsedTEIDocument {
    if (!this.xmlDoc) {
      throw new Error('No XML document to parse');
    }

    const sections: TEITextSection[] = [];
    
    // Parse each text section
    const textElements = this.xmlDoc.querySelectorAll('text');
    textElements.forEach((textElement) => {
      const section = this.parseTextSection(textElement);
      if (section) {
        sections.push(section);
      }
    });

    // Parse metadata
    const metadata = this.parseMetadata();

    return {
      sections,
      metadata
    };
  }

  private parseTextSection(textElement: Element): TEITextSection | null {
    const type = textElement.getAttribute('type') || 'unknown';
    const language = textElement.getAttribute('xml:lang') || 'unknown';
    const id = textElement.getAttribute('xml:id') || 'unknown';

    const segments: TEISegment[] = [];
    
    // Find all seg elements
    const segElements = textElement.querySelectorAll('seg');
    segElements.forEach((segElement) => {
      const segment = this.parseSegment(segElement);
      if (segment) {
        segments.push(segment);
      }
    });

    return {
      type,
      language,
      id,
      segments
    };
  }

  private parseSegment(segElement: Element): TEISegment | null {
    const id = segElement.getAttribute('xml:id') || '';
    const content = this.extractTextContent(segElement);
    
    const words: TEIWord[] = [];
    const lineNumbers: string[] = [];
    const lines: TEILine[] = [];

    // Extract words with anchors
    const wordElements = segElement.querySelectorAll('w');
    wordElements.forEach((wordElement) => {
      const word = this.parseWord(wordElement);
      if (word) {
        words.push(word);
      }
    });

    // Extract line-by-line information from l elements
    const lineElements = segElement.querySelectorAll('l');
    lineElements.forEach((lineElement) => {
      const lineId = lineElement.getAttribute('xml:id') || '';
      if (lineId) {
        // Extract numbers from IDs like "Theb.5.335"
        const match = lineId.match(/\.(\d+)\.(\d+)/);
        if (match) {
          const [, book, line] = match;
          const lineNumber = `${book}.${line}`;
          lineNumbers.push(lineNumber);
          
          // Extract line content and words
          const lineContent = this.extractTextContent(lineElement);
          const lineWords: TEIWord[] = [];
          
          // Extract words from this specific line
          const lineWordElements = lineElement.querySelectorAll('w');
          lineWordElements.forEach((wordElement) => {
            const word = this.parseWord(wordElement);
            if (word) {
              lineWords.push(word);
            }
          });
          
          lines.push({
            id: lineId,
            number: lineNumber,
            content: lineContent,
            words: lineWords
          });
        }
      }
    });

    return {
      id,
      content,
      words,
      lineNumbers,
      lines
    };
  }

  private parseWord(wordElement: Element): TEIWord | null {
    const id = wordElement.getAttribute('xml:id') || '';
    const content = this.extractTextContent(wordElement);
    
    const anchors: Array<{ id: string; content: string }> = [];
    
    // Extract anchor elements
    const anchorElements = wordElement.querySelectorAll('anchor');
    anchorElements.forEach((anchorElement) => {
      const anchorId = anchorElement.getAttribute('xml:id') || '';
      const anchorContent = anchorElement.textContent || '';
      anchors.push({
        id: anchorId,
        content: anchorContent
      });
    });

    return {
      id,
      content,
      anchors
    };
  }

  private parseMetadata() {
    const titleElement = this.xmlDoc?.querySelector('title[type="main"]');
    const authorElement = this.xmlDoc?.querySelector('author');
    const editorElement = this.xmlDoc?.querySelector('editor');
    const dateElement = this.xmlDoc?.querySelector('date');
    const languageElement = this.xmlDoc?.querySelector('langUsage language[ana="source"]');

    return {
      title: titleElement?.textContent?.trim() || 'Unknown Title',
      author: authorElement?.textContent?.trim() || 'Unknown Author',
      editor: editorElement?.textContent?.trim() || 'Unknown Editor',
      date: dateElement?.textContent?.trim() || 'Unknown Date',
      language: languageElement?.textContent?.trim() || 'Unknown Language'
    };
  }

  private extractTextContent(element: Element): string {
    // Extract text content while preserving TEI structure
    let content = '';
    
    // Handle line breaks according to TEI guidelines
    const lbElements = element.querySelectorAll('lb');
    if (lbElements.length > 0) {
      // Replace lb elements with line breaks, preserving TEI formatting
      const tempDiv = element.cloneNode(true) as Element;
      lbElements.forEach(lb => {
        // Insert line break before the lb element to maintain proper verse structure
        const textNode = document.createTextNode('\n');
        lb.parentNode?.insertBefore(textNode, lb);
        lb.remove();
      });
      content = tempDiv.textContent || '';
    } else {
      content = element.textContent || '';
    }

    // Clean up the content according to TEI standards
    return content
      .trim() // Remove leading/trailing whitespace
      .replace(/\s+/g, ' ') // Normalize multiple spaces to single space
      .replace(/\n\s+/g, '\n') // Remove leading spaces from lines
      .replace(/\s+\n/g, '\n') // Remove trailing spaces from lines
      .replace(/\n{3,}/g, '\n\n'); // Limit consecutive line breaks to maximum of 2
  }

  // Helper method to get segments by ID pattern
  getSegmentsByIdPattern(pattern: string): TEISegment[] {
    const segments: TEISegment[] = [];
    
    this.xmlDoc?.querySelectorAll(`seg[xml\\:id*="${pattern}"]`).forEach((segElement) => {
      const segment = this.parseSegment(segElement);
      if (segment) {
        segments.push(segment);
      }
    });

    return segments;
  }

  // Helper method to find corresponding segments across sections
  findCorrespondingSegments(segmentId: string): TEISegment[] {
    const segments: TEISegment[] = [];
    
    // Extract the numeric part from segment ID (e.g., "5.335" from "la.5.335")
    const match = segmentId.match(/\.(\d+\.\d+)$/);
    if (match) {
      const numericPart = match[1];
      
      // Find segments with matching numeric part across all sections
      this.xmlDoc?.querySelectorAll(`seg[xml\\:id*="${numericPart}"]`).forEach((segElement) => {
        const segment = this.parseSegment(segElement);
        if (segment) {
          segments.push(segment);
        }
      });
    }

    return segments;
  }
}

// Utility function to parse TEI XML content
export const parseTEIContent = (xmlContent: string): ParsedTEIDocument => {
  const parser = new TEIParser(xmlContent);
  return parser.parse();
};

// Utility function to extract segment numbers for alignment
export const extractSegmentNumber = (segmentId: string): string | null => {
  const match = segmentId.match(/\.(\d+\.\d+)$/);
  return match ? match[1] : null;
};

// Utility function to group segments by their numeric identifier
export const groupSegmentsByNumber = (sections: TEITextSection[]): Map<string, TEISegment[]> => {
  const grouped = new Map<string, TEISegment[]>();
  
  sections.forEach(section => {
    section.segments.forEach(segment => {
      const number = extractSegmentNumber(segment.id);
      if (number) {
        if (!grouped.has(number)) {
          grouped.set(number, []);
        }
        grouped.get(number)!.push(segment);
      }
    });
  });
  
  return grouped;
};
