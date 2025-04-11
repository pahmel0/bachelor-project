package com.attvin.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.Map;

/**
 * DTO for aggregate statistics of materials in the system.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaterialStatsDTO {
    private Long totalCount;
    private Map<String, Long> conditionCounts;
    private Map<String, Long> categoryCounts;
    private Map<String, Long> typeCounts;
    private Long recentAdditionsCount; // Materials added in the last 30 days
} 