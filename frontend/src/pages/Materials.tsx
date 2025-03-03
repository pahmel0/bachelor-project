import { useState, useEffect } from "react";
import { Box, Paper } from "@mui/material";
import MaterialsHeader from "../components/MaterialsHeader";
import SearchFilterBar from "../components/SearchFilterBar";
import MaterialsGrid, { Material } from "../components/MaterialsGrid";

// Mock data for materials
const mockMaterials: Material[] = [
  {
    id: 1,
    name: "Wooden Chair",
    imageUrl: "https://images.unsplash.com/photo-1503602642458-232111445657",
    objectType: "Furniture",
    material: "Wood",
    condition: "Reusable",
    dateAdded: new Date(2023, 4, 15),
    dimensions: "45 x 45 x 90 cm",
  },
  {
    id: 2,
    name: "Metal Frame",
    imageUrl: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990",
    objectType: "Construction",
    material: "Metal",
    condition: "Repairable",
    dateAdded: new Date(2023, 4, 10),
    dimensions: "120 x 80 x 5 cm",
  },
  {
    id: 3,
    name: "Plastic Container",
    imageUrl: "https://images.unsplash.com/photo-1610024062303-e355e94c7a8c",
    objectType: "Storage",
    material: "Plastic",
    condition: "Damaged",
    dateAdded: new Date(2023, 4, 5),
    dimensions: "30 x 20 x 15 cm",
  },
  {
    id: 4,
    name: "Glass Bottle",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8",
    objectType: "Container",
    material: "Glass",
    condition: "Reusable",
    dateAdded: new Date(2023, 3, 28),
    dimensions: "10 x 10 x 30 cm",
  },
  {
    id: 5,
    name: "Fabric Scraps",
    imageUrl: "https://images.unsplash.com/photo-1617688893819-8531393842f5",
    objectType: "Textile",
    material: "Fabric",
    condition: "Reusable",
    dateAdded: new Date(2023, 3, 20),
    dimensions: "Various",
  },
  {
    id: 6,
    name: "Broken Laptop",
    imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed",
    objectType: "Electronics",
    material: "Composite",
    condition: "Damaged",
    dateAdded: new Date(2023, 3, 15),
    dimensions: "35 x 25 x 2 cm",
  },
  {
    id: 7,
    name: "Wooden Pallet",
    imageUrl: "https://images.unsplash.com/photo-1598017268946-bdf7f7d8e7d3",
    objectType: "Construction",
    material: "Wood",
    condition: "Repairable",
    dateAdded: new Date(2023, 3, 10),
    dimensions: "120 x 80 x 15 cm",
  },
  {
    id: 8,
    name: "Metal Pipes",
    imageUrl: "https://images.unsplash.com/photo-1617791160505-6f00504e3519",
    objectType: "Construction",
    material: "Metal",
    condition: "Reusable",
    dateAdded: new Date(2023, 3, 5),
    dimensions: "Various lengths, 5 cm diameter",
  },
];

interface FilterState {
  objectTypes: string[];
  materialTypes: string[];
  conditions: string[];
}

const Materials = () => {
  const [materials] = useState<Material[]>(mockMaterials);
  const [filteredMaterials, setFilteredMaterials] =
    useState<Material[]>(mockMaterials);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    objectTypes: [],
    materialTypes: [],
    conditions: [],
  });

  // Filter materials based on search query and filters
  useEffect(() => {
    let result = materials;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (material) =>
          material.name.toLowerCase().includes(query) ||
          material.objectType.toLowerCase().includes(query) ||
          material.material.toLowerCase().includes(query) ||
          material.condition.toLowerCase().includes(query)
      );
    }

    // Apply category filters
    if (filters.objectTypes.length > 0) {
      result = result.filter((material) =>
        filters.objectTypes.includes(material.objectType)
      );
    }

    if (filters.materialTypes.length > 0) {
      result = result.filter((material) =>
        filters.materialTypes.includes(material.material)
      );
    }

    if (filters.conditions.length > 0) {
      result = result.filter((material) =>
        filters.conditions.includes(material.condition)
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

  return (
    <Box>
      <MaterialsHeader totalCount={filteredMaterials.length} />

      <Paper sx={{ p: 3, mb: 3 }}>
        <SearchFilterBar onSearch={handleSearch} onFilter={handleFilter} />
      </Paper>

      <MaterialsGrid materials={filteredMaterials} />
    </Box>
  );
};

export default Materials;
