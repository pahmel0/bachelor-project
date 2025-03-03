import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  Box,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { format } from "date-fns";

// Mock data for recent activity
const recentActivities = [
  {
    id: 1,
    action: "added",
    user: "John Doe",
    item: "Wooden Chair",
    material: "Wood",
    condition: "Reusable",
    timestamp: new Date(2023, 5, 15, 9, 30),
  },
  {
    id: 2,
    action: "edited",
    user: "Jane Smith",
    item: "Metal Frame",
    material: "Steel",
    condition: "Repairable",
    timestamp: new Date(2023, 5, 14, 14, 45),
  },
  {
    id: 3,
    action: "deleted",
    user: "Mike Johnson",
    item: "Plastic Container",
    material: "Plastic",
    condition: "Damaged",
    timestamp: new Date(2023, 5, 14, 11, 20),
  },
  {
    id: 4,
    action: "viewed",
    user: "Sarah Williams",
    item: "Glass Bottle",
    material: "Glass",
    condition: "Reusable",
    timestamp: new Date(2023, 5, 13, 16, 10),
  },
  {
    id: 5,
    action: "added",
    user: "David Brown",
    item: "Fabric Scraps",
    material: "Textile",
    condition: "Reusable",
    timestamp: new Date(2023, 5, 13, 10, 5),
  },
];

// Helper function to get icon based on action
const getActionIcon = (action: string) => {
  switch (action) {
    case "added":
      return <AddIcon />;
    case "edited":
      return <EditIcon />;
    case "deleted":
      return <DeleteIcon />;
    case "viewed":
      return <ViewIcon />;
    default:
      return <AddIcon />;
  }
};

// Helper function to get color based on action
const getActionColor = (action: string) => {
  switch (action) {
    case "added":
      return "#4caf50";
    case "edited":
      return "#2196f3";
    case "deleted":
      return "#f44336";
    case "viewed":
      return "#9e9e9e";
    default:
      return "#4caf50";
  }
};

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

const ActivityFeed = () => {
  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {recentActivities.map((activity, index) => (
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
                  {activity.user}{" "}
                  <Typography component="span" color="text.secondary">
                    {activity.action} {activity.item}
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
                    <Chip
                      label={activity.material}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={activity.condition}
                      size="small"
                      sx={{
                        backgroundColor: `${getConditionColor(
                          activity.condition
                        )}20`,
                        color: getConditionColor(activity.condition),
                        borderColor: getConditionColor(activity.condition),
                      }}
                    />
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                      sx={{ ml: "auto" }}
                    >
                      {format(activity.timestamp, "MMM d, yyyy h:mm a")}
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
