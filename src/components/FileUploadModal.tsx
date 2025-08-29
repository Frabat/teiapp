import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  LinearProgress,
  Alert,
  IconButton,
  Chip,
} from '@mui/material';
import {
  CloudUpload,
  Close,
  Description,
  Image,
  PictureAsPdf,
  InsertDriveFile,
  CheckCircle,
} from '@mui/icons-material';
import { uploadFile } from '../store/fileSlice.ts';
import type { AppDispatch } from '../store/store.ts';

interface FileUploadModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({ open, onClose, userId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    setError(null);
    setUploadedFiles([]);
    setUploadProgress(0);

    try {
      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const increment = Math.random() * 20;
            return Math.min(prev + increment, 90);
          });
        }, 200);

        await dispatch(uploadFile({ file, userId })).unwrap();
        
        clearInterval(progressInterval);
        setUploadProgress(100);
        setUploadedFiles(prev => [...prev, file.name]);

        // Reset progress for next file
        if (i < acceptedFiles.length - 1) {
          setUploadProgress(0);
        }
      }

      // Close modal after successful upload
      setTimeout(() => {
        onClose();
        setUploading(false);
        setUploadProgress(0);
        setUploadedFiles([]);
      }, 1500);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setUploading(false);
      setUploadProgress(0);
    }
  }, [dispatch, userId, onClose]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    multiple: true,
    disabled: uploading,
  });

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image sx={{ fontSize: 24, color: 'primary.main' }} />;
    if (fileType === 'application/pdf') return <PictureAsPdf sx={{ fontSize: 24, color: 'error.main' }} />;
    if (fileType.startsWith('text/')) return <Description sx={{ fontSize: 24, color: 'info.main' }} />;
    return <InsertDriveFile sx={{ fontSize: 24, color: 'grey.500' }} />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleClose = () => {
    if (!uploading) {
      onClose();
      setUploadProgress(0);
      setUploadedFiles([]);
      setError(null);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #fefefe 0%, #fafaf9 100%)',
        },
      }}
    >
      <DialogTitle sx={{ 
        pb: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CloudUpload sx={{ fontSize: 28, color: 'secondary.main' }} />
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Upload Files
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          disabled={uploading}
          sx={{ color: 'text.secondary' }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {uploading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, color: 'text.primary' }}>
              Uploading Files...
            </Typography>
            
            <LinearProgress 
              variant="determinate" 
              value={uploadProgress} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                mb: 3,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  bgcolor: 'secondary.main',
                },
              }} 
            />
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {uploadProgress.toFixed(0)}% Complete
            </Typography>

            {uploadedFiles.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.primary' }}>
                  Successfully uploaded:
                </Typography>
                {uploadedFiles.map((fileName, index) => (
                  <Box key={index} sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1, 
                    mb: 1,
                    p: 1,
                    bgcolor: 'success.main',
                    color: 'white',
                    borderRadius: 2,
                  }}>
                    <CheckCircle sx={{ fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {fileName}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        ) : (
          <Box>
            <Box
              {...getRootProps()}
              sx={{
                border: '2px dashed',
                borderColor: isDragActive ? 'secondary.main' : 'grey.300',
                borderRadius: 3,
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                bgcolor: isDragActive ? 'rgba(251, 191, 36, 0.05)' : 'rgba(0,0,0,0.02)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'secondary.main',
                  bgcolor: 'rgba(251, 191, 36, 0.05)',
                },
              }}
            >
              <input {...getInputProps()} />
              
              <CloudUpload sx={{ 
                fontSize: 64, 
                color: isDragActive ? 'secondary.main' : 'grey.400',
                mb: 2,
              }} />
              
              <Typography variant="h6" sx={{ mb: 1, color: 'text.primary' }}>
                {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                or click to select files
              </Typography>
              
              <Button
                variant="outlined"
                sx={{
                  borderColor: 'secondary.main',
                  color: 'secondary.main',
                  '&:hover': {
                    borderColor: 'secondary.dark',
                    bgcolor: 'secondary.main',
                    color: 'white',
                  },
                }}
              >
                Choose Files
              </Button>
            </Box>

            {acceptedFiles.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.primary' }}>
                  Selected Files ({acceptedFiles.length}):
                </Typography>
                
                <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                  {acceptedFiles.map((file, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        mb: 1,
                        bgcolor: 'rgba(0,0,0,0.02)',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'grey.200',
                      }}
                    >
                      {getFileIcon(file.type)}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {file.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatFileSize(file.size)}
                        </Typography>
                      </Box>
                      <Chip
                        label={file.type.split('/')[1]?.toUpperCase() || 'UNKNOWN'}
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={handleClose}
          disabled={uploading}
          sx={{ color: 'text.secondary' }}
        >
          Cancel
        </Button>
        
        {!uploading && acceptedFiles.length > 0 && (
          <Button
            variant="contained"
            onClick={() => onDrop([...acceptedFiles])}
            startIcon={<CloudUpload />}
            sx={{
              bgcolor: 'secondary.main',
              color: 'secondary.contrastText',
              '&:hover': {
                bgcolor: 'secondary.dark',
              },
            }}
          >
            Upload {acceptedFiles.length} File{acceptedFiles.length !== 1 ? 's' : ''}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default FileUploadModal;
