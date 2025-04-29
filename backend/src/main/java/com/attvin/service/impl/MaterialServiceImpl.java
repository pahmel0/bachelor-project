package com.attvin.service.impl;

import com.attvin.dto.MaterialPictureDTO;
import com.attvin.dto.MaterialRecordDTO;
import com.attvin.dto.MaterialStatsDTO;
import com.attvin.model.MaterialPicture;
import com.attvin.model.MaterialRecord;
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
        material.setMaterialCondition(materialDTO.getCondition());
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
                    picture.setPictureData(null);
                    
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
        savedDto.setCondition(material.getMaterialCondition());
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
        // This is a simplified version - you would need to implement the actual factory logic
        // based on your material hierarchy
        throw new UnsupportedOperationException(
            "Material type creation not implemented. Implement based on your material type hierarchy.");
    }

    // Helper method to set type-specific properties
    private void setTypeSpecificProperties(MaterialRecord material, MaterialRecordDTO dto) {
        // This is where you would set properties specific to each material type
        // For example, if it's a Window, set the openingType, uValue, etc.
        // You would need to use instanceof or similar to determine the type
        throw new UnsupportedOperationException(
            "Type-specific property setting not implemented. Implement based on your material type hierarchy.");
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
        dto.setCondition(material.getMaterialCondition());
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
    public MaterialRecordDTO updateMaterial(Long id, MaterialRecordDTO materialDTO) {
        // Stub implementation
        return materialDTO;
    }

    @Override
    public void deleteMaterial(Long id) {
        // Stub implementation
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
            dto.setCondition(material.getMaterialCondition());
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
    public void importMaterialsFromCsv(MultipartFile csvFile) {
        // Stub implementation
    }

    @Override
    public byte[] exportMaterialsToCsv() {
        // Stub implementation
        return new byte[0];
    }

    @Override
    public void addPicturesToMaterial(Long materialId, List<MultipartFile> pictures) {
        // Stub implementation
    }

    @Override
    public void removePictureFromMaterial(Long materialId, Long pictureId) {
        // Stub implementation
    }

    @Override
    public void setPrimaryPicture(Long materialId, Long pictureId) {
        // Stub implementation
    }

    @Override
    public byte[] getPictureData(Long pictureId) {
        // Stub implementation
        return new byte[0];
    }
}