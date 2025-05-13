package com.attvin.service;

import com.attvin.dto.MaterialRecordDTO;
import com.attvin.dto.MaterialStatsDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface MaterialService {
    // CRUD operations
    MaterialRecordDTO createMaterial(MaterialRecordDTO materialDTO, List<MultipartFile> pictures);
    MaterialRecordDTO getMaterialById(Long id);
    MaterialRecordDTO updateMaterial(Long id, MaterialRecordDTO materialDTO);
    void deleteMaterial(Long id);
    
    // Search and filter operations
    Page<MaterialRecordDTO> searchMaterials(String category, String type, String condition, String query, Pageable pageable);
    
    // Statistics
    MaterialStatsDTO getMaterialStats();
    
    // Import/Export operations
    void importMaterialsFromExcel(MultipartFile excelFile);
    byte[] exportMaterialsToExcel();
    byte[] generateExcelTemplate();

    // Picture management
    void addPicturesToMaterial(Long materialId, List<MultipartFile> pictures);
    void removePictureFromMaterial(Long materialId, Long pictureId);
    void setPrimaryPicture(Long materialId, Long pictureId);
    byte[] getPictureData(Long pictureId);
} 