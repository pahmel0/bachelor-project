import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
  Grid,
  CardActionArea,
  CardActions,
  Button,
} from "@mui/material";

// Mock data interface
export interface Material {
  id: number;
  name: string;
  imageUrl: string;
  objectType: string;
  material: string;
  condition: string;
  dateAdded: Date;
  dimensions: string;
  notes?: string;
}

interface MaterialsGridProps {
  materials: Material[];
}

const MaterialsGrid: React.FC<MaterialsGridProps> = ({ materials }) => {
  const navigate = useNavigate();

  const handleViewDetails = (id: number) => {
    navigate(`/materials/${id}`);
  };

  return (
    <Grid container spacing={3}>
      {materials.map((material) => (
        <Grid item key={material.id} xs={12} sm={6} md={4} lg={3}>
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
            <CardActionArea onClick={() => handleViewDetails(material.id)}>
              <CardMedia
                component="img"
                height="140"
                image={material.imageUrl}
                alt={material.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div" noWrap>
                  {material.name}
                </Typography>
                <Box
                  sx={{ mb: 1, display: "flex", gap: 0.5, flexWrap: "wrap" }}
                >
                  <Chip
                    label={material.objectType}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label={material.material}
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Dimensions: {material.dimensions}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails(material.id);
                }}
              >
                View Details
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default MaterialsGrid;
