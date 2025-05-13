package com.attvin.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class MaterialRecordDTO {
    private Long id;
    private String name;
    private String category;
    private String materialType;
    private String materialCondition;
    private String color;
    private String notes;
    private LocalDateTime dateAdded;
    private List<MaterialPictureDTO> pictures;
    
    // Additional fields for specific material types
    // These will be populated based on the material type
    private Double height;
    private Double width;
    private Double depth;
    private Double uValue;
    private String openingType;
    private String hingeSide;
    private String swingDirection;
    private Boolean heightAdjustable;
    private Boolean hasWheels;
    private String deskType;
    private Double maximumHeight;
}