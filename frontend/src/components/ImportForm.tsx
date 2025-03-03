import { useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  SelectChangeEvent,
} from "@mui/material";

// Options for form select fields
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

export interface MaterialFormData {
  name: string;
  objectType: string;
  material: string;
  condition: string;
  dimensions: string;
  notes: string;
}

interface ImportFormProps {
  onChange: (data: MaterialFormData) => void;
  initialData?: Partial<MaterialFormData>;
}

const ImportForm = ({ onChange, initialData = {} }: ImportFormProps) => {
  const [formData, setFormData] = useState<MaterialFormData>({
    name: initialData.name || "",
    objectType: initialData.objectType || "",
    material: initialData.material || "",
    condition: initialData.condition || "",
    dimensions: initialData.dimensions || "",
    notes: initialData.notes || "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof MaterialFormData, string>>
  >({});

  const validateField = (name: keyof MaterialFormData, value: string) => {
    if (name === "name" && !value.trim()) {
      return "Name is required";
    }
    if (name === "objectType" && !value) {
      return "Object type is required";
    }
    if (name === "material" && !value) {
      return "Material is required";
    }
    if (name === "condition" && !value) {
      return "Condition is required";
    }
    return "";
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent
  ) => {
    const { name, value } = e.target;

    // Validate field
    const error = validateField(name as keyof MaterialFormData, value);

    // Update errors
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    // Update form data
    const updatedData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedData);
    onChange(updatedData);
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Material Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            required
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth error={!!errors.objectType} required>
            <InputLabel id="object-type-label">Object Type</InputLabel>
            <Select
              labelId="object-type-label"
              name="objectType"
              value={formData.objectType}
              label="Object Type"
              onChange={handleChange}
            >
              {objectTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
            {errors.objectType && (
              <FormHelperText>{errors.objectType}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth error={!!errors.material} required>
            <InputLabel id="material-label">Material</InputLabel>
            <Select
              labelId="material-label"
              name="material"
              value={formData.material}
              label="Material"
              onChange={handleChange}
            >
              {materialTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
            {errors.material && (
              <FormHelperText>{errors.material}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth error={!!errors.condition} required>
            <InputLabel id="condition-label">Condition</InputLabel>
            <Select
              labelId="condition-label"
              name="condition"
              value={formData.condition}
              label="Condition"
              onChange={handleChange}
            >
              {conditions.map((condition) => (
                <MenuItem key={condition} value={condition}>
                  {condition}
                </MenuItem>
              ))}
            </Select>
            {errors.condition && (
              <FormHelperText>{errors.condition}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Dimensions"
            name="dimensions"
            value={formData.dimensions}
            onChange={handleChange}
            placeholder="e.g., 120 x 80 x 5 cm"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Additional Notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            multiline
            rows={4}
            placeholder="Add any additional information about the material..."
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ImportForm;
