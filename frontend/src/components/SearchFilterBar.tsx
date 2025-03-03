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

// Filter options
const objectTypes = [
  "Furniture",
  "Electronics",
  "Construction",
  "Textile",
  "Plastic",
  "Metal",
  "Glass",
  "Other",
];
const materialTypes = [
  "Wood",
  "Metal",
  "Plastic",
  "Glass",
  "Fabric",
  "Composite",
  "Paper",
  "Other",
];
const conditions = ["Reusable", "Repairable", "Damaged"];

interface SearchFilterBarProps {
  onSearch: (query: string) => void;
  onFilter: (filters: FilterState) => void;
}

interface FilterState {
  objectTypes: string[];
  materialTypes: string[];
  conditions: string[];
}

const SearchFilterBar = ({ onSearch, onFilter }: SearchFilterBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filters, setFilters] = useState<FilterState>({
    objectTypes: [],
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
      objectTypes: [],
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
    filters.objectTypes.length > 0 ||
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
          {filters.objectTypes.map((filter) => (
            <Chip
              key={`object-${filter}`}
              label={filter}
              onDelete={() => removeFilter("objectTypes", filter)}
              color="primary"
              variant="outlined"
            />
          ))}
          {filters.materialTypes.map((filter) => (
            <Chip
              key={`material-${filter}`}
              label={filter}
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
          <Box sx={{ fontWeight: "bold", mb: 1 }}>Object Type</Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {objectTypes.map((type) => (
              <Chip
                key={type}
                label={type}
                onClick={() => toggleFilter("objectTypes", type)}
                color={
                  filters.objectTypes.includes(type) ? "primary" : "default"
                }
                variant={
                  filters.objectTypes.includes(type) ? "filled" : "outlined"
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
                label={type}
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
