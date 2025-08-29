import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Alert,
  Paper,
  IconButton,
} from '@mui/material';
import { CloudUpload, Close, FileUpload as FileUploadIcon } from '@mui/icons-material';
import { uploadFile, setUploadProgress } from '../store/fileSlice';
import type { RootState, AppDispatch } from '../store/store';

interface FileUploadProps {
  userId: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ userId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, uploadProgress } = useSelector((state: RootState) => state.files);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      dispatch(uploadFile({ file, userId }));
    });
  }, [dispatch, userId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/*': ['.txt', '.md', '.json', '.xml', '.html'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg'],
    },
    multiple: true,
  });

  const handleCloseError = () => {
    dispatch(setUploadProgress(0));
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Upload Files
      </Typography>
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleCloseError}
            >
              <Close fontSize="inherit" />
            </IconButton>
          }
        >
          {error}
        </Alert>
      )}

      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          borderRadius: 2,
          p: 4,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragActive ? 'primary.50' : 'grey.50',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'primary.50',
          },
        }}
      >
        <input {...getInputProps()} />
        <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          or click to select files
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Supported formats: TXT, MD, JSON, XML, HTML, PDF, DOC, DOCX, Images
        </Typography>
      </Box>

      {isLoading && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" gutterBottom>
            Uploading... {uploadProgress}%
          </Typography>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </Box>
      )}

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<FileUploadIcon />}
          onClick={() => document.getElementById('file-input')?.click()}
          disabled={isLoading}
        >
          Select Files
        </Button>
      </Box>
    </Paper>
  );
};

export default FileUpload;
