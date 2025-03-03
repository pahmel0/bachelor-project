import React from "react";
import { Box, Typography, Grid, Chip, Divider, Paper } from "@mui/material";
import { Material } from "./MaterialsGrid";

interface MaterialDetailViewProps {
  material: Material;
}

const MaterialDetailView: React.FC<MaterialDetailViewProps> = ({
  material,
}) => {
  return (
    <Box>
      <Grid container spacing={4}>
        {/* Left column - Image */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              width: "100%",
              height: 300,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
              mb: 2,
            }}
          >
            <img
              src={material.imageUrl}
              alt={material.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Paper>

          <Typography variant="caption" color="text.secondary" display="block">
            Added on {material.dateAdded.toLocaleDateString()}
          </Typography>
        </Grid>

        {/* Right column - Details */}
        <Grid item xs={12} md={8}>
          <Typography variant="h5" component="h2" gutterBottom>
            {material.name}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Grid container spacing={1}>
              <Grid item>
                <Chip
                  label={material.objectType}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item>
                <Chip
                  label={material.material}
                  color="secondary"
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item>
                <Chip
                  label={material.condition}
                  color="default"
                  variant="outlined"
                  size="small"
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Dimensions
              </Typography>
              <Typography variant="body1" gutterBottom>
                {material.dimensions}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Material Type
              </Typography>
              <Typography variant="body1" gutterBottom>
                {material.material}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Object Type
              </Typography>
              <Typography variant="body1" gutterBottom>
                {material.objectType}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Condition
              </Typography>
              <Typography variant="body1" gutterBottom>
                {material.condition}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Additional Notes
            </Typography>
            <Typography variant="body1">
              {material.notes || "No additional notes provided."}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MaterialDetailView;
