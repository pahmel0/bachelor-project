import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Paper,
  Divider,
  useTheme,
} from "@mui/material";
import {
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  Recycling as RecyclingIcon,
  Build as BuildIcon,
} from "@mui/icons-material";
import ActivityFeed from "../components/ActivityFeed";

// Mock data for dashboard metrics
const dashboardMetrics = [
  {
    title: "Total Materials",
    value: 1248,
    icon: <InventoryIcon fontSize="large" />,
    color: "#2196f3",
  },
  {
    title: "Damaged Items",
    value: 156,
    icon: <WarningIcon fontSize="large" />,
    color: "#f44336",
  },
  {
    title: "Reusable Items",
    value: 892,
    icon: <RecyclingIcon fontSize="large" />,
    color: "#4caf50",
  },
  {
    title: "Repairable Items",
    value: 200,
    icon: <BuildIcon fontSize="large" />,
    color: "#ff9800",
  },
];

const Home = () => {
  const theme = useTheme();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Metric Cards */}
        {dashboardMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: "100%",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: theme.shadows[10],
                },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: `${metric.color}20`,
                    color: metric.color,
                    borderRadius: "50%",
                    p: 2,
                    mb: 2,
                  }}
                >
                  {metric.icon}
                </Box>
                <Typography
                  variant="h3"
                  component="div"
                  sx={{ fontWeight: "bold" }}
                >
                  {metric.value}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {metric.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Activity Feed */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Recent Activity
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <ActivityFeed />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
