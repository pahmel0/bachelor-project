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
              backgroundImage: `url(${material.pictures?.[0]?.fileName})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
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
              <strong>Dimensions:</strong> {material.height} cm x {material.width} cm x {material.depth} cm
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
