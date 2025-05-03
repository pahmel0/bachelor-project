import React from "react";
import { Box, Typography, Grid, Chip, Divider, Paper } from "@mui/material";
import { format } from "date-fns";
import { Material } from "../types/material";

interface MaterialDetailViewProps {
  material: Material;
}

// Helper function to format date
const formatDate = (dateValue: Date | string): string => {
  if (typeof dateValue === "string") {
    return format(new Date(dateValue), "MMM d, yyyy");
  }
  return format(dateValue, "MMM d, yyyy");
};

// Helper function to get fallback image based on material category
const getFallbackImageByType = (
  category: string,
  materialType?: string
): string => {
  // First check by material type if available
  if (materialType) {
    switch (materialType.toUpperCase()) {
      case "DESK":
        return "/desk.jpg";
      case "DOOR":
        return "/door.jpg";
      case "WINDOW":
        return "/window.jpg";
      case "OFFICE_CABINET":
        return "/cabinet.jpg";
      case "DRAWER_UNIT":
        return "/drawerUnit.jpg";
    }
  }

  // Fallback to category if no specific type match
  switch (category.toLowerCase()) {
    case "furniture":
      return "/desk.jpg";
    case "building material":
    case "fixture":
      return "/door.jpg";
    case "decoration":
    case "storage":
      return "/cabinet.jpg";
    case "windows":
      return "/window.jpg";
    default:
      return "/straight_desk.jpg"; // Default fallback image
  }
};

// Helper function to render type-specific details
const renderTypeSpecificDetails = (material: Material): React.ReactNode => {
  const { materialType } = material;

  if (!materialType) return null;

  switch (materialType.toUpperCase()) {
    case "DESK":
      return (
        <>
          <Typography variant="body1" gutterBottom>
            <strong>Desk Type:</strong> {material.deskType || "Not specified"}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Height Adjustable:</strong>{" "}
            {material.heightAdjustable ? "Yes" : "No"}
          </Typography>
          {material.heightAdjustable && material.maximumHeight && (
            <Typography variant="body1" gutterBottom>
              <strong>Maximum Height:</strong> {material.maximumHeight} cm
            </Typography>
          )}
        </>
      );
    case "DOOR":
      return (
        <Typography variant="body1" gutterBottom>
          <strong>Swing Direction:</strong>{" "}
          {material.swingDirection || "Not specified"}
        </Typography>
      );
    case "WINDOW":
      return (
        <>
          <Typography variant="body1" gutterBottom>
            <strong>Opening Type:</strong>{" "}
            {material.openingType || "Not specified"}
          </Typography>
          {material.hingeSide && (
            <Typography variant="body1" gutterBottom>
              <strong>Hinge Side:</strong> {material.hingeSide}
            </Typography>
          )}
          {material.uValue && (
            <Typography variant="body1" gutterBottom>
              <strong>U-Value:</strong> {material.uValue}
            </Typography>
          )}
        </>
      );
    case "OFFICE_CABINET":
      return (
        <Typography variant="body1" gutterBottom>
          <strong>Opening Type:</strong>{" "}
          {material.openingType || "Not specified"}
        </Typography>
      );
    case "DRAWER_UNIT":
      return (
        <Typography variant="body1" gutterBottom>
          <strong>Has Wheels:</strong> {material.hasWheels ? "Yes" : "No"}
        </Typography>
      );
    default:
      return null;
  }
};

const MaterialDetailView: React.FC<MaterialDetailViewProps> = ({
  material,
}) => {
  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              height: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundImage: material.pictures?.[0]?.fileName
                ? `url(${material.pictures[0].fileName})`
                : `url(${getFallbackImageByType(
                    material.category.toLowerCase(),
                    material.materialType
                  )})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundColor: "#f5f5f5",
              position: "relative",
            }}
          >
            {!material.pictures?.[0]?.fileName && (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              ></Box>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="h5" gutterBottom>
              {material.name}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                mb: 2,
              }}
            >
              <Chip label={material.category} color="primary" />
              <Chip label={material.materialType} color="secondary" />
              <Chip
                label={material.condition}
                color={
                  material.condition === "Reusable"
                    ? "success"
                    : material.condition === "Repairable"
                    ? "warning"
                    : "error"
                }
              />
            </Box>

            {/* Basic information */}
            <Typography variant="body1" gutterBottom>
              <strong>Dimensions:</strong> {material.height} cm x{" "}
              {material.width} cm x {material.depth} cm
            </Typography>

            {material.color && (
              <Typography variant="body1" gutterBottom>
                <strong>Color:</strong> {material.color}
              </Typography>
            )}

            {/* Type-specific details section */}
            {renderTypeSpecificDetails(material) && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  {material.materialType} Specific Details
                </Typography>
                {renderTypeSpecificDetails(material)}
              </>
            )}

            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Added on {formatDate(material.dateAdded)}
            </Typography>

            {/* Notes section */}
            {material.notes && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Additional Notes
                </Typography>
                <Typography variant="body2">{material.notes}</Typography>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MaterialDetailView;
