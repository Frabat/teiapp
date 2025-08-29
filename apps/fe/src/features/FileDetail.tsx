import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Alert,
  Chip,
  Avatar,
  Card,
  Tabs,
  Tab,
} from '@mui/material';
import {
  ArrowBack,
  Download,
  Visibility,
  Description,
  Image,
  PictureAsPdf,
  InsertDriveFile,
  AccountCircle,
  Schedule,
  Storage,
  Code,
} from '@mui/icons-material';
import LoadingSpinner from '../components/LoadingSpinner';
import TEIViewer from '../components/TEIViewer';
import { parseTEIContent } from '../utils/teiParser';
import type { RootState } from '../store/store';
import type { ParsedTEIDocument } from '../utils/teiParser';

interface FileDetailProps {}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`file-tabpanel-${index}`}
      aria-labelledby={`file-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const FileDetail: React.FC<FileDetailProps> = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [fileContent, setFileContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [parsedTEIDocument, setParsedTEIDocument] = useState<ParsedTEIDocument | null>(null);
  const [teiParseError, setTeiParseError] = useState<string | null>(null);
  
  const currentUser = useSelector((state: RootState) => state.user.user);

  const storageUrl = searchParams.get('url');
  const fileName = searchParams.get('fileName');

  const isXMLFile = useMemo(() => {
    return fileInfo?.type === 'text/xml' || fileName?.endsWith('.xml');
  }, [fileInfo?.type, fileName]);

  const isTEIDocument = useMemo(() => {
    return isXMLFile && fileContent.includes('<TEI');
  }, [isXMLFile, fileContent]);

  useEffect(() => {
    if (!storageUrl) {
      setError('No file URL provided');
      setIsLoading(false);
      return;
    }

    const fetchFileContent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setTeiParseError(null);

        // Fetch the file content
        const response = await fetch(storageUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.statusText}`);
        }

        // Get file content as text
        const content = await response.text();
        setFileContent(content);

        // Extract file information from the URL
        const urlParts = storageUrl.split('/');
        const fileNameFromUrl = urlParts[urlParts.length - 1];
        
        setFileInfo({
          name: fileName || fileNameFromUrl,
          type: response.headers.get('content-type') || 'text/plain',
          size: response.headers.get('content-length') || '0',
          lastModified: response.headers.get('last-modified') || new Date().toISOString(),
        });

        // Parse TEI XML if it's a TEI document
        if (isTEIDocument) {
          try {
            const parsed = parseTEIContent(content);
            setParsedTEIDocument(parsed);
          } catch (parseError) {
            console.error('TEI parsing error:', parseError);
            setTeiParseError(parseError instanceof Error ? parseError.message : 'Failed to parse TEI document');
          }
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load file content');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFileContent();
  }, [storageUrl, fileName, isTEIDocument]);

  const handleGoBack = () => {
    navigate('/');
  };

  const handleDownload = () => {
    if (storageUrl) {
      const link = document.createElement('a');
      link.href = storageUrl;
      link.download = fileName || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleViewOriginal = () => {
    if (storageUrl) {
      window.open(storageUrl, '_blank');
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image sx={{ fontSize: 48, color: 'primary.main' }} />;
    if (fileType === 'application/pdf') return <PictureAsPdf sx={{ fontSize: 48, color: 'error.main' }} />;
    if (fileType.startsWith('text/')) return <Description sx={{ fontSize: 48, color: 'info.main' }} />;
    if (fileType === 'text/xml') return <Code sx={{ fontSize: 48, color: 'warning.main' }} />;
    return <InsertDriveFile sx={{ fontSize: 48, color: 'grey.500' }} />;
  };

  const formatFileSize = (bytes: string) => {
    const size = parseInt(bytes);
    if (size === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading file content..." fullHeight />;
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={handleGoBack}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f5f4 0%, #e7e5e4 100%)',
      p: 3,
    }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleGoBack}
            sx={{ mb: 3 }}
          >
            Back to Files
          </Button>
          
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }}>
            {fileInfo?.name || 'File Details'}
          </Typography>
          
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
            {isTEIDocument ? 'TEI XML Document Viewer' : 'View and analyze your document content'}
          </Typography>
        </Box>

        {/* TEI Document Viewer */}
        {isTEIDocument && parsedTEIDocument && (
          <Box sx={{ mb: 4 }}>
            <TEIViewer
              parsedDocument={parsedTEIDocument}
              error={teiParseError}
            />
          </Box>
        )}

        {/* TEI Parse Error */}
        {isTEIDocument && teiParseError && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>TEI Parsing Warning:</strong> {teiParseError}
            </Typography>
            <Typography variant="body2">
              The document will be displayed as raw XML. Some features may not be available.
            </Typography>
          </Alert>
        )}

        {/* File Information and Content Tabs */}
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
          {/* Left Column - File Information */}
          <Box sx={{ flex: 1 }}>
            {/* File Information Card */}
            <Card sx={{ mb: 3, p: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: 'text.primary' }}>
                File Information
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'rgba(0,0,0,0.02)', 
                  borderRadius: 3,
                  mr: 3,
                }}>
                  {getFileIcon(fileInfo?.type || '')}
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {fileInfo?.name || 'Unknown File'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {fileInfo?.type || 'Unknown Type'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                <Chip
                  icon={<Storage />}
                  label={`Size: ${formatFileSize(fileInfo?.size || '0')}`}
                  variant="outlined"
                  size="medium"
                  sx={{ borderRadius: 2 }}
                />
                <Chip
                  icon={<Schedule />}
                  label={`Modified: ${formatDate(fileInfo?.lastModified || '')}`}
                  variant="outlined"
                  size="medium"
                  sx={{ borderRadius: 2 }}
                />
                {isTEIDocument && (
                  <Chip
                    icon={<Code />}
                    label="TEI XML"
                    variant="outlined"
                    size="medium"
                    color="warning"
                    sx={{ borderRadius: 2 }}
                  />
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  onClick={handleDownload}
                  sx={{
                    bgcolor: 'secondary.main',
                    color: 'secondary.contrastText',
                    '&:hover': {
                      bgcolor: 'secondary.dark',
                    },
                  }}
                >
                  Download
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Visibility />}
                  onClick={handleViewOriginal}
                  sx={{
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      borderColor: 'primary.dark',
                      bgcolor: 'primary.main',
                      color: 'white',
                    },
                  }}
                >
                  View Original
                </Button>
              </Box>
            </Card>

            {/* Content Tabs */}
            <Card sx={{ p: 3 }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={activeTab} onChange={handleTabChange} aria-label="file content tabs">
                  <Tab label="Content Preview" />
                  {isTEIDocument && <Tab label="Raw XML" />}
                  <Tab label="Metadata" />
                </Tabs>
              </Box>

              <TabPanel value={activeTab} index={0}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Content Preview
                </Typography>
                
                {isTEIDocument && parsedTEIDocument ? (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    This is a TEI XML document. Use the TEI Viewer above for the best experience.
                  </Alert>
                ) : fileInfo?.type?.startsWith('text/') ? (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 3,
                      bgcolor: 'rgba(0,0,0,0.02)',
                      borderRadius: 3,
                      maxHeight: '600px',
                      overflow: 'auto',
                      fontFamily: 'monospace',
                      fontSize: '14px',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      borderColor: 'grey.300',
                    }}
                  >
                    {fileContent || 'No content available'}
                  </Paper>
                ) : fileInfo?.type?.startsWith('image/') ? (
                  <Box sx={{ textAlign: 'center' }}>
                    <img
                      src={storageUrl || ''}
                      alt={fileInfo?.name || 'Image'}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '500px',
                        borderRadius: '16px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      Image file - Content preview not available
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      Content preview not available for this file type
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Use the "View Original" button to see the file content
                    </Typography>
                  </Box>
                )}
              </TabPanel>

              {isTEIDocument && (
                <TabPanel value={activeTab} index={1}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Raw XML Content
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 3,
                      bgcolor: 'rgba(0,0,0,0.02)',
                      borderRadius: 3,
                      maxHeight: '600px',
                      overflow: 'auto',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      lineHeight: 1.4,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      borderColor: 'grey.300',
                    }}
                  >
                    {fileContent || 'No content available'}
                  </Paper>
                </TabPanel>
              )}

              <TabPanel value={activeTab} index={isTEIDocument ? 2 : 1}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  File Metadata
                </Typography>
                <Box sx={{ space: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      File Name
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {fileInfo?.name || 'Unknown'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      File Type
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {fileInfo?.type?.split('/')[1]?.toUpperCase() || 'UNKNOWN'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      File Size
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {formatFileSize(fileInfo?.size || '0')}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Last Modified
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {formatDate(fileInfo?.lastModified || '')}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label="Active"
                      size="small"
                      sx={{
                        bgcolor: 'success.main',
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>
                </Box>
              </TabPanel>
            </Card>
          </Box>

          {/* Right Column - Author & Metadata */}
          <Box sx={{ width: { xs: '100%', lg: 320 } }}>
            {/* Author Information Card */}
            <Card sx={{ mb: 3, p: 3, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: 'text.primary' }}>
                Author Information
              </Typography>
              
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '2rem',
                }}
              >
                {currentUser?.email?.charAt(0).toUpperCase() || <AccountCircle />}
              </Avatar>
              
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                {currentUser?.email?.split('@')[0] || 'Unknown User'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Document Owner
              </Typography>
              
              <Chip
                label="File Manager"
                sx={{
                  bgcolor: 'secondary.main',
                  color: 'secondary.contrastText',
                  fontWeight: 'bold',
                }}
              />
            </Card>

            {/* TEI Document Info (if applicable) */}
            {isTEIDocument && parsedTEIDocument && (
              <Card sx={{ mb: 3, p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: 'text.primary' }}>
                  TEI Document Info
                </Typography>
                
                <Box sx={{ space: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Title
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {parsedTEIDocument.metadata.title}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Author
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {parsedTEIDocument.metadata.author}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Editor
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {parsedTEIDocument.metadata.editor}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Date
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {parsedTEIDocument.metadata.date}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Language
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {parsedTEIDocument.metadata.language}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            )}

            {/* File Statistics Card */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: 'text.primary' }}>
                File Statistics
              </Typography>
              
              <Box sx={{ space: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    File Size
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {formatFileSize(fileInfo?.size || '0')}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    File Type
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {fileInfo?.type?.split('/')[1]?.toUpperCase() || 'UNKNOWN'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Created
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {formatDate(fileInfo?.lastModified || '')}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label="Active"
                    size="small"
                    sx={{
                      bgcolor: 'success.main',
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  />
                </Box>
              </Box>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default FileDetail;
