package com.attvin.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "office_cabinets")
@DiscriminatorValue("OFFICE_CABINET")
public class OfficeCabinet extends MaterialRecord {
    
    @Column(name = "height", nullable = false)
    private Double height;
    
    @Column(name = "width", nullable = false)
    private Double width;
    
    @Column(name = "depth", nullable = false)
    private Double depth;
    
    @Column(name = "opening_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private OpeningType openingType;
    
    // Enum
    public enum OpeningType {
        DOORS,
        SLIDING_DOORS,
        NO_DOORS
    }
    
    // Getters and setters
    public Double getHeight() {
        return height;
    }
    
    public void setHeight(Double height) {
        this.height = height;
    }
    
    public Double getWidth() {
        return width;
    }
    
    public void setWidth(Double width) {
        this.width = width;
    }
    
    public Double getDepth() {
        return depth;
    }
    
    public void setDepth(Double depth) {
        this.depth = depth;
    }
    
    public OpeningType getOpeningType() {
        return openingType;
    }
    
    public void setOpeningType(OpeningType openingType) {
        this.openingType = openingType;
    }

    // No-args constructor
    public OfficeCabinet() {
        // Required by JPA
    }

    // All-args constructor
    public OfficeCabinet(String name, String category, LocalDateTime dateAdded, 
                        String condition, String notes, String color, Double height, 
                        Double width, Double depth, OpeningType openingType) {
        super(name, category, dateAdded, condition, notes, color);
        this.height = height;
        this.width = width;
        this.depth = depth;
        this.openingType = openingType;
    }
}
 
