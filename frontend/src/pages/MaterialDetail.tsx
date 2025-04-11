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
  CircularProgress,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as DuplicateIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import MaterialDetailView from "../components/MaterialDetailView";
import EditMaterialForm from "../components/EditMaterialForm";
import { Material, Activity } from "../types/material";
import materialService from "../services/materialService";

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
  const [auditHistory, setAuditHistory] = useState<Activity[]>([]);
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
    if (!id) return;

    const fetchMaterialData = async () => {
      try {
        setIsLoading(true);
        const materialId = parseInt(id);
        const materialData = await materialService.getMaterial(materialId);
        setMaterial(materialData);

        // Fetch activity history related to this material
        try {
          const activityData = await materialService.getRecentActivity();
          // Filter activities related to this material
          const materialActivities = activityData.filter(
            (activity) => activity.materialId === materialId
          );
          setAuditHistory(materialActivities);
        } catch (activityError) {
          console.error("Failed to fetch activity history:", activityError);
        }
      } catch (err) {
        console.error(`Failed to fetch material ${id}:`, err);
        setSnackbarMessage("Failed to load material details");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaterialData();
  }, [id]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (updatedMaterial: Material) => {
    try {
      setIsLoading(true);
      if (!id) return;

      await materialService.updateMaterial(parseInt(id), updatedMaterial);
      setMaterial(updatedMaterial);
      setIsEditing(false);
      setSnackbarMessage("Material updated successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Failed to update material:", err);
      setSnackbarMessage("Failed to update material");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setIsLoading(true);
      if (!id) return;

      await materialService.deleteMaterial(parseInt(id));
      setDeleteDialogOpen(false);
      setSnackbarMessage("Material deleted successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Navigate back to materials list after a short delay
      setTimeout(() => {
        navigate("/materials");
      }, 1500);
    } catch (err) {
      console.error("Failed to delete material:", err);
      setDeleteDialogOpen(false);
      setSnackbarMessage("Failed to delete material");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDuplicate = async () => {
    try {
      setIsLoading(true);
      if (!material) return;

      // Create a copy of the material without the ID
      const newMaterial = {
        ...material,
        id: undefined, // This will be assigned by the backend
        name: `${material.name} (Copy)`,
      };

      // Remove the id property before sending to API
      delete newMaterial.id;

      await materialService.createMaterial(newMaterial);
      setSnackbarMessage("Material duplicated successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Failed to duplicate material:", err);
      setSnackbarMessage("Failed to duplicate material");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
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
            {material.name}
          </Typography>
        </Box>
        <Box>
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
        </Box>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Details" />
          <Tab label="Audit History" />
        </Tabs>

        {/* Tab Contents */}
        <TabPanel value={tabValue} index={0}>
          {isEditing ? (
            <EditMaterialForm
              material={material}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          ) : (
            <MaterialDetailView material={material} />
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {auditHistory.length === 0 ? (
            <Typography>No audit history available</Typography>
          ) : (
            <Box>
              {auditHistory.map((entry) => (
                <Paper
                  key={entry.id}
                  sx={{ p: 2, mb: 2, display: "flex", alignItems: "center" }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1">
                      {entry.action} by {entry.userName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {entry.details}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {typeof entry.timestamp === "string"
                      ? new Date(entry.timestamp).toLocaleString()
                      : entry.timestamp.toLocaleString()}
                  </Typography>
                </Paper>
              ))}
            </Box>
          )}
        </TabPanel>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this material? This action cannot be
            undone.
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
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MaterialDetail;
