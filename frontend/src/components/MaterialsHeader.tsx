import { Box, Typography, Chip } from "@mui/material";

interface MaterialsHeaderProps {
  totalCount: number;
}

const MaterialsHeader = ({ totalCount }: MaterialsHeaderProps) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
      <Typography variant="h4" component="h1">
        Materials Inventory
      </Typography>
      <Chip
        label={`${totalCount} items`}
        color="primary"
        size="medium"
        sx={{ ml: 2, fontWeight: "medium" }}
      />
    </Box>
  );
};

export default MaterialsHeader;
