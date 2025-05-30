package com.attvin.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "windows")
@DiscriminatorValue("WINDOW")
public class Window extends MaterialRecord {
    
    @Column(name = "height", nullable = false)
    private Double height;
    
    @Column(name = "width", nullable = false)
    private Double width;
    
    @Column(name = "opening_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private OpeningType openingType;

    @Column(name = "hinge_side")
    @Enumerated(EnumType.STRING)
    private HingeSide hingeSide;
    
    @Column(name = "u_value")
    private Double uValue;
    
    // Enums
    public enum OpeningType {
        FIXED_PANE,
        TOP_HUNG,
        SIDE_HUNG,
        TILT,
        SLIDING
    }
    
    public enum HingeSide {
        RIGHT,
        LEFT,
        TOP,
        BOTTOM,
        NONE
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

    public OpeningType getOpeningType() {
        return openingType;
    }
    
    public void setOpeningType(OpeningType openingType) {
        this.openingType = openingType;
    }
    
    public HingeSide getHingeSide() {
        return hingeSide;
    }
    
    public void setHingeSide(HingeSide hingeSide) {
        this.hingeSide = hingeSide;
    }
    
    public Double getUValue() {
        return uValue;
    }
    
    public void setUValue(Double uValue) {
        this.uValue = uValue;
    }

    // No-args constructor
    public Window() {
        // Required by JPA
    }

    // All-args constructor
    public Window(String name, String category, LocalDateTime dateAdded, String condition, 
                 String notes, String color, Double height, Double width, 
                 OpeningType openingType, HingeSide hingeSide, Double uValue) {
        super(name, category, dateAdded, condition, notes, color);
        this.height = height;
        this.width = width;
        this.openingType = openingType;
        this.hingeSide = hingeSide;
        this.uValue = uValue;
    }
}
