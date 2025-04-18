import { useState, useEffect } from "react";
import { Box, Paper, Typography, CircularProgress } from "@mui/material";
import MaterialsHeader from "../components/MaterialsHeader";
import SearchFilterBar from "../components/SearchFilterBar";
import MaterialsGrid from "../components/MaterialsGrid";
import { Material } from "../types/material";
import materialService from "../services/materialService";

interface FilterState {
  objectTypes: string[];
  materialTypes: string[];
  conditions: string[];
}

const Materials = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    objectTypes: [],
    materialTypes: [],
    conditions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch materials from API
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const data = await materialService.getAllMaterials();
        console.log("Fetched materials:", data);

        if (!data || !Array.isArray(data)) {
          console.error("Invalid materials data format:", data);
          setError("Invalid data format received from server");
          setMaterials([]);
          setFilteredMaterials([]);
          return;
        }

        setMaterials(data);
        setFilteredMaterials(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch materials:", err);
        setError("Failed to load materials. Please try again later.");
        setMaterials([]);
        setFilteredMaterials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  // Filter materials based on search query and filters
  useEffect(() => {
    let result = materials;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (material) =>
          (material.name?.toLowerCase() || "").includes(query) ||
          (material.objectType?.toLowerCase() || "").includes(query) ||
          (material.material?.toLowerCase() || "").includes(query) ||
          (material.condition?.toLowerCase() || "").includes(query)
      );
    }

    // Apply category filters
    if (filters.objectTypes.length > 0) {
      result = result.filter((material) =>
        material.objectType
          ? filters.objectTypes.includes(material.objectType)
          : false
      );
    }

    if (filters.materialTypes.length > 0) {
      result = result.filter((material) =>
        material.material
          ? filters.materialTypes.includes(material.material)
          : false
      );
    }

    if (filters.conditions.length > 0) {
      result = result.filter((material) =>
        material.condition
          ? filters.conditions.includes(material.condition)
          : false
      );
    }

    setFilteredMaterials(result);
  }, [searchQuery, filters, materials]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (newFilters: FilterState) => {
    setFilters(newFilters);
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
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <MaterialsHeader totalCount={filteredMaterials.length} />

      <Paper sx={{ p: 3, mb: 3 }}>
        <SearchFilterBar onSearch={handleSearch} onFilter={handleFilter} />
      </Paper>

      {!Array.isArray(filteredMaterials) ? (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6">Error loading materials data</Typography>
        </Box>
      ) : filteredMaterials.length === 0 ? (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6">
            No materials found matching your criteria
          </Typography>
        </Box>
      ) : (
        <MaterialsGrid materials={filteredMaterials} />
      )}
    </Box>
  );
};

export default Materials;
