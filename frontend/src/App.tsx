import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme, PaletteMode } from "@mui/material";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Materials from "./pages/Materials";
import ImportMaterial from "./pages/ImportMaterial";
import MaterialDetail from "./pages/MaterialDetail";
import Login from "./pages/Login";
import ExcelOperations from "./pages/ExcelOperations";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect, useState, useMemo } from "react";
import authService from "./services/authService";
import { ColorModeContext } from "./contexts/ColorModeContext";

function App() {
  // Get the user's theme preference or use 'light' as default
  const [mode, setMode] = useState<PaletteMode>(() => {
    const savedMode = localStorage.getItem("themeMode");
    return savedMode === "dark" ? "dark" : "light";
  });

  // Save theme preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  // Theme toggle function
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
      mode,
    }),
    [mode]
  );

  // Create MUI theme based on the selected mode
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#2196f3",
            light: "#64b5f6",
            dark: "#1976d2",
            contrastText: "#ffffff",
          },
          background: {
            default: mode === "light" ? "#f5f5f5" : "#121212",
            paper: mode === "light" ? "#ffffff" : "#1e1e1e",
          },
        },
        typography: {
          h1: {
            fontSize: "2.5rem",
            fontWeight: 600,
          },
          h2: {
            fontSize: "2rem",
            fontWeight: 600,
          },
          h3: {
            fontSize: "1.75rem",
            fontWeight: 600,
          },
          h4: {
            fontSize: "1.5rem",
            fontWeight: 600,
          },
          h5: {
            fontSize: "1.25rem",
            fontWeight: 600,
          },
          h6: {
            fontSize: "1rem",
            fontWeight: 600,
          },
        },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                boxShadow:
                  mode === "light"
                    ? "0 4px 12px rgba(0,0,0,0.05)"
                    : "0 4px 12px rgba(0,0,0,0.2)",
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 8,
              },
            },
          },
        },
      }),
    [mode]
  );

  // Setup axios interceptors for JWT token
  useEffect(() => {
    authService.setupAxiosInterceptors();
  }, []);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            {/* Public route for login */}
            <Route path="/login" element={<Login />} />
            {/* Protected routes with Layout */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Home />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/materials"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Materials />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/materials/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MaterialDetail />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/import"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ImportMaterial />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/excelOperations"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ExcelOperations />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              }
            />
            {/* Redirect any unknown routes to the homepage */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
