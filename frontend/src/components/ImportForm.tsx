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
  Typography,
} from "@mui/material";

// Options for form select fields
const objectTypes = [
  { value: "DESK", label: "Desk" },
  { value: "DOOR", label: "Door" },
  { value: "WINDOW", label: "Window" },
  { value: "OFFICE_CABINET", label: "Office Cabinet" },
  { value: "DRAWER_UNIT", label: "Drawer Unit" },
];

const categoryOptions = [
  "Furniture",
  "Storage",
  "Building Material",
  "Decoration",
  "Fixture",
  "Other",
];

// Material types are now part of the category field

const conditions = ["New", "Like New", "Reusable", "Needs Repair", "For Parts"];

// Desk specific options
const deskTypeOptions = [
  { value: "CORNER_DESK", label: "Corner Desk" },
  { value: "STRAIGHT_DESK", label: "Straight Desk" },
];

// Window specific options
const windowOpeningTypeOptions = [
  { value: "FIXED_PANE", label: "Fixed Pane" },
  { value: "TOP_HUNG", label: "Top Hung" },
  { value: "SIDE_HUNG", label: "Side Hung" },
  { value: "TILT", label: "Tilt" },
  { value: "SLIDING", label: "Sliding" },
];

const hingeSideOptions = [
  { value: "RIGHT", label: "Right" },
  { value: "LEFT", label: "Left" },
  { value: "TOP", label: "Top" },
  { value: "BOTTOM", label: "Bottom" },
  { value: "NONE", label: "None" },
];

// Door specific options
const swingDirectionOptions = [
  { value: "RIGHT", label: "Right" },
  { value: "LEFT", label: "Left" },
];

// Cabinet specific options
const cabinetOpeningTypeOptions = [
  { value: "DOORS", label: "Doors" },
  { value: "SLIDING_DOORS", label: "Sliding Doors" },
  { value: "NO_DOORS", label: "No Doors" },
];

export interface MaterialFormData {
  name: string;
  materialType: string; // The type of material (DESK, DOOR, WINDOW, etc.)
  category: string; // Category like Furniture, Storage, etc.
  condition: string;
  notes: string;
  color: string;

  // Dimensions
  height?: number;
  width?: number;
  depth?: number;

  // Desk specific fields
  deskType?: string;
  heightAdjustable?: boolean;
  maximumHeight?: number;

  // Window specific fields
  openingType?: string;
  hingeSide?: string;
  uValue?: number;

  // Door specific fields
  swingDirection?: string;

  // Drawer unit specific fields
  hasWheels?: boolean;
}

interface ImportFormProps {
  onChange: (data: MaterialFormData) => void;
  initialData?: Partial<MaterialFormData>;
}

