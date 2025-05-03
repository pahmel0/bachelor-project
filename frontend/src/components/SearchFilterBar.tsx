import { useState } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Menu,
  Divider,
  Button,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

// Filter options - updating to match the actual backend values
const materialTypes = [
  "DESK",
  "WINDOW",
  "DOOR",
  "DRAWER_UNIT",
  "OFFICE_CABINET",
];
const categories = ["Furniture", "Windows", "Doors", "Storage"];
const conditions = ["Reusable", "Repairable", "Damaged"];

interface SearchFilterBarProps {
  onSearch: (query: string) => void;
  onFilter: (filters: FilterState) => void;
}

interface FilterState {
  categories: string[];
  materialTypes: string[];
  conditions: string[];
}

// Helper function to display material types in a readable format
const formatMaterialType = (type: string): string => {
  switch (type) {
    case "OFFICE_CABINET":
      return "Office Cabinet";
    case "DRAWER_UNIT":
      return "Drawer Unit";
    default:
      return type.charAt(0) + type.slice(1).toLowerCase();
  }
};

const SearchFilterBar = ({ onSearch, onFilter }: SearchFilterBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    materialTypes: [],
    conditions: [],
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    onSearch(event.target.value);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleFilterApply = () => {
    onFilter(filters);
    handleFilterClose();
  };

  const handleFilterReset = () => {
    const resetFilters = {
      categories: [],
      materialTypes: [],
      conditions: [],
    };
    setFilters(resetFilters);
    onFilter(resetFilters);
    handleFilterClose();
  };

  const toggleFilter = (type: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const currentFilters = [...prev[type]];
      const index = currentFilters.indexOf(value);

      if (index === -1) {
        currentFilters.push(value);
      } else {
        currentFilters.splice(index, 1);
      }

      return {
        ...prev,
        [type]: currentFilters,
      };
    });
  };

  const removeFilter = (type: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const currentFilters = [...prev[type]];
      const index = currentFilters.indexOf(value);

      if (index !== -1) {
        currentFilters.splice(index, 1);
      }

      return {
        ...prev,
        [type]: currentFilters,
      };
    });

    onFilter({
      ...filters,
      [type]: filters[type].filter((item) => item !== value),
    });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.materialTypes.length > 0 ||
    filters.conditions.length > 0;

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: "flex", mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search materials..."
          value={searchQuery}
          onChange={handleSearchChange}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => {
                    setSearchQuery("");
                    onSearch("");
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mr: 2 }}
        />
        <Button
          variant={hasActiveFilters ? "contained" : "outlined"}
          startIcon={<FilterIcon />}
          onClick={handleFilterClick}
          color={hasActiveFilters ? "primary" : "inherit"}
        >
          Filter
        </Button>
      </Box>

      {/* Active filters display */}
      {hasActiveFilters && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          {filters.categories.map((filter) => (
            <Chip
              key={`category-${filter}`}
              label={filter}
              onDelete={() => removeFilter("categories", filter)}
              color="primary"
              variant="outlined"
            />
          ))}
          {filters.materialTypes.map((filter) => (
            <Chip
              key={`material-${filter}`}
              label={formatMaterialType(filter)}
              onDelete={() => removeFilter("materialTypes", filter)}
              color="secondary"
              variant="outlined"
            />
          ))}
          {filters.conditions.map((filter) => (
            <Chip
              key={`condition-${filter}`}
              label={filter}
              onDelete={() => removeFilter("conditions", filter)}
              color="info"
              variant="outlined"
            />
          ))}
          {hasActiveFilters && (
            <Chip
              label="Clear All"
              onClick={handleFilterReset}
              color="error"
              variant="outlined"
            />
          )}
        </Box>
      )}

      {/* Filter menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleFilterClose}
        PaperProps={{
          sx: { width: 320, maxHeight: 500, p: 2 },
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Box sx={{ fontWeight: "bold", mb: 1 }}>Category</Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() => toggleFilter("categories", category)}
                color={
                  filters.categories.includes(category) ? "primary" : "default"
                }
                variant={
                  filters.categories.includes(category) ? "filled" : "outlined"
                }
              />
            ))}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Box sx={{ fontWeight: "bold", mb: 1 }}>Material Type</Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {materialTypes.map((type) => (
              <Chip
                key={type}
                label={formatMaterialType(type)}
                onClick={() => toggleFilter("materialTypes", type)}
                color={
                  filters.materialTypes.includes(type) ? "secondary" : "default"
                }
                variant={
                  filters.materialTypes.includes(type) ? "filled" : "outlined"
                }
              />
            ))}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Box sx={{ fontWeight: "bold", mb: 1 }}>Condition</Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {conditions.map((condition) => (
              <Chip
                key={condition}
                label={condition}
                onClick={() => toggleFilter("conditions", condition)}
                color={
                  filters.conditions.includes(condition) ? "info" : "default"
                }
                variant={
                  filters.conditions.includes(condition) ? "filled" : "outlined"
                }
              />
            ))}
          </Box>
        </Box>

        <Box
          sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 1 }}
        >
          <Button onClick={handleFilterReset} color="inherit">
            Reset
          </Button>
          <Button
            onClick={handleFilterApply}
            variant="contained"
            color="primary"
          >
            Apply
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default SearchFilterBar;
