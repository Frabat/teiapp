import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { storage } from '../firebase';

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface FileState {
  files: FileItem[];
  isLoading: boolean;
  error: string | null;
  uploadProgress: number;
}

const initialState: FileState = {
  files: [],
  isLoading: false,
  error: null,
  uploadProgress: 0,
};

// Async thunk for uploading files
export const uploadFile = createAsyncThunk(
  'files/uploadFile',
  async ({ file, userId }: { file: File; userId: string }, { rejectWithValue }) => {
    try {
      const storageRef = ref(storage, `files/${userId}/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      const fileItem: FileItem = {
        id: snapshot.ref.name,
        name: file.name,
        size: file.size,
        type: file.type,
        url: downloadURL,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId,
      };
      
      return fileItem;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Upload failed');
    }
  }
);

// Async thunk for fetching user files
export const fetchUserFiles = createAsyncThunk(
  'files/fetchUserFiles',
  async (userId: string, { rejectWithValue }) => {
    try {
      const storageRef = ref(storage, `files/${userId}`);
      const result = await listAll(storageRef);
      
      const files: FileItem[] = [];
      
      for (const itemRef of result.items) {
        try {
          const url = await getDownloadURL(itemRef);
          
          // Create a basic file item without metadata for now
          // In a production app, you might want to store file metadata in Firestore
          files.push({
            id: itemRef.name,
            name: itemRef.name,
            size: 0, // We'll need to implement a different way to get file size
            type: 'application/octet-stream', // Default type
            url,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId,
          });
        } catch (error) {
          console.error(`Error getting download URL for ${itemRef.name}:`, error);
        }
      }
      
      return files;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch files');
    }
  }
);

// Async thunk for deleting files
export const deleteFile = createAsyncThunk(
  'files/deleteFile',
  async ({ fileName, userId }: { fileName: string; userId: string }, { rejectWithValue }) => {
    try {
      const storageRef = ref(storage, `files/${userId}/${fileName}`);
      await deleteObject(storageRef);
      return fileName;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Delete failed');
    }
  }
);

const fileSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    clearFiles: (state) => {
      state.files = [];
      state.error = null;
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload file
      .addCase(uploadFile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.files.push(action.payload);
        state.uploadProgress = 100;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.uploadProgress = 0;
      })
      // Fetch files
      .addCase(fetchUserFiles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserFiles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.files = action.payload;
      })
      .addCase(fetchUserFiles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete file
      .addCase(deleteFile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.files = state.files.filter(file => file.name !== action.payload);
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearFiles, setUploadProgress, clearError } = fileSlice.actions;
export default fileSlice.reducer;