const ImportForm = ({ onChange, initialData = {} }: ImportFormProps) => {
  const [formData, setFormData] = useState<MaterialFormData>({
    name: initialData.name || "",
    materialType: initialData.materialType || "",
    category: initialData.category || "",
    condition: initialData.condition || "",
    notes: initialData.notes || "",
    color: initialData.color || "",

    // Dimensions
    height: initialData.height,
    width: initialData.width,
    depth: initialData.depth,

    // Type-specific fields
    deskType: initialData.deskType,
    heightAdjustable: initialData.heightAdjustable,
    maximumHeight: initialData.maximumHeight,
    openingType: initialData.openingType,
    hingeSide: initialData.hingeSide,
    uValue: initialData.uValue,
    swingDirection: initialData.swingDirection,
    hasWheels: initialData.hasWheels,
  });

  // Track which material type is selected to show relevant fields
  const [selectedMaterialType, setSelectedMaterialType] = useState<string>(
    initialData.materialType || ""
  );

  const [errors, setErrors] = useState<
    Partial<Record<keyof MaterialFormData, string>>
  >({});

  const validateField = (
    name: keyof MaterialFormData,
    value: string | number | boolean | undefined | null
  ) => {
    // Required fields validation
    if (
      name === "name" &&
      (!value || (typeof value === "string" && !value.trim()))
    ) {
      return "Name is required";
    }
    if (name === "materialType" && !value) {
      return "Material type is required";
    }
    if (name === "category" && !value) {
      return "Category is required";
    }
    if (name === "condition" && !value) {
      return "Condition is required";
    }
    if (name === "color" && !value) {
      return "Color is required";
    }

    // Dimension validation - required for all material types
    if (name === "width" && !value) {
      return "Width is required";
    }
    if (name === "height" && !value) {
      return "Height is required";
    }

    // Type-specific required fields
    if (selectedMaterialType === "DESK") {
      if (name === "deskType" && !value) {
        return "Desk type is required";
      }
      if (name === "depth" && !value) {
        return "Depth is required for desks";
      }
    }

    if (
      selectedMaterialType === "WINDOW" ||
      selectedMaterialType === "DOOR" ||
      selectedMaterialType === "OFFICE_CABINET" ||
      selectedMaterialType === "DRAWER_UNIT"
    ) {
      if (name === "depth" && !value) {
        return "Depth is required for this material type";
      }
    }

    if (selectedMaterialType === "WINDOW") {
      if (name === "openingType" && !value) {
        return "Opening type is required for windows";
      }
    }

    if (selectedMaterialType === "DOOR") {
      if (name === "swingDirection" && !value) {
        return "Swing direction is required for doors";
      }
    }

    if (selectedMaterialType === "OFFICE_CABINET") {
      if (name === "openingType" && !value) {
        return "Opening type is required for cabinets";
      }
    }

    return "";
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent
  ) => {
    const { name, value } = e.target;

    // Handle special case for materialType to update the selectedMaterialType state
    if (name === "materialType") {
      setSelectedMaterialType(value);
    }

    // Handle numeric inputs
    let processedValue: string | number | boolean | null = value;
    if (
      ["height", "width", "depth", "maximumHeight", "uValue"].includes(name)
    ) {
      processedValue = value === "" ? null : Number(value);
    }

    // Handle boolean inputs
    if (["heightAdjustable", "hasWheels"].includes(name)) {
      processedValue = value === "true";
    }

    // Validate field
    const error = validateField(name as keyof MaterialFormData, processedValue);

    // Update errors
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    // Update form data
    const updatedData = {
      ...formData,
      [name]: processedValue,
    };

    setFormData(updatedData);
    onChange(updatedData);
  };

  return (
    <Box>
      <Grid container spacing={2}>
        {/* Basic Information */}
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
          <FormControl fullWidth error={!!errors.materialType} required>
            <InputLabel id="material-type-label">Material Type</InputLabel>
            <Select
              labelId="material-type-label"
              name="materialType"
              value={formData.materialType}
              label="Material Type"
              onChange={handleChange}
            >
              {objectTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
            {errors.materialType && (
              <FormHelperText>{errors.materialType}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth error={!!errors.category} required>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              name="category"
              value={formData.category}
              label="Category"
              onChange={handleChange}
            >
              {categoryOptions.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
            {errors.category && (
              <FormHelperText>{errors.category}</FormHelperText>
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

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            error={!!errors.color}
            helperText={errors.color}
            required
          />
        </Grid>

        {/* Dimensions */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            Dimensions
          </Typography>
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Width (cm)"
            name="width"
            type="number"
            value={formData.width || ""}
            onChange={handleChange}
            error={!!errors.width}
            helperText={errors.width}
            required
            inputProps={{ step: 0.1 }}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Height (cm)"
            name="height"
            type="number"
            value={formData.height || ""}
            onChange={handleChange}
            error={!!errors.height}
            helperText={errors.height}
            required
            inputProps={{ step: 0.1 }}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Depth (cm)"
            name="depth"
            type="number"
            value={formData.depth || ""}
            onChange={handleChange}
            error={!!errors.depth}
            helperText={errors.depth}
            inputProps={{ step: 0.1 }}
          />
        </Grid>

        {/* Type-specific fields */}
        {selectedMaterialType && (
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              {objectTypes.find((t) => t.value === selectedMaterialType)?.label}{" "}
              Specific Details
            </Typography>
          </Grid>
        )}

        {/* Desk specific fields */}
        {selectedMaterialType === "DESK" && (
          <>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.deskType} required>
                <InputLabel id="desk-type-label">Desk Type</InputLabel>
                <Select
                  labelId="desk-type-label"
                  name="deskType"
                  value={formData.deskType || ""}
                  label="Desk Type"
                  onChange={handleChange}
                >
                  {deskTypeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.deskType && (
                  <FormHelperText>{errors.deskType}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="height-adjustable-label">
                  Height Adjustable
                </InputLabel>
                <Select
                  labelId="height-adjustable-label"
                  name="heightAdjustable"
                  value={formData.heightAdjustable ? "true" : "false"}
                  label="Height Adjustable"
                  onChange={handleChange}
                >
                  <MenuItem value="true">Yes</MenuItem>
                  <MenuItem value="false">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {formData.heightAdjustable && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Maximum Height (cm)"
                  name="maximumHeight"
                  type="number"
                  value={formData.maximumHeight || ""}
                  onChange={handleChange}
                  error={!!errors.maximumHeight}
                  helperText={errors.maximumHeight}
                  inputProps={{ step: 0.1 }}
                />
              </Grid>
            )}
          </>
        )}

        {/* Window specific fields */}
        {selectedMaterialType === "WINDOW" && (
          <>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.openingType} required>
                <InputLabel id="window-opening-type-label">
                  Opening Type
                </InputLabel>
                <Select
                  labelId="window-opening-type-label"
                  name="openingType"
                  value={formData.openingType || ""}
                  label="Opening Type"
                  onChange={handleChange}
                >
                  {windowOpeningTypeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.openingType && (
                  <FormHelperText>{errors.openingType}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="hinge-side-label">Hinge Side</InputLabel>
                <Select
                  labelId="hinge-side-label"
                  name="hingeSide"
                  value={formData.hingeSide || ""}
                  label="Hinge Side"
                  onChange={handleChange}
                >
                  {hingeSideOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="U-Value"
                name="uValue"
                type="number"
                value={formData.uValue || ""}
                onChange={handleChange}
                inputProps={{ step: 0.01 }}
              />
            </Grid>
          </>
        )}

        {/* Door specific fields */}
        {selectedMaterialType === "DOOR" && (
          <>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.swingDirection} required>
                <InputLabel id="swing-direction-label">
                  Swing Direction
                </InputLabel>
                <Select
                  labelId="swing-direction-label"
                  name="swingDirection"
                  value={formData.swingDirection || ""}
                  label="Swing Direction"
                  onChange={handleChange}
                >
                  {swingDirectionOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.swingDirection && (
                  <FormHelperText>{errors.swingDirection}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="U-Value"
                name="uValue"
                type="number"
                value={formData.uValue || ""}
                onChange={handleChange}
                inputProps={{ step: 0.01 }}
              />
            </Grid>
          </>
        )}

        {/* Office Cabinet specific fields */}
        {selectedMaterialType === "OFFICE_CABINET" && (
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.openingType} required>
              <InputLabel id="cabinet-opening-type-label">
                Opening Type
              </InputLabel>
              <Select
                labelId="cabinet-opening-type-label"
                name="openingType"
                value={formData.openingType || ""}
                label="Opening Type"
                onChange={handleChange}
              >
                {cabinetOpeningTypeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.openingType && (
                <FormHelperText>{errors.openingType}</FormHelperText>
              )}
            </FormControl>
          </Grid>
        )}

        {/* Drawer Unit specific fields */}
        {selectedMaterialType === "DRAWER_UNIT" && (
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="has-wheels-label">Has Wheels</InputLabel>
              <Select
                labelId="has-wheels-label"
                name="hasWheels"
                value={formData.hasWheels ? "true" : "false"}
                label="Has Wheels"
                onChange={handleChange}
              >
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}

        {/* Notes */}
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
