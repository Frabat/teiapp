import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  Download,
  Delete,
  Visibility,
  Description,
  Image,
  PictureAsPdf,
  InsertDriveFile,
  CloudUpload,
} from '@mui/icons-material';
import { fetchUserFiles, deleteFile } from '../store/fileSlice';
import type { RootState, AppDispatch } from '../store/store';
import LoadingSpinner from './LoadingSpinner';

interface FileGridProps {
  userId: string;
}

const FileGrid: React.FC<FileGridProps> = ({ userId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { files, isLoading, error } = useSelector((state: RootState) => state.files);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserFiles(userId));
    }
  }, [dispatch, userId]);

  const handleDelete = (fileName: string) => {
    if (window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
      dispatch(deleteFile({ fileName, userId }));
    }
  };

  const handleDownload = (file: any) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTitleClick = (file: any) => {
    // Navigate to detail page with storage URL and filename as query parameters
    navigate(`/detail?url=${encodeURIComponent(file.url)}&fileName=${encodeURIComponent(file.name)}`);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image sx={{ fontSize: 32, color: 'primary.main' }} />;
    if (fileType === 'application/pdf') return <PictureAsPdf sx={{ fontSize: 32, color: 'error.main' }} />;
    if (fileType.startsWith('text/')) return <Description sx={{ fontSize: 32, color: 'info.main' }} />;
    return <InsertDriveFile sx={{ fontSize: 32, color: 'grey.500' }} />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading files..." />;
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {files.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 6,
          bgcolor: 'rgba(0,0,0,0.02)',
          borderRadius: 3,
          border: '2px dashed',
          borderColor: 'grey.300',
        }}>
          <CloudUpload sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No files uploaded yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start by uploading your first file to get organized
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {files.map((file) => (
            <Grid key={file.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                <CardContent sx={{ 
                  flexGrow: 1, 
                  textAlign: 'center',
                  p: 3,
                  '&:last-child': { pb: 3 },
                }}>
                  {/* File Icon */}
                  <Box sx={{ 
                    mb: 3,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 64,
                    height: 64,
                    mx: 'auto',
                    bgcolor: 'rgba(0,0,0,0.02)',
                    borderRadius: 3,
                  }}>
                    {getFileIcon(file.type)}
                  </Box>
                  
                  {/* File Name - Clickable */}
                  <Typography 
                    variant="h6" 
                    noWrap 
                    gutterBottom
                    sx={{
                      cursor: 'pointer',
                      color: 'primary.main',
                      fontWeight: 'bold',
                      mb: 2,
                      '&:hover': {
                        color: 'primary.dark',
                        textDecoration: 'underline',
                      },
                    }}
                    onClick={() => handleTitleClick(file)}
                    title="Click to view file details"
                  >
                    {file.name}
                  </Typography>
                  
                  {/* File Info */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {formatFileSize(file.size)}
                    </Typography>
                    <Chip
                      label={file.type.split('/')[1]?.toUpperCase() || 'UNKNOWN'}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        mb: 1,
                        borderRadius: 2,
                        fontWeight: 'medium',
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" display="block">
                      {formatDate(file.createdAt)}
                    </Typography>
                  </Box>
                </CardContent>
                
                {/* Action Buttons */}
                <Box sx={{ 
                  p: 2, 
                  pt: 0,
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: 1,
                  borderTop: '1px solid',
                  borderColor: 'grey.100',
                }}>
                  <Tooltip title="View Details">
                    <IconButton
                      size="small"
                      onClick={() => handleTitleClick(file)}
                      sx={{
                        color: 'primary.main',
                        '&:hover': {
                          bgcolor: 'primary.main',
                          color: 'white',
                        },
                      }}
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Download">
                    <IconButton
                      size="small"
                      onClick={() => handleDownload(file)}
                      sx={{
                        color: 'secondary.main',
                        '&:hover': {
                          bgcolor: 'secondary.main',
                          color: 'white',
                        },
                      }}
                    >
                      <Download />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(file.name)}
                      sx={{
                        color: 'error.main',
                        '&:hover': {
                          bgcolor: 'error.main',
                          color: 'white',
                        },
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default FileGrid;
