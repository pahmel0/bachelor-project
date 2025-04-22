import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
  CardActionArea,
  CardActions,
  Button,
  Grid,
} from "@mui/material";
import { Material } from "../types/material";
import { format } from "date-fns";

interface MaterialsGridProps {
  materials: Material[];
}

const MaterialsGrid: React.FC<MaterialsGridProps> = ({ materials }) => {
  const navigate = useNavigate();

  const handleViewDetails = (id?: number) => {
    if (id !== undefined) {
      navigate(`/materials/${id}`);
    }
  };

  // Helper function to format date from string or Date object
  const formatDate = (dateValue: Date | string | null | undefined): string => {
    if (!dateValue) {
      return "Unknown date";
    }
    try {
      if (typeof dateValue === "string") {
        return format(new Date(dateValue), "MMM d, yyyy");
      }
      return format(dateValue, "MMM d, yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  return (
    <Grid container spacing={3}>
      {Array.isArray(materials) && materials.length > 0 ? (
        materials.map((material) => (
          <Grid
            item
            key={material?.id ?? Math.random()}
            xs={12}
            sm={6}
            md={4}
            lg={3}
          >
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardActionArea onClick={() => handleViewDetails(material?.id)}>
                <CardMedia
                  component="img"
                  height="140"
                  image={
                    material.pictures && material.pictures.length > 0
                      ? `/api/materials/pictures/${
                          material.pictures.find((p) => p.isPrimary)?.id ||
                          material.pictures[0].id
                        }`
                      : "/placeholder-image.png"
                  }
                  alt={material.name}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; // prevent infinite loop
                    target.src = "/placeholder-image.png";
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div" noWrap>
                    {material.name}
                  </Typography>
                  <Box
                    sx={{ mb: 1, display: "flex", gap: 0.5, flexWrap: "wrap" }}
                  >
                    <Chip
                      label={material.category}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={material.materialType}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Dimensions:{" "}
                    {material.height && material.width
                      ? `${material.height} × ${material.width}${
                          material.depth ? ` × ${material.depth}` : ""
                        } cm`
                      : "Not specified"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Added: {formatDate(material.dateAdded)}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(material?.id);
                  }}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <Typography variant="body1" align="center">
            No materials found.
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default MaterialsGrid;
