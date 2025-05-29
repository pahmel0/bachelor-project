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
import MultiFileUploader from "../components/MultiFileUploader";
import ImportForm, { MaterialFormData } from "../components/ImportForm";
import { useNavigate } from "react-router-dom";
import materialService from "../services/materialService";

const steps = ["Upload Images", "Enter Details", "Review & Submit"];

// Helper function to get the display label for a material type
const objectTypeLabel = (materialType: string): string => {
  const typeMap: Record<string, string> = {
    DESK: "Desk",
    DOOR: "Door",
    WINDOW: "Window",
    OFFICE_CABINET: "Office Cabinet",
    DRAWER_UNIT: "Drawer Unit",
  };
  return typeMap[materialType] || materialType;
};

const ImportMaterial = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState<MaterialFormData>({
    name: "",
    materialType: "",
    category: "",
    condition: "",
    notes: "",
    color: "",
  });

  // Helper function to display type-specific details in the review step
  const getTypeSpecificDetails = (): string => {
    if (!formData.materialType) return "";

    switch (formData.materialType) {
      case "DESK":
        return `Desk Type: ${formData.deskType || "Not specified"}
${
  formData.heightAdjustable ? "Height Adjustable: Yes" : "Height Adjustable: No"
}
${
  formData.maximumHeight ? `Maximum Height: ${formData.maximumHeight} cm` : ""
}`;

      case "WINDOW":
        return `Opening Type: ${formData.openingType || "Not specified"}
${formData.hingeSide ? `Hinge Side: ${formData.hingeSide}` : ""}
${formData.uValue ? `U-Value: ${formData.uValue}` : ""}`;

      case "DOOR":
        return `Swing Direction: ${formData.swingDirection || "Not specified"}
${formData.uValue ? `U-Value: ${formData.uValue}` : ""}`;

      case "OFFICE_CABINET":
        return `Opening Type: ${formData.openingType || "Not specified"}`;

      case "DRAWER_UNIT":
        return `Has Wheels: ${formData.hasWheels ? "Yes" : "No"}`;

      default:
        return "No specific details available";
    }
  };
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleFileSelect = (files: File[]) => {
    setSelectedFiles(files);
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
  const handleSubmit = async () => {
    if (selectedFiles.length === 0 || !formData) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create material data object
      const materialData = {
        name: formData.name,
        materialType: formData.materialType,
        category: formData.category,
        materialCondition: formData.condition, // Map condition to materialCondition for backend
        notes: formData.notes,
        color: formData.color,
        // Add dimensions
        width: formData.width,
        height: formData.height,
        depth: formData.depth,
        // Add type-specific properties
        ...(formData.deskType && { deskType: formData.deskType }),
        ...(formData.heightAdjustable !== undefined && {
          heightAdjustable: formData.heightAdjustable,
        }),
        ...(formData.maximumHeight && {
          maximumHeight: formData.maximumHeight,
        }),
        ...(formData.openingType && { openingType: formData.openingType }),
        ...(formData.hingeSide && { hingeSide: formData.hingeSide }),
        ...(formData.swingDirection && {
          swingDirection: formData.swingDirection,
        }),
        ...(formData.uValue && { uValue: formData.uValue }),
        ...(formData.hasWheels !== undefined && {
          hasWheels: formData.hasWheels,
        }),
      };

      // Use the material service to create the material with pictures
      await materialService.createMaterialWithPictures(
        materialData,
        selectedFiles
      );

      setIsSubmitting(false);
      setSnackbarOpen(true);

      // Reset form after successful submission
      setTimeout(() => {
        navigate("/materials");
      }, 2000);
    } catch (error) {
      console.error("Error creating material:", error);
      setIsSubmitting(false);
      // You could add error handling here (like showing an error message)
    }
  };
  const isStepValid = () => {
    if (activeStep === 0) {
      return selectedFiles.length > 0;
    }

    if (activeStep === 1) {
      // Basic validation for required fields
      const basicFieldsValid = !!(
        formData.name.trim() &&
        formData.materialType &&
        formData.category &&
        formData.condition &&
        formData.color
      );

      if (!basicFieldsValid) return false;

      // Check dimensions
      if (!formData.width || !formData.height) {
        return false;
      }

      // Type-specific validation
      switch (formData.materialType) {
        case "DESK":
          return !!formData.deskType && !!formData.depth;
        case "WINDOW":
          return !!formData.openingType && !!formData.depth;
        case "DOOR":
          return !!formData.swingDirection && !!formData.depth;
        case "OFFICE_CABINET":
          return !!formData.openingType && !!formData.depth;
        case "DRAWER_UNIT":
          return !!formData.depth;
        default:
          return true;
      }
    }

    return true;
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ maxWidth: 800, mx: "auto" }}>
            <Typography variant="h6" gutterBottom>
              Upload Material Images
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Please upload clear images of the material. You can upload
              multiple images to show different angles or details.
            </Typography>
            <MultiFileUploader onFileSelect={handleFileSelect} maxFiles={5} />
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
                {" "}
                <Paper sx={{ p: 2, height: "100%" }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="medium"
                    gutterBottom
                  >
                    Material Images
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {selectedFiles.length > 0 ? (
                    <Box>
                      <Grid container spacing={1}>
                        {selectedFiles.map((file, index) => (
                          <Grid item xs={6} key={index}>
                            <Box
                              sx={{
                                height: 100,
                                backgroundColor: "#f5f5f5",
                                borderRadius: 1,
                                overflow: "hidden",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mb: 1,
                              }}
                            >
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Material preview ${index + 1}`}
                                style={{
                                  maxWidth: "100%",
                                  maxHeight: "100%",
                                  objectFit: "contain",
                                }}
                              />
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        {selectedFiles.length}{" "}
                        {selectedFiles.length === 1 ? "image" : "images"}{" "}
                        selected
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No images selected
                    </Typography>
                  )}
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
                        Material Type
                      </Typography>
                      <Typography variant="body1">
                        {formData.materialType
                          ? objectTypeLabel(formData.materialType)
                          : ""}
                      </Typography>
                    </Grid>

                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        Category
                      </Typography>
                      <Typography variant="body1">
                        {formData.category}
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
                      Color
                    </Typography>
                    <Typography variant="body1">{formData.color}</Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Dimensions
                    </Typography>
                    <Typography variant="body1">
                      {formData.width && formData.height
                        ? `Width: ${formData.width} cm × Height: ${
                            formData.height
                          } cm${
                            formData.depth
                              ? ` × Depth: ${formData.depth} cm`
                              : ""
                          }`
                        : "Not specified"}
                    </Typography>
                  </Box>

                  {/* Type-specific details */}
                  {formData.materialType && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {objectTypeLabel(formData.materialType)} Specific
                        Details
                      </Typography>
                      <Typography variant="body1">
                        {getTypeSpecificDetails()}
                      </Typography>
                    </Box>
                  )}

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
