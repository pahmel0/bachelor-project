import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  Snackbar,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import {
  FileUpload as FileUploadIcon,
  FileDownload as FileDownloadIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import materialService from "../services/materialService";

const ExcelOperations = () => {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      setSnackbar({
        open: true,
        message: "Please select a file first",
        severity: "error",
      });
      return;
    }

    if (!selectedFile.name.endsWith(".xlsx")) {
      setSnackbar({
        open: true,
        message: "Please select an Excel (.xlsx) file",
        severity: "error",
      });
      return;
    }

    try {
      setImporting(true);
      await materialService.importMaterialsFromExcel(selectedFile);
      setSnackbar({
        open: true,
        message: "Materials successfully imported!",
        severity: "success",
      });
      setSelectedFile(null);
      // Reset the file input
      const fileInput = document.getElementById(
        "excel-file-input"
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error("Import failed:", error);
      setSnackbar({
        open: true,
        message: "Failed to import materials. Please check the file format.",
        severity: "error",
      });
    } finally {
      setImporting(false);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const blob = await materialService.exportMaterialsToExcel();

      // Create a download link and trigger it
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `materials-${new Date().toISOString().split("T")[0]}.xlsx`
      );
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSnackbar({
        open: true,
        message: "Materials successfully exported to Excel!",
        severity: "success",
      });
    } catch (error) {
      console.error("Export failed:", error);
      setSnackbar({
        open: true,
        message: "Failed to export materials to Excel.",
        severity: "error",
      });
    } finally {
      setExporting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Excel Operations
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardMedia
              component="div"
              sx={{
                height: 140,
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FileUploadIcon sx={{ fontSize: 60, color: "white" }} />
            </CardMedia>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Import Materials
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Upload an Excel file (.xlsx) to import materials into the
                system. The Excel file should have the following columns: Name,
                Category, Material Type, Condition, Color, Notes, and dimension
                details.
              </Typography>

              <Box sx={{ my: 3 }}>
                <input
                  accept=".xlsx"
                  style={{ display: "none" }}
                  id="excel-file-input"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="excel-file-input">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<DescriptionIcon />}
                  >
                    Select File
                  </Button>
                </label>
                {selectedFile && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Selected: {selectedFile.name}
                  </Typography>
                )}
              </Box>

              <Button
                variant="contained"
                color="primary"
                startIcon={<FileUploadIcon />}
                onClick={handleImport}
                disabled={!selectedFile || importing}
                fullWidth
              >
                {importing ? (
                  <CircularProgress size={24} />
                ) : (
                  "Import Materials"
                )}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardMedia
              component="div"
              sx={{
                height: 140,
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FileDownloadIcon sx={{ fontSize: 60, color: "white" }} />
            </CardMedia>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Export Materials
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Export all materials in the system to an Excel file (.xlsx). The
                Excel file will include all details for each material including
                dimensions and type-specific properties.
              </Typography>

              <Box sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Click the button below to download all materials as an Excel
                  spreadsheet.
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="primary"
                startIcon={<FileDownloadIcon />}
                onClick={handleExport}
                disabled={exporting}
                fullWidth
              >
                {exporting ? (
                  <CircularProgress size={24} />
                ) : (
                  "Export Materials"
                )}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ExcelOperations;
