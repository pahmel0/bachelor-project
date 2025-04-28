package com.attvin.service.impl;

import com.attvin.dto.MaterialRecordDTO;
import com.attvin.dto.MaterialStatsDTO;
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
    public MaterialRecordDTO createMaterial(MaterialRecordDTO materialDTO, List<MultipartFile> pictures) {
        // Stub implementation
        return materialDTO;
    }

    @Override
    public MaterialRecordDTO getMaterialById(Long id) {
        // Stub implementation
        return null;
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
        // Stub implementation
        return Page.empty();
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