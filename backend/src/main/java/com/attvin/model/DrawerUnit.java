package com.attvin.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "drawer_units")
@DiscriminatorValue("DRAWER_UNIT")
public class DrawerUnit extends MaterialRecord {
    
    @Column(name = "height", nullable = false)
    private Double height;
    
    @Column(name = "width", nullable = false)
    private Double width;
    
    @Column(name = "depth", nullable = false)
    private Double depth;
    
    @Column(name = "has_wheels", nullable = false)
    private Boolean hasWheels;
    
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
    
    public Boolean getHasWheels() {
        return hasWheels;
    }
    
    public void setHasWheels(Boolean hasWheels) {
        this.hasWheels = hasWheels;
    }

    // No-args constructor
    public DrawerUnit() {
        // Required by JPA
    }

    // All-args constructor
    public DrawerUnit(String name, String category, LocalDateTime dateAdded, 
                     String condition, String notes, String color, Double height, 
                     Double width, Double depth, Boolean hasWheels) {
        super(name, category, dateAdded, condition, notes, color);
        this.height = height;
        this.width = width;
        this.depth = depth;
        this.hasWheels = hasWheels;
    }
}

