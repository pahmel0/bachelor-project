package com.attvin.controller;

import com.attvin.dto.MaterialRecordDTO;
import com.attvin.dto.MaterialStatsDTO;
import com.attvin.service.MaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/materials")
@RequiredArgsConstructor
public class MaterialController {
    
    private final MaterialService materialService;
    
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MaterialRecordDTO> createMaterial(
            @RequestPart("material") MaterialRecordDTO materialDTO,
            @RequestPart(value = "pictures", required = false) List<MultipartFile> pictures) {
        return ResponseEntity.ok(materialService.createMaterial(materialDTO, pictures));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<MaterialRecordDTO> getMaterial(@PathVariable Long id) {
        return ResponseEntity.ok(materialService.getMaterialById(id));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<MaterialRecordDTO> updateMaterial(
            @PathVariable Long id,
            @RequestBody MaterialRecordDTO materialDTO) {
        return ResponseEntity.ok(materialService.updateMaterial(id, materialDTO));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaterial(@PathVariable Long id) {
        materialService.deleteMaterial(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping
    public ResponseEntity<Page<MaterialRecordDTO>> searchMaterials(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String condition,
            @RequestParam(required = false) String query,
            Pageable pageable) {
        return ResponseEntity.ok(materialService.searchMaterials(category, type, condition, query, pageable));
    }
    
    @GetMapping("/stats")
    public ResponseEntity<MaterialStatsDTO> getMaterialStats() {
        return ResponseEntity.ok(materialService.getMaterialStats());
    }
    

    
    @PostMapping("/{id}/pictures")
    public ResponseEntity<Void> addPictures(
            @PathVariable Long id,
            @RequestParam("pictures") List<MultipartFile> pictures) {
        materialService.addPicturesToMaterial(id, pictures);
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/{materialId}/pictures/{pictureId}")
    public ResponseEntity<Void> removePicture(
            @PathVariable Long materialId,
            @PathVariable Long pictureId) {
        materialService.removePictureFromMaterial(materialId, pictureId);
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/{materialId}/pictures/{pictureId}/primary")
    public ResponseEntity<Void> setPrimaryPicture(
            @PathVariable Long materialId,
            @PathVariable Long pictureId) {
        materialService.setPrimaryPicture(materialId, pictureId);
        return ResponseEntity.ok().build();
    }
      @GetMapping("/pictures/{pictureId}")
    public ResponseEntity<byte[]> getPicture(@PathVariable Long pictureId) {
        byte[] pictureData = materialService.getPictureData(pictureId);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG) // You might want to make this dynamic based on the actual image type
                .body(pictureData);
    }
    
    /**
     * Endpoint for importing materials from Excel
     */
    @PostMapping(value = "/import-excel", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> importMaterialsFromExcel(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please upload a non-empty Excel file");
        }

        if (!file.getOriginalFilename().endsWith(".xlsx")) {
            return ResponseEntity.badRequest().body("Please upload an Excel file (.xlsx format)");
        }

        try {
            materialService.importMaterialsFromExcel(file);
            return ResponseEntity.ok("Materials imported successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error importing materials: " + e.getMessage());
        }
    }

    /**
     * Endpoint for exporting materials to Excel
     */    @GetMapping("/export-excel")
    public ResponseEntity<byte[]> exportMaterialsToExcel() {
        try {
            byte[] excelContent = materialService.exportMaterialsToExcel();
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.setContentDispositionFormData("attachment", "materials.xlsx");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(excelContent);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Endpoint for generating an Excel template
     */
    @GetMapping("/excel-template")
    public ResponseEntity<byte[]> getExcelTemplate() {
        try {
            byte[] templateContent = materialService.generateExcelTemplate();
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.setContentDispositionFormData("attachment", "material-template.xlsx");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(templateContent);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}