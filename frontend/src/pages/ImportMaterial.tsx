import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Divider,
  Alert,
  Snackbar,
} from "@mui/material";
import FileUploader from "../components/FileUploader";
import ImportForm, { MaterialFormData } from "../components/ImportForm";
import { useNavigate } from "react-router-dom";

const steps = ["Upload Image", "Enter Details", "Review & Submit"];

const ImportMaterial = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<MaterialFormData>({
    name: "",
    objectType: "",
    material: "",
    condition: "",
    dimensions: "",
    notes: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleFormChange = (data: MaterialFormData) => {
    setFormData(data);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSnackbarOpen(true);

      // Reset form after successful submission
      setTimeout(() => {
        navigate("/materials");
      }, 2000);
    }, 1500);
  };

  const isStepValid = () => {
    if (activeStep === 0) {
      return !!selectedFile;
    }

    if (activeStep === 1) {
      return !!(
        formData.name.trim() &&
        formData.objectType &&
        formData.material &&
        formData.condition
      );
    }

    return true;
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ maxWidth: 600, mx: "auto" }}>
            <Typography variant="h6" gutterBottom>
              Upload Material Image
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Please upload a clear image of the material. This will help in
              identification and categorization.
            </Typography>
            <FileUploader onFileSelect={handleFileSelect} />
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Material Details
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Please provide detailed information about the material.
            </Typography>
            <ImportForm onChange={handleFormChange} initialData={formData} />
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Material Information
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Please review the information before submitting.
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: "100%" }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="medium"
                    gutterBottom
                  >
                    Material Image
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {selectedFile && (
                    <Box
                      sx={{
                        height: 200,
                        backgroundColor: "#f5f5f5",
                        borderRadius: 1,
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Material preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </Box>
                  )}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    {selectedFile?.name} (
                    {(selectedFile?.size || 0) / 1024 / 1024 > 0.1
                      ? `${((selectedFile?.size || 0) / 1024 / 1024).toFixed(
                          2
                        )} MB`
                      : `${((selectedFile?.size || 0) / 1024).toFixed(0)} KB`}
                    )
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: "100%" }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="medium"
                    gutterBottom
                  >
                    Material Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Name
                    </Typography>
                    <Typography variant="body1">{formData.name}</Typography>
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        Object Type
                      </Typography>
                      <Typography variant="body1">
                        {formData.objectType}
                      </Typography>
                    </Grid>

                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        Material
                      </Typography>
                      <Typography variant="body1">
                        {formData.material}
                      </Typography>
                    </Grid>

                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        Condition
                      </Typography>
                      <Typography variant="body1">
                        {formData.condition}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Dimensions
                    </Typography>
                    <Typography variant="body1">
                      {formData.dimensions || "Not specified"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Additional Notes
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                      {formData.notes || "None"}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Import New Material
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 2, mb: 4 }}>{getStepContent(activeStep)}</Box>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={!isStepValid() || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={!isStepValid()}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Material successfully imported!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ImportMaterial;
