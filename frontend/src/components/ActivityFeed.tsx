import { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { Activity } from "../types/material";
import materialService from "../services/materialService";

// Helper function to get icon based on action
const getActionIcon = (action: string) => {
  switch (action.toLowerCase()) {
    case "added":
    case "created":
      return <AddIcon />;
    case "edited":
    case "updated":
      return <EditIcon />;
    case "deleted":
    case "removed":
      return <DeleteIcon />;
    default:
      return <AddIcon />;
  }
};

// Helper function to get color based on action
const getActionColor = (action: string) => {
  switch (action.toLowerCase()) {
    case "added":
    case "created":
      return "#4caf50";
    case "edited":
    case "updated":
      return "#2196f3";
    case "deleted":
    case "removed":
      return "#f44336";
    default:
      return "#4caf50";
  }
};

// Helper function to format date
const formatDate = (dateValue: Date | string): string => {
  if (typeof dateValue === "string") {
    return format(new Date(dateValue), "MMM d, yyyy h:mm a");
  }
  return format(dateValue, "MMM d, yyyy h:mm a");
};

const ActivityFeed = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const data = await materialService.getRecentActivity();
        setActivities(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch activities:", err);
        setError("Failed to load recent activities");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress size={30} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (activities.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>No recent activity found</Typography>
      </Box>
    );
  }

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {activities.map((activity, index) => (
        <Box key={activity.id}>
          {index > 0 && <Divider variant="inset" component="li" />}
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: getActionColor(activity.action) }}>
                {getActionIcon(activity.action)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  component="span"
                  variant="body1"
                  fontWeight="medium"
                >
                  {activity.userName}{" "}
                  <Typography component="span" color="text.secondary">
                    {activity.action} {activity.materialName}
                  </Typography>
                </Typography>
              }
              secondary={
                <>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mt: 1,
                      gap: 1,
                    }}
                  >
                    {activity.details && (
                      <Typography variant="body2" color="text.secondary">
                        {activity.details}
                      </Typography>
                    )}
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                      sx={{ ml: "auto" }}
                    >
                      {formatDate(activity.timestamp)}
                    </Typography>
                  </Box>
                </>
              }
            />
          </ListItem>
        </Box>
      ))}
    </List>
  );
};

export default ActivityFeed;
