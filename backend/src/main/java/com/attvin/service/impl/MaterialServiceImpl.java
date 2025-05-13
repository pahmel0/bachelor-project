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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

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
    }

    @Override
    public void importMaterialsFromExcel(MultipartFile excelFile) {
        // Stub implementation
    }

    @Override
    public byte[] exportMaterialsToExcel() {
        // Stub implementation
        return new byte[0];
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