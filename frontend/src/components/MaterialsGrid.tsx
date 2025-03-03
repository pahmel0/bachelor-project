import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Stack,
  IconButton,
  Grid,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

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
}

interface MaterialsGridProps {
  materials: Material[];
}

// Helper function to get condition color
const getConditionColor = (condition: string) => {
  switch (condition) {
    case "Reusable":
      return "#4caf50";
    case "Repairable":
      return "#ff9800";
    case "Damaged":
      return "#f44336";
    default:
      return "#9e9e9e";
  }
};

const MaterialsGrid = ({ materials }: MaterialsGridProps) => {
  const navigate = useNavigate();

  const handleViewMaterial = (id: number) => {
    navigate(`/materials/${id}`);
  };

  return (
    <Grid container spacing={3}>
      {materials.map((material) => (
        <Grid xs={12} sm={6} md={4} lg={3} key={material.id}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 4,
              },
            }}
          >
            <CardMedia
              component="img"
              height="180"
              image={material.imageUrl}
              alt={material.name}
              sx={{ objectFit: "cover" }}
            />
            <CardContent sx={{ flexGrow: 1, p: 2 }}>
              <Typography variant="h6" component="div" gutterBottom noWrap>
                {material.name}
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                sx={{ mb: 2, flexWrap: "wrap", gap: 0.5 }}
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
                <Chip
                  label={material.condition}
                  size="small"
                  sx={{
                    backgroundColor: `${getConditionColor(
                      material.condition
                    )}20`,
                    color: getConditionColor(material.condition),
                    borderColor: getConditionColor(material.condition),
                  }}
                />
              </Stack>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Dimensions: {material.dimensions}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Added: {material.dateAdded.toLocaleDateString()}
              </Typography>
            </CardContent>

            <Box
              sx={{ display: "flex", justifyContent: "flex-end", p: 1, pt: 0 }}
            >
              <IconButton
                size="small"
                onClick={() => handleViewMaterial(material.id)}
                color="primary"
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => navigate(`/materials/${material.id}/edit`)}
                color="secondary"
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" color="error">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default MaterialsGrid;
