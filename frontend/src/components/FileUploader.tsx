import { useState, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  Alert,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

interface FileUploaderProps {
  onFileSelect: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPEG, PNG, etc.)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit");
      return;
    }

    setError(null);
    setSelectedFile(file);
    onFileSelect(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onFileSelect(null);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!selectedFile ? (
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
            Upload Image
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Click to select an image file
          </Typography>
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUploadIcon />}
            sx={{ mt: 2 }}
          >
            Select File
          </Button>
        </Paper>
      ) : (
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="subtitle1" fontWeight="medium">
              Selected Image
            </Typography>
            <IconButton
              size="small"
              color="error"
              onClick={handleRemoveFile}
              aria-label="Remove file"
            >
              <DeleteIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              mt: 1,
              position: "relative",
              height: 200,
              backgroundColor: "#f5f5f5",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            )}
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
            MB)
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default FileUploader;
