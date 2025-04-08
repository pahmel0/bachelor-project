package com.attvin.model;

import jakarta.persistence.*;

@Entity
@Table(name = "doors")
@DiscriminatorValue("DOOR")
public class Door extends MaterialRecord {
    
    @Column(name = "height", nullable = false)
    private Double height;
    
    @Column(name = "width", nullable = false)
    private Double width;
    
    @Column(name = "swing_direction", nullable = false)
    @Enumerated(EnumType.STRING)
    private SwingDirection swingDirection;
    
    @Column(name = "u_value")
    private Double uValue;
    
    // Enum
    public enum SwingDirection {
        RIGHT,
        LEFT
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
    
    public SwingDirection getSwingDirection() {
        return swingDirection;
    }
    
    public void setSwingDirection(SwingDirection swingDirection) {
        this.swingDirection = swingDirection;
    }
    
    public Double getUValue() {
        return uValue;
    }
    
    public void setUValue(Double uValue) {
        this.uValue = uValue;
    }
} 