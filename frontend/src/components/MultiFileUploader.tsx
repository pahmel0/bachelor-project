import { useState, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  Alert,
  Grid,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";

interface MultiFileUploaderProps {
  onFileSelect: (files: File[]) => void;
  maxFiles?: number;
}

interface FileWithPreview {
  file: File;
  previewUrl: string;
}

const MultiFileUploader = ({
  onFileSelect,
  maxFiles = 5,
}: MultiFileUploaderProps) => {
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files || files.length === 0) {
      return;
    }

    // Check if adding new files would exceed the maximum
    if (selectedFiles.length + files.length > maxFiles) {
      setError(`You can only upload a maximum of ${maxFiles} images`);
      return;
    }

    const newFiles: FileWithPreview[] = [];
    const filePromises: Promise<void>[] = [];

    Array.from(files).forEach((file) => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select image files only (JPEG, PNG, etc.)");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Each file size must not exceed 5MB");
        return;
      }

      // Create preview URL for the file
      const promise = new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          newFiles.push({
            file,
            previewUrl: reader.result as string,
          });
          resolve();
        };
        reader.readAsDataURL(file);
      });

      filePromises.push(promise);
    });

    // Once all file readers have completed
    Promise.all(filePromises).then(() => {
      if (newFiles.length > 0) {
        const updatedFiles = [...selectedFiles, ...newFiles];
        setSelectedFiles(updatedFiles);
        onFileSelect(updatedFiles.map((f) => f.file));
        setError(null);
      }
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    onFileSelect(updatedFiles.map((f) => f.file));
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveAll = () => {
    setSelectedFiles([]);
    onFileSelect([]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Box>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: "none" }}
        multiple
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {selectedFiles.length === 0 ? (
        <Paper
          sx={{
            border: "2px dashed #ccc",
            p: 4,
            textAlign: "center",
            backgroundColor: "rgba(0, 0, 0, 0.02)",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
          onClick={handleButtonClick}
        >
          <CloudUploadIcon
            sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
          />
          <Typography variant="h6" gutterBottom>
            Upload Images
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Click to select image files (max {maxFiles})
          </Typography>
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUploadIcon />}
            sx={{ mt: 2 }}
          >
            Select Files
          </Button>
        </Paper>
      ) : (
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="medium">
              Selected Images ({selectedFiles.length}/{maxFiles})
            </Typography>
            <Box>
              <Button
                size="small"
                onClick={handleButtonClick}
                startIcon={<AddIcon />}
                sx={{ mr: 1 }}
                disabled={selectedFiles.length >= maxFiles}
              >
                Add More
              </Button>
              <Button size="small" color="error" onClick={handleRemoveAll}>
                Remove All
              </Button>
            </Box>
          </Box>

          <Grid container spacing={2}>
            {selectedFiles.map((fileWithPreview, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper sx={{ p: 2, height: "100%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" noWrap sx={{ maxWidth: "80%" }}>
                      {fileWithPreview.file.name}
                    </Typography>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveFile(index)}
                      aria-label="Remove file"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Box
                    sx={{
                      position: "relative",
                      height: 120,
                      backgroundColor: "#f5f5f5",
                      borderRadius: 1,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={fileWithPreview.previewUrl}
                      alt={`Preview ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </Box>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, display: "block" }}
                  >
                    {(fileWithPreview.file.size / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default MultiFileUploader;
