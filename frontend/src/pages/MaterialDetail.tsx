import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  Tab,
  Tabs,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as DuplicateIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { Material } from "../components/MaterialsGrid";
import MaterialDetailView from "../components/MaterialDetailView";
import EditMaterialForm from "../components/EditMaterialForm";

// Mock data for a single material
const mockMaterial: Material = {
  id: 1,
  name: "Wooden Chair",
  imageUrl: "https://images.unsplash.com/photo-1503602642458-232111445657",
  objectType: "Furniture",
  material: "Wood",
  condition: "Reusable",
  dateAdded: new Date(2023, 4, 15),
  dimensions: "45 x 45 x 90 cm",
};

// Mock audit history
const mockAuditHistory = [
  {
    id: 1,
    action: "created",
    user: "John Doe",
    timestamp: new Date(2023, 4, 15, 10, 30),
    details: "Material was added to the system",
  },
  {
    id: 2,
    action: "edited",
    user: "Jane Smith",
    timestamp: new Date(2023, 4, 16, 14, 45),
    details: 'Changed condition from "Damaged" to "Reusable"',
  },
  {
    id: 3,
    action: "viewed",
    user: "Mike Johnson",
    timestamp: new Date(2023, 4, 18, 9, 15),
    details: "Material details were viewed",
  },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`material-tabpanel-${index}`}
      aria-labelledby={`material-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const MaterialDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [material, setMaterial] = useState<Material | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  // Fetch material data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMaterial(mockMaterial);
      setIsLoading(false);
    }, 500);
  }, [id]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (updatedMaterial: Material) => {
    // Simulate API call to update material
    setTimeout(() => {
      setMaterial(updatedMaterial);
      setIsEditing(false);
      setSnackbarMessage("Material updated successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    }, 500);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // Simulate API call to delete material
    setTimeout(() => {
      setDeleteDialogOpen(false);
      setSnackbarMessage("Material deleted successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Navigate back to materials list after a short delay
      setTimeout(() => {
        navigate("/materials");
      }, 1500);
    }, 500);
  };

  const handleDuplicate = () => {
    // Simulate API call to duplicate material
    setTimeout(() => {
      setSnackbarMessage("Material duplicated successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    }, 500);
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading material details...</Typography>
      </Box>
    );
  }

  if (!material) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Material not found</Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/materials")}
          sx={{ mt: 2 }}
        >
          Back to Materials
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header with actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={() => navigate("/materials")}
            sx={{ mr: 1 }}
            aria-label="Back to materials"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            Material Details
          </Typography>
        </Box>

        <Box>
          {!isEditing && (
            <>
              <Button
                startIcon={<EditIcon />}
                variant="outlined"
                onClick={handleEdit}
                sx={{ mr: 1 }}
              >
                Edit
              </Button>
              <Button
                startIcon={<DuplicateIcon />}
                variant="outlined"
                onClick={handleDuplicate}
                sx={{ mr: 1 }}
              >
                Duplicate
              </Button>
              <Button
                startIcon={<DeleteIcon />}
                variant="outlined"
                color="error"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* Main content */}
      <Paper sx={{ p: 3, mb: 3 }}>
        {isEditing ? (
          <EditMaterialForm
            material={material}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="material tabs"
              >
                <Tab
                  label="Details"
                  id="material-tab-0"
                  aria-controls="material-tabpanel-0"
                />
                <Tab
                  label="Audit History"
                  id="material-tab-1"
                  aria-controls="material-tabpanel-1"
                />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <MaterialDetailView material={material} />
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6" gutterBottom>
                Audit History
              </Typography>
              <Box sx={{ mt: 2 }}>
                {mockAuditHistory.map((entry) => (
                  <Paper key={entry.id} sx={{ p: 2, mb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="medium">
                        {entry.action.charAt(0).toUpperCase() +
                          entry.action.slice(1)}{" "}
                        by {entry.user}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {entry.timestamp.toLocaleString()}
                      </Typography>
                    </Box>
                    <Typography variant="body2">{entry.details}</Typography>
                  </Paper>
                ))}
              </Box>
            </TabPanel>
          </>
        )}
      </Paper>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete Material</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete "{material.name}"? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MaterialDetail;
