import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  SelectChangeEvent,
} from "@mui/material";
import { Material } from "../types/material";

interface EditMaterialFormProps {
  material: Material;
  onSave: (material: Material) => void;
  onCancel: () => void;
}

// Options for dropdown menus
const categoryOptions = ["Furniture", "Windows", "Doors", "Storage"];

const materialTypeOptions = [
  "DESK",
  "WINDOW",
  "DOOR",
  "DRAWER_UNIT",
  "OFFICE_CABINET",
];

const conditionOptions = ["Reusable", "Repairable", "Damaged"];

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

const EditMaterialForm: React.FC<EditMaterialFormProps> = ({
  material,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Material & { notes?: string }>({
    ...material,
    notes: material.notes || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string) => {
    if (!value.trim()) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }
    return "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Handle numeric inputs
    if (["width", "height", "depth"].includes(name)) {
      setFormData({
        ...formData,
        [name]: value === "" ? undefined : Number(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Validate required fields
    if (["name", "width", "height"].includes(name)) {
      const error = validateField(name, value as string);
      setErrors({
        ...errors,
        [name]: error,
      });
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Validate required fields
    if (["category", "materialType", "condition"].includes(name)) {
      const error = validateField(name, value as string);
      setErrors({
        ...errors,
        [name]: error,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all required fields
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    [
      "name",
      "category",
      "materialType",
      "condition",
      "width",
      "height",
    ].forEach((field) => {
      const error = validateField(
        field,
        String(formData[field as keyof Material] || "")
      );
      if (error) {
        newErrors[field] = error;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    // Submit the form
    onSave(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h6" gutterBottom>
        Edit Material
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Material Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name || ""}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required error={!!errors.category}>
            <InputLabel id="object-type-label">Category</InputLabel>
            <Select
              labelId="object-type-label"
              name="category"
              value={formData.category || ""}
              label="Category"
              onChange={handleSelectChange}
            >
              {categoryOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {errors.category && (
              <FormHelperText>{errors.category}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required error={!!errors.materialType}>
            <InputLabel id="material-type-label">Material Type</InputLabel>
            <Select
              labelId="material-type-label"
              name="materialType"
              value={formData.materialType || ""}
              label="Material Type"
              onChange={handleSelectChange}
            >
              {materialTypeOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {formatMaterialType(option)}
                </MenuItem>
              ))}
            </Select>
            {errors.materialType && (
              <FormHelperText>{errors.materialType}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required error={!!errors.condition}>
            <InputLabel id="condition-label">Condition</InputLabel>
            <Select
              labelId="condition-label"
              name="condition"
              value={formData.condition}
              label="Condition"
              onChange={handleSelectChange}
            >
              {conditionOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {errors.condition && (
              <FormHelperText>{errors.condition}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            required
            fullWidth
            label="Width (cm)"
            name="width"
            type="number"
            value={formData.width || ""}
            onChange={handleInputChange}
            error={!!errors.width}
            helperText={errors.width || ""}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            fullWidth
            label="Height (cm)"
            name="height"
            type="number"
            value={formData.height || ""}
            onChange={handleInputChange}
            error={!!errors.height}
            helperText={errors.height || ""}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Depth (cm)"
            name="depth"
            type="number"
            value={formData.depth || ""}
            onChange={handleInputChange}
            error={!!errors.depth}
            helperText={errors.depth || "Optional"}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Additional Notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            multiline
            rows={4}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button onClick={onCancel} sx={{ mr: 1 }}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default EditMaterialForm;
