import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
  Container,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../services/authService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from location state or default to homepage
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setError("");
      setLoading(true);

      // Call login service
      const success = await authService.login({ email, password });

      if (success) {
        // Setup axios interceptors for future API calls
        authService.setupAxiosInterceptors();

        // Redirect to the page user was trying to access
        navigate(from, { replace: true });
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Authentication failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundImage: 'url("/atvinbackground.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {" "}
          <Card
            sx={{
              width: "100%",
              maxWidth: 450,
              backgroundColor: "rgba(31, 41, 55, 0.85)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h4"
                component="h1"
                align="center"
                gutterBottom
                sx={{ color: "#ffffff" }}
              >
                Material Management System
              </Typography>
              <Typography
                variant="h5"
                component="h2"
                align="center"
                gutterBottom
                sx={{ color: "#ffffff" }}
              >
                Login
              </Typography>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}{" "}
              <Box component="form" onSubmit={handleLogin} noValidate>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!error && !email}
                  InputLabelProps={{
                    style: { color: "rgba(255, 255, 255, 0.7)" },
                  }}
                  InputProps={{
                    style: { color: "#ffffff" },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.7)",
                      },
                    },
                  }}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!error && !password}
                  InputLabelProps={{
                    style: { color: "rgba(255, 255, 255, 0.7)" },
                  }}
                  InputProps={{
                    style: { color: "#ffffff" },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.7)",
                      },
                    },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, py: 1.5 }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "Sign In"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
