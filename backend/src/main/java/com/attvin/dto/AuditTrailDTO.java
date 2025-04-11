package com.attvin.dto;

import com.attvin.model.AuditTrail;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

/**
 * DTO for AuditTrail entity.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditTrailDTO {
    private Long id;
    private Long materialId;
    private String materialName;
    private String action;
    private String details;
    private LocalDateTime timestamp;
    private Long userId;
    private String userName;
    
    public static AuditTrailDTO fromEntity(AuditTrail auditTrail) {
        if (auditTrail == null) {
            return null;
        }
        
        return AuditTrailDTO.builder()
                .id(auditTrail.getId())
                .materialId(auditTrail.getMaterial().getId())
                .materialName(auditTrail.getMaterial().getName())
                .action(auditTrail.getAction().name())
                .details(auditTrail.getDetails())
                .timestamp(auditTrail.getTimestamp())
                .userId(auditTrail.getUserId())
                .userName(auditTrail.getUserName())
                .build();
    }
} 