package com.attvin.service.impl;

import com.attvin.dto.MaterialPictureDTO;
import com.attvin.dto.MaterialRecordDTO;
import com.attvin.dto.MaterialStatsDTO;
import com.attvin.model.MaterialPicture;
import com.attvin.model.MaterialRecord;
import com.attvin.model.Window;
import com.attvin.model.Door;
import com.attvin.model.Desk;
import com.attvin.model.DrawerUnit;
import com.attvin.model.OfficeCabinet;
import com.attvin.repository.MaterialRepository;
import com.attvin.repository.MaterialPictureRepository;
import com.attvin.service.MaterialService;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MaterialServiceImpl implements MaterialService {

    private final MaterialRepository materialRepository;
    private final MaterialPictureRepository materialPictureRepository;

    @Override
    @Transactional(readOnly = true)
    public MaterialStatsDTO getMaterialStats() {
        List<MaterialRecord> allMaterials = materialRepository.findAll();
        
        long totalCount = allMaterials.size();
        
        // Count by condition
        Map<String, Long> conditionCounts = new HashMap<>();
        for (MaterialRecord material : allMaterials) {
            String condition = material.getMaterialCondition();
            conditionCounts.put(condition, conditionCounts.getOrDefault(condition, 0L) + 1);
        }
        
        // Count by category
        Map<String, Long> categoryCounts = new HashMap<>();
        for (MaterialRecord material : allMaterials) {
            String category = material.getCategory();
            categoryCounts.put(category, categoryCounts.getOrDefault(category, 0L) + 1);
        }
        
        // Count by type (using discriminator)
        Map<String, Long> typeCounts = new HashMap<>();
        for (MaterialRecord material : allMaterials) {
            String type = material.getClass().getSimpleName();
            typeCounts.put(type, typeCounts.getOrDefault(type, 0L) + 1);
        }
        
        // Count recent additions (last 30 days)
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        long recentCount = allMaterials.stream()
                .filter(m -> m.getDateAdded().isAfter(thirtyDaysAgo))
                .count();
        
        return MaterialStatsDTO.builder()
                .totalCount(totalCount)
                .conditionCounts(conditionCounts)
                .categoryCounts(categoryCounts)
                .typeCounts(typeCounts)
                .recentAdditionsCount(recentCount)
                .build();
    }

    // Implement other methods with minimal functionality for testing
    
    @Override
    @Transactional
    public MaterialRecordDTO createMaterial(MaterialRecordDTO materialDTO, List<MultipartFile> pictures) {
        // Create the appropriate material type based on materialDTO.getMaterialType()
        MaterialRecord material;
        
        // This would require implementing factory pattern or specific type creation
        // For now, we can use a simple factory method or reflection
        // Example (you'll need to implement or adjust based on your model hierarchy):
        material = createMaterialInstance(materialDTO);
        
        // Set basic properties
        material.setName(materialDTO.getName());
        material.setCategory(materialDTO.getCategory());
        material.setMaterialCondition(materialDTO.getMaterialCondition());
        material.setColor(materialDTO.getColor());
        material.setNotes(materialDTO.getNotes());
        material.setDateAdded(LocalDateTime.now());
        
        // Set specific properties based on material type
        setTypeSpecificProperties(material, materialDTO);
        
        // Save the material entity
        material = materialRepository.save(material);
        
        // Process pictures if provided
        if (pictures != null && !pictures.isEmpty()) {
            for (int i = 0; i < pictures.size(); i++) {
                MultipartFile pictureFile = pictures.get(i);
                
                try {
                    // Create new picture entity
                    MaterialPicture picture = new MaterialPicture();
                    picture.setFileName(pictureFile.getOriginalFilename());
                    picture.setContentType(pictureFile.getContentType());
                    picture.setFileSize(pictureFile.getSize());
                    picture.setUploadDate(LocalDateTime.now());
                    picture.setIsPrimary(i == 0); // First picture is primary by default
                    picture.setPictureData(pictureFile.getBytes());
                    
                    // Associate with material
                    material.addPicture(picture);
                } catch (Exception e) {
                    throw new RuntimeException("Failed to process picture", e);
                }
            }
            
            // Save the material with pictures
            material = materialRepository.save(material);
        }
        
        // Convert saved entity back to DTO
        MaterialRecordDTO savedDto = new MaterialRecordDTO();
        savedDto.setId(material.getId());
        savedDto.setName(material.getName());
        savedDto.setCategory(material.getCategory());
        savedDto.setMaterialType(material.getClass().getSimpleName());
        savedDto.setMaterialCondition(material.getMaterialCondition());
        savedDto.setColor(material.getColor());
        savedDto.setNotes(material.getNotes());
        savedDto.setDateAdded(material.getDateAdded());
        
        // Map pictures to DTOs if needed
        if (material.getPictures() != null && !material.getPictures().isEmpty()) {
            savedDto.setPictures(material.getPictures().stream()
                .map(pic -> {
                    MaterialPictureDTO picDto = new MaterialPictureDTO();
                    picDto.setId(pic.getId());
                    picDto.setFileName(pic.getFileName());
                    picDto.setContentType(pic.getContentType());
                    picDto.setFileSize(pic.getFileSize());
                    picDto.setUploadDate(pic.getUploadDate());
                    picDto.setIsPrimary(pic.getIsPrimary());
                    return picDto;
                })
                .collect(Collectors.toList()));
        }
        
        return savedDto;
    }

    // Helper method to create the appropriate material instance
    private MaterialRecord createMaterialInstance(MaterialRecordDTO dto) {
        String materialType = dto.getMaterialType();
        
        switch (materialType) {
            case "Window":
                return new Window();
            case "Door":
                return new Door();
            case "Desk":
                return new Desk();
            case "DrawerUnit":
                return new DrawerUnit();
            case "OfficeCabinet":
                return new OfficeCabinet();
            default:
                throw new UnsupportedOperationException("Unsupported material type: " + materialType);
        }
    }

    // Helper method to set type-specific properties
    private void setTypeSpecificProperties(MaterialRecord material, MaterialRecordDTO dto) {
        String materialType = material.getClass().getSimpleName();
        
        switch (materialType) {
            case "Window":
                Window window = (Window) material;
                window.setHeight(dto.getHeight());
                window.setWidth(dto.getWidth());
                if (dto.getOpeningType() != null) {
                    window.setOpeningType(Window.OpeningType.valueOf(dto.getOpeningType()));
                }
                if (dto.getHingeSide() != null) {
                    window.setHingeSide(Window.HingeSide.valueOf(dto.getHingeSide()));
                }
                window.setUValue(dto.getUValue());
                break;
                
            case "Door":
                Door door = (Door) material;
                door.setHeight(dto.getHeight());
                door.setWidth(dto.getWidth());
                if (dto.getSwingDirection() != null) {
                    door.setSwingDirection(Door.SwingDirection.valueOf(dto.getSwingDirection()));
                }
                door.setUValue(dto.getUValue());
                break;
                
            case "Desk":
                Desk desk = (Desk) material;
                desk.setDeskType(Desk.DeskType.valueOf(dto.getDeskType()));
                desk.setMaximumHeight(dto.getMaximumHeight());
                desk.setWidth(dto.getWidth());
                desk.setDepth(dto.getDepth());
                if (dto.getHeightAdjustable() != null) {
                    desk.setHeightAdjustable(dto.getHeightAdjustable());
                }
                break;
                
            case "DrawerUnit":
                DrawerUnit drawerUnit = (DrawerUnit) material;
                drawerUnit.setHeight(dto.getHeight());
                drawerUnit.setWidth(dto.getWidth());
                drawerUnit.setDepth(dto.getDepth());
                if (dto.getHasWheels() != null) {
                    drawerUnit.setHasWheels(dto.getHasWheels());
                }
                break;
                
            case "OfficeCabinet":
                OfficeCabinet cabinet = (OfficeCabinet) material;
                cabinet.setHeight(dto.getHeight());
                cabinet.setWidth(dto.getWidth());
                cabinet.setDepth(dto.getDepth());
                if (dto.getOpeningType() != null) {
                    cabinet.setOpeningType(OfficeCabinet.OpeningType.valueOf(dto.getOpeningType()));
                }
                break;
                
            default:
                throw new UnsupportedOperationException("Unsupported material type: " + materialType);
        }
    }

    @Override
    public MaterialRecordDTO getMaterialById(Long id) {
        // Find the material entity by ID
        MaterialRecord material = materialRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Material not found with id: " + id));
        
        // Convert entity to DTO
        MaterialRecordDTO dto = new MaterialRecordDTO();
        dto.setId(material.getId());
        dto.setName(material.getName());
        dto.setCategory(material.getCategory());
        dto.setMaterialType(material.getClass().getSimpleName());
        dto.setMaterialCondition(material.getMaterialCondition());
        dto.setColor(material.getColor());
        dto.setNotes(material.getNotes());
        dto.setDateAdded(material.getDateAdded());
        
        // Map other properties as needed
        
        // Fetch and map pictures if needed
        // List<MaterialPicture> pictures = materialPictureRepository.findByMaterialId(id);
        // dto.setPictures(...);
        
        return dto;
    }

    @Override
    @Transactional
    public MaterialRecordDTO updateMaterial(Long id, MaterialRecordDTO materialDTO) {
        // Find the existing material by ID
        MaterialRecord material = materialRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Material not found with id: " + id));
        
        // Update basic properties
        material.setName(materialDTO.getName());
        material.setCategory(materialDTO.getCategory());
        material.setMaterialCondition(materialDTO.getMaterialCondition());
        material.setColor(materialDTO.getColor());
        material.setNotes(materialDTO.getNotes());
        
        // Update specific properties based on material type
        updateTypeSpecificProperties(material, materialDTO);
        
        // Save the updated material
        material = materialRepository.save(material);
        
        // Convert the updated entity back to DTO
        MaterialRecordDTO updatedDTO = new MaterialRecordDTO();
        updatedDTO.setId(material.getId());
        updatedDTO.setName(material.getName());
        updatedDTO.setCategory(material.getCategory());
        updatedDTO.setMaterialType(material.getClass().getSimpleName());
        updatedDTO.setMaterialCondition(material.getMaterialCondition());
        updatedDTO.setColor(material.getColor());
        updatedDTO.setNotes(material.getNotes());
        updatedDTO.setDateAdded(material.getDateAdded());
        
        // Map pictures to DTOs if they exist
        if (material.getPictures() != null && !material.getPictures().isEmpty()) {
            updatedDTO.setPictures(material.getPictures().stream()
                .map(pic -> {
                    MaterialPictureDTO picDto = new MaterialPictureDTO();
                    picDto.setId(pic.getId());
                    picDto.setFileName(pic.getFileName());
                    picDto.setContentType(pic.getContentType());
                    picDto.setFileSize(pic.getFileSize());
                    picDto.setUploadDate(pic.getUploadDate());
                    picDto.setIsPrimary(pic.getIsPrimary());
                    picDto.setDescription(pic.getDescription());
                    return picDto;
                })
                .collect(Collectors.toList()));
        }
        
        return updatedDTO;
    }
    
    // Helper method to update type-specific properties
    private void updateTypeSpecificProperties(MaterialRecord material, MaterialRecordDTO dto) {
        String materialType = material.getClass().getSimpleName();
        
        switch (materialType) {
            case "Window":
                Window window = (Window) material;
                if (dto.getHeight() != null) window.setHeight(dto.getHeight());
                if (dto.getWidth() != null) window.setWidth(dto.getWidth());
                if (dto.getOpeningType() != null) window.setOpeningType(Window.OpeningType.valueOf(dto.getOpeningType()));
                if (dto.getHingeSide() != null) window.setHingeSide(Window.HingeSide.valueOf(dto.getHingeSide()));
                if (dto.getUValue() != null) window.setUValue(dto.getUValue());
                break;
            case "Door":
                Door door = (Door) material;
                if (dto.getHeight() != null) door.setHeight(dto.getHeight());
                if (dto.getWidth() != null) door.setWidth(dto.getWidth());
                if (dto.getSwingDirection() != null) door.setSwingDirection(Door.SwingDirection.valueOf(dto.getSwingDirection()));
                if (dto.getUValue() != null) door.setUValue(dto.getUValue());
                break;
            case "Desk":
                Desk desk = (Desk) material;
                if (dto.getMaximumHeight() != null) desk.setMaximumHeight(dto.getMaximumHeight());
                if (dto.getDeskType() != null) desk.setDeskType(Desk.DeskType.valueOf(dto.getDeskType()));
                if (dto.getWidth() != null) desk.setWidth(dto.getWidth());
                if (dto.getDepth() != null) desk.setDepth(dto.getDepth());
                if (dto.getHeightAdjustable() != null) desk.setHeightAdjustable(dto.getHeightAdjustable());
                break;
            case "DrawerUnit":
                DrawerUnit drawerUnit = (DrawerUnit) material;
                if (dto.getHeight() != null) drawerUnit.setHeight(dto.getHeight());
                if (dto.getWidth() != null) drawerUnit.setWidth(dto.getWidth());
                if (dto.getDepth() != null) drawerUnit.setDepth(dto.getDepth());
                if (dto.getHasWheels() != null) drawerUnit.setHasWheels(dto.getHasWheels());
                break;
            case "OfficeCabinet":
                OfficeCabinet cabinet = (OfficeCabinet) material;
                if (dto.getHeight() != null) cabinet.setHeight(dto.getHeight());
                if (dto.getWidth() != null) cabinet.setWidth(dto.getWidth());
                if (dto.getDepth() != null) cabinet.setDepth(dto.getDepth());
                if (dto.getOpeningType() != null) cabinet.setOpeningType(OfficeCabinet.OpeningType.valueOf(dto.getOpeningType()));
                break;
            default:
                throw new UnsupportedOperationException("Unsupported material type: " + materialType);
        }
    }

    @Override
    @Transactional
    public void deleteMaterial(Long id) {
        // Check if the material exists
        if (!materialRepository.existsById(id)) {
            throw new RuntimeException("Material not found with id: " + id);
        }
        
        // Spring Data JPA will handle the cascading delete for pictures
        // due to @OneToMany(mappedBy = "material", cascade = CascadeType.ALL) in MaterialRecord
        materialRepository.deleteById(id);
    }

    @Override
    public Page<MaterialRecordDTO> searchMaterials(String category, String type, String condition, String query, Pageable pageable) {
        // Query the repository with the provided filters
        Page<MaterialRecord> materialsPage = materialRepository.searchMaterials(category, type, condition, query, pageable);
        
        // Convert the entity page to a DTO page
        return materialsPage.map(material -> {
            MaterialRecordDTO dto = new MaterialRecordDTO();
            // Map properties from entity to DTO
            dto.setId(material.getId());
            dto.setName(material.getName());
            dto.setCategory(material.getCategory());
            dto.setMaterialType(material.getClass().getSimpleName()); // or another field that stores the type
            dto.setMaterialCondition(material.getMaterialCondition());
            dto.setColor(material.getColor());
            dto.setNotes(material.getNotes());
            dto.setDateAdded(material.getDateAdded());
            
            // Map other properties as needed
            
            // Map pictures if needed
            // dto.setPictures(...);
            
            return dto;
        });
    }    @Override
    @Transactional
    public void importMaterialsFromExcel(MultipartFile excelFile) {
        try (var workbook = new XSSFWorkbook(excelFile.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            
            // Skip the header row
            boolean firstRow = true;
            
            for (Row row : sheet) {
                if (firstRow) {
                    firstRow = false;
                    continue;
                }
                
                try {
                    // Extract material data
                    MaterialRecordDTO materialDTO = new MaterialRecordDTO();
                    
                    // Basic fields
                    materialDTO.setName(getCellValueAsString(row, 0));
                    materialDTO.setCategory(getCellValueAsString(row, 1));
                    materialDTO.setMaterialType(getCellValueAsString(row, 2));
                    materialDTO.setMaterialCondition(getCellValueAsString(row, 3));
                    materialDTO.setColor(getCellValueAsString(row, 4));
                    materialDTO.setNotes(getCellValueAsString(row, 5));
                    
                    // Dimensions
                    materialDTO.setWidth(getCellValueAsDouble(row, 6));
                    materialDTO.setHeight(getCellValueAsDouble(row, 7));
                    materialDTO.setDepth(getCellValueAsDouble(row, 8));
                    
                    // Type-specific fields
                    materialDTO.setDeskType(getCellValueAsString(row, 9));
                    materialDTO.setHeightAdjustable(getCellValueAsBoolean(row, 10));
                    materialDTO.setMaximumHeight(getCellValueAsDouble(row, 11));
                    materialDTO.setOpeningType(getCellValueAsString(row, 12));
                    materialDTO.setHingeSide(getCellValueAsString(row, 13));
                    materialDTO.setUValue(getCellValueAsDouble(row, 14));
                    materialDTO.setSwingDirection(getCellValueAsString(row, 15));
                    materialDTO.setHasWheels(getCellValueAsBoolean(row, 16));
                    
                    // Set creation date
                    materialDTO.setDateAdded(LocalDateTime.now());
                    
                    // Create the material
                    createMaterial(materialDTO, null);
                    
                } catch (Exception e) {
                    // Log the error but continue processing the next rows
                    e.printStackTrace();
                }
            }
            
        } catch (IOException e) {
            throw new RuntimeException("Failed to import Excel file: " + e.getMessage(), e);
        }
    }

    /**
     * Helper method to get cell value as string
     */
    private String getCellValueAsString(Row row, int cellIndex) {
        Cell cell = row.getCell(cellIndex);
        if (cell == null) {
            return null;
        }
        
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                return String.valueOf(cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            default:
                return null;
        }
    }
    
    /**
     * Helper method to get cell value as double
     */
    private Double getCellValueAsDouble(Row row, int cellIndex) {
        Cell cell = row.getCell(cellIndex);
        if (cell == null) {
            return null;
        }
        
        switch (cell.getCellType()) {
            case NUMERIC:
                return cell.getNumericCellValue();
            case STRING:
                try {
                    return Double.parseDouble(cell.getStringCellValue());
                } catch (NumberFormatException e) {
                    return null;
                }
            default:
                return null;
        }
    }
    
    /**
     * Helper method to get cell value as boolean
     */
    private Boolean getCellValueAsBoolean(Row row, int cellIndex) {
        Cell cell = row.getCell(cellIndex);
        if (cell == null) {
            return null;
        }
        
        switch (cell.getCellType()) {
            case BOOLEAN:
                return cell.getBooleanCellValue();
            case STRING:
                return Boolean.parseBoolean(cell.getStringCellValue());
            case NUMERIC:
                return cell.getNumericCellValue() != 0;
            default:
                return null;
        }
    }

    @Override
    public byte[] exportMaterialsToExcel() {
        try {
            // Create workbook and sheet
            Workbook workbook = new XSSFWorkbook();
            Sheet sheet = workbook.createSheet("Materials");
            
            // Create header row with styles
            Row headerRow = sheet.createRow(0);
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            
            // Define the headers
            String[] headers = {
                "Name", "Category", "Material Type", "Condition", "Color", "Notes", 
                "Width", "Height", "Depth", 
                "Desk Type", "Height Adjustable", "Max Height",
                "Opening Type", "Hinge Side", "U-Value", 
                "Swing Direction", "Has Wheels"
            };
            
            // Create header cells
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }
            
            // Get all materials
            List<MaterialRecord> materials = materialRepository.findAll();
            
            // Create data rows
            int rowNum = 1;
            for (MaterialRecord material : materials) {
                Row row = sheet.createRow(rowNum++);
                
                // Basic information
                row.createCell(0).setCellValue(material.getName());
                row.createCell(1).setCellValue(material.getCategory());
                row.createCell(2).setCellValue(material.getClass().getSimpleName());
                row.createCell(3).setCellValue(material.getMaterialCondition());
                row.createCell(4).setCellValue(material.getColor() != null ? material.getColor() : "");
                row.createCell(5).setCellValue(material.getNotes() != null ? material.getNotes() : "");
                
                // Type-specific information
                switch (material.getClass().getSimpleName()) {
                    case "Desk":
                        Desk desk = (Desk) material;
                        row.createCell(6).setCellValue(desk.getWidth());
                        row.createCell(7).setCellValue(desk.getMaximumHeight());
                        row.createCell(8).setCellValue(desk.getDepth());
                        row.createCell(9).setCellValue(desk.getDeskType().name());
                        row.createCell(10).setCellValue(desk.getHeightAdjustable());
                        row.createCell(11).setCellValue(desk.getMaximumHeight());
                        break;
                    
                    case "Window":
                        Window window = (Window) material;
                        row.createCell(6).setCellValue(window.getWidth());
                        row.createCell(7).setCellValue(window.getHeight());
                        row.createCell(8).setCellValue(0); // No depth for windows
                        row.createCell(12).setCellValue(window.getOpeningType().name());
                        if (window.getHingeSide() != null) {
                            row.createCell(13).setCellValue(window.getHingeSide().name());
                        }
                        if (window.getUValue() != null) {
                            row.createCell(14).setCellValue(window.getUValue());
                        }
                        break;
                        
                    case "Door":
                        Door door = (Door) material;
                        row.createCell(6).setCellValue(door.getWidth());
                        row.createCell(7).setCellValue(door.getHeight());
                        row.createCell(15).setCellValue(door.getSwingDirection().name());
                        if (door.getUValue() != null) {
                            row.createCell(14).setCellValue(door.getUValue());
                        }
                        break;
                        
                    case "DrawerUnit":
                        DrawerUnit drawerUnit = (DrawerUnit) material;
                        row.createCell(6).setCellValue(drawerUnit.getWidth());
                        row.createCell(7).setCellValue(drawerUnit.getHeight());
                        row.createCell(8).setCellValue(drawerUnit.getDepth());
                        row.createCell(16).setCellValue(drawerUnit.getHasWheels());
                        break;
                        
                    case "OfficeCabinet":
                        OfficeCabinet cabinet = (OfficeCabinet) material;
                        row.createCell(6).setCellValue(cabinet.getWidth());
                        row.createCell(7).setCellValue(cabinet.getHeight());
                        row.createCell(8).setCellValue(cabinet.getDepth());
                        row.createCell(12).setCellValue(cabinet.getOpeningType().name());
                        break;
                }
            }
            
            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            // Write the workbook to a byte array
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            workbook.close();
            
            return outputStream.toByteArray();
            
        } catch (IOException e) {
            throw new RuntimeException("Failed to export materials to Excel", e);
        }
    }

    @Override
    @Transactional
    public void addPicturesToMaterial(Long materialId, List<MultipartFile> pictures) {
        // Find the material by ID
        MaterialRecord material = materialRepository.findById(materialId)
            .orElseThrow(() -> new RuntimeException("Material not found with id: " + materialId));
            
        if (pictures != null && !pictures.isEmpty()) {
            boolean hasPrimary = materialPictureRepository.findByMaterialIdAndIsPrimaryTrue(materialId).isPresent();
            
            for (int i = 0; i < pictures.size(); i++) {
                MultipartFile pictureFile = pictures.get(i);
                
                try {
                    // Create new picture entity
                    MaterialPicture picture = new MaterialPicture();
                    picture.setFileName(pictureFile.getOriginalFilename());
                    picture.setContentType(pictureFile.getContentType());
                    picture.setFileSize(pictureFile.getSize());
                    picture.setUploadDate(LocalDateTime.now());
                    
                    // First picture is primary only if no primary exists yet
                    picture.setIsPrimary(i == 0 && !hasPrimary);
                    picture.setPictureData(pictureFile.getBytes());
                    picture.setDescription("Image for " + material.getName());
                    
                    // Associate with material
                    material.addPicture(picture);
                } catch (Exception e) {
                    throw new RuntimeException("Failed to process picture", e);
                }
            }
            
            // Save the material with pictures
            materialRepository.save(material);
        }
    }

    @Override
    @Transactional
    public void removePictureFromMaterial(Long materialId, Long pictureId) {
        // Find the material by ID
        MaterialRecord material = materialRepository.findById(materialId)
            .orElseThrow(() -> new RuntimeException("Material not found with id: " + materialId));
        
        // Find the picture by ID and verify it belongs to the material
        MaterialPicture picture = materialPictureRepository.findById(pictureId)
            .orElseThrow(() -> new RuntimeException("Picture not found with id: " + pictureId));
        
        if (!picture.getMaterial().getId().equals(materialId)) {
            throw new RuntimeException("Picture does not belong to the specified material");
        }
        
        // Check if this is the primary picture
        boolean isPrimary = picture.getIsPrimary();
        
        // Remove the picture from the material
        material.removePicture(picture);
        materialPictureRepository.delete(picture);
        
        // If it was the primary picture, set a new primary if other pictures exist
        if (isPrimary) {
            List<MaterialPicture> remainingPictures = materialPictureRepository.findByMaterialId(materialId);
            if (!remainingPictures.isEmpty()) {
                // Set the first remaining picture as primary
                MaterialPicture newPrimary = remainingPictures.get(0);
                newPrimary.setIsPrimary(true);
                materialPictureRepository.save(newPrimary);
            }
        }
    }

    @Override
    @Transactional
    public void setPrimaryPicture(Long materialId, Long pictureId) {
        // Find the material by ID
        MaterialRecord material = materialRepository.findById(materialId)
            .orElseThrow(() -> new RuntimeException("Material not found with id: " + materialId));
        
        // Find the picture by ID and verify it belongs to the material
        MaterialPicture picture = materialPictureRepository.findById(pictureId)
            .orElseThrow(() -> new RuntimeException("Picture not found with id: " + pictureId));
        
        if (!picture.getMaterial().getId().equals(materialId)) {
            throw new RuntimeException("Picture does not belong to the specified material");
        }
        
        // Clear primary flag for all pictures of the material
        materialPictureRepository.clearPrimaryFlagForMaterial(materialId);
        
        // Set the selected picture as primary
        picture.setIsPrimary(true);
        materialPictureRepository.save(picture);
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] getPictureData(Long pictureId) {
        // Find the picture by ID
        MaterialPicture picture = materialPictureRepository.findById(pictureId)
            .orElseThrow(() -> new RuntimeException("Picture not found with id: " + pictureId));
            
        // Return the binary data
        return picture.getPictureData();
    }
}