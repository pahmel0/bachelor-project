import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
} from "@mui/material";
import { useContext } from "react";
import { ColorModeContext } from "../contexts/ColorModeContext";

const Settings = () => {
  const colorMode = useContext(ColorModeContext);

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Appearance
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <FormControlLabel
            control={
              <Switch
                checked={colorMode.mode === "dark"}
                onChange={colorMode.toggleColorMode}
                color="primary"
              />
            }
            label={
              <Box>
                <Typography variant="body1">Dark Mode</Typography>
                <Typography variant="body2" color="text.secondary">
                  Switch between light and dark theme
                </Typography>
              </Box>
            }
            sx={{
              display: "flex",
              mb: 2,
              "& .MuiFormControlLabel-label": {
                flex: 1,
              },
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Account Settings
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Account settings will appear here in future updates.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Settings;
