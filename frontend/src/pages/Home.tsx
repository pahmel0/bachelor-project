import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Paper,
  Divider,
  useTheme,
  CircularProgress,
} from "@mui/material";
import {
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  Recycling as RecyclingIcon,
  Build as BuildIcon,
} from "@mui/icons-material";
import ActivityFeed from "../components/ActivityFeed";
import materialService from "../services/materialService";
import { MaterialStats } from "../types/material";

const Home = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<MaterialStats | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const statsData = await materialService.getMaterialStats();
        setStats(statsData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Default metrics template
  const getDashboardMetrics = () => {
    if (!stats) return [];

    const reusableCount = stats.conditionCounts["Reusable"] || 0;
    const repairableCount = stats.conditionCounts["Repairable"] || 0;
    const damagedCount = stats.conditionCounts["Damaged"] || 0;

    return [
      {
        title: "Total Materials",
        value: stats.totalCount,
        icon: <InventoryIcon fontSize="large" />,
        color: "#2196f3",
      },
      {
        title: "Damaged Items",
        value: damagedCount,
        icon: <WarningIcon fontSize="large" />,
        color: "#f44336",
      },
      {
        title: "Reusable Items",
        value: reusableCount,
        icon: <RecyclingIcon fontSize="large" />,
        color: "#4caf50",
      },
      {
        title: "Repairable Items",
        value: repairableCount,
        icon: <BuildIcon fontSize="large" />,
        color: "#ff9800",
      },
    ];
  };

  if (loading) {
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

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  const dashboardMetrics = getDashboardMetrics();

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
