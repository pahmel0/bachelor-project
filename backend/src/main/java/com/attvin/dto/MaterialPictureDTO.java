package com.attvin.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MaterialPictureDTO {
    private Long id;
    private String fileName;
    private String contentType;
    private Long fileSize;
    private LocalDateTime uploadDate;
    private Boolean isPrimary;
    private String description;
    // We don't include the binary data in the DTO for list responses
    // It will be handled separately during upload/download operations
} 