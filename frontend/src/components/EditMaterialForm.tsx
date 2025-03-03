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
import { Material } from "./MaterialsGrid";

interface EditMaterialFormProps {
  material: Material;
  onSave: (updatedMaterial: Material) => void;
  onCancel: () => void;
}

// Options for dropdown menus
const objectTypeOptions = [
  "Furniture",
  "Building Material",
  "Decoration",
  "Fixture",
  "Other",
];
const materialTypeOptions = [
  "Wood",
  "Metal",
  "Plastic",
  "Glass",
  "Ceramic",
  "Textile",
  "Composite",
  "Other",
];
const conditionOptions = [
  "New",
  "Like New",
  "Reusable",
  "Needs Repair",
  "For Parts",
];

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

    setFormData({
      ...formData,
      [name]: value,
    });

    // Validate required fields
    if (["name", "dimensions"].includes(name)) {
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
    if (["objectType", "material", "condition"].includes(name)) {
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

    ["name", "objectType", "material", "condition", "dimensions"].forEach(
      (field) => {
        const error = validateField(
          field,
          formData[field as keyof Material] as string
        );
        if (error) {
          newErrors[field] = error;
          hasErrors = true;
        }
      }
    );

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
          <FormControl fullWidth required error={!!errors.objectType}>
            <InputLabel id="object-type-label">Object Type</InputLabel>
            <Select
              labelId="object-type-label"
              name="objectType"
              value={formData.objectType}
              label="Object Type"
              onChange={handleSelectChange}
            >
              {objectTypeOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {errors.objectType && (
              <FormHelperText>{errors.objectType}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required error={!!errors.material}>
            <InputLabel id="material-type-label">Material Type</InputLabel>
            <Select
              labelId="material-type-label"
              name="material"
              value={formData.material}
              label="Material Type"
              onChange={handleSelectChange}
            >
              {materialTypeOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {errors.material && (
              <FormHelperText>{errors.material}</FormHelperText>
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

        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Dimensions"
            name="dimensions"
            value={formData.dimensions}
            onChange={handleInputChange}
            error={!!errors.dimensions}
            helperText={
              errors.dimensions || "Format: Width x Depth x Height (cm)"
            }
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
