import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Alert,
} from '@mui/material';
import {
  Download,
  Delete,
  Visibility,
  Description,
  Image,
  PictureAsPdf,
  InsertDriveFile,
} from '@mui/icons-material';
import { fetchUserFiles, deleteFile } from '../store/fileSlice';
import type { RootState, AppDispatch } from '../store/store';
import LoadingSpinner from './LoadingSpinner';

interface FileListProps {
  userId: string;
}

const FileList: React.FC<FileListProps> = ({ userId }) => {
  const dispatch = useDispatch<AppDispatch>();
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

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image color="primary" />;
    if (fileType === 'application/pdf') return <PictureAsPdf color="error" />;
    if (fileType.startsWith('text/')) return <Description color="info" />;
    return <InsertDriveFile color="action" />;
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
      hour: '2-digit',
      minute: '2-digit',
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
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Your Files ({files.length})
      </Typography>

      {files.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            No files uploaded yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload your first file to get started
          </Typography>
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>File</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Uploaded</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {files.map((file) => (
                <TableRow key={file.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      {getFileIcon(file.type)}
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {file.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatFileSize(file.size)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={file.type.split('/')[1]?.toUpperCase() || 'UNKNOWN'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(file.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleDownload(file)}
                        title="Download"
                      >
                        <Download />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => window.open(file.url, '_blank')}
                        title="View"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(file.name)}
                        title="Delete"
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default FileList;
