package com.attvin.controller;

import com.attvin.dto.AuditTrailDTO;
import com.attvin.repository.AuditTrailRepository;
import com.attvin.model.AuditTrail;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/audit-trail")
@RequiredArgsConstructor
public class AuditTrailController {

    private final AuditTrailRepository auditTrailRepository;
    
    @GetMapping
    public ResponseEntity<List<AuditTrailDTO>> getRecentActivity() {
        List<AuditTrail> recentActivity = auditTrailRepository.findAllByOrderByTimestampDesc();
        
        List<AuditTrailDTO> activityDTOs = recentActivity.stream()
                .map(AuditTrailDTO::fromEntity)
                .limit(10) // Limit to the 10 most recent activities
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(activityDTOs);
    }
    
    @GetMapping("/material/{materialId}")
    public ResponseEntity<List<AuditTrailDTO>> getMaterialActivity(@PathVariable Long materialId) {
        List<AuditTrail> materialActivity = auditTrailRepository.findByMaterialId(materialId);
        
        List<AuditTrailDTO> activityDTOs = materialActivity.stream()
                .map(AuditTrailDTO::fromEntity)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(activityDTOs);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AuditTrailDTO>> getUserActivity(@PathVariable Long userId) {
        List<AuditTrail> userActivity = auditTrailRepository.findByUserIdOrderByTimestampDesc(userId);
        
        List<AuditTrailDTO> activityDTOs = userActivity.stream()
                .map(AuditTrailDTO::fromEntity)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(activityDTOs);
    }
} 