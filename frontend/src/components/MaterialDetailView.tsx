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
            <Typography variant="body1" gutterBottom>
              <strong>Dimensions:</strong> {material.height} cm x{" "}
              {material.width} cm x {material.depth} cm
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Added on {formatDate(material.dateAdded)}
            </Typography>
            {material.notes && (
              <>
                <Divider sx={{ my: 2 }} />
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
