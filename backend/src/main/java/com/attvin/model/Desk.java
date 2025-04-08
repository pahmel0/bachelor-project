package com.attvin.model;

import jakarta.persistence.*;

@Entity
@Table(name = "desks")
@DiscriminatorValue("DESK")
public class Desk extends MaterialRecord {
    
    @Column(name = "desk_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private DeskType deskType;
    
    @Column(name = "height_adjustable", nullable = false)
    private Boolean heightAdjustable;
    
    @Column(name = "maximum_height", nullable = false)
    private Double maximumHeight;
    
    @Column(name = "width", nullable = false)
    private Double width;
    
    @Column(name = "depth", nullable = false)
    private Double depth;
    
    // Enum
    public enum DeskType {
        CORNER_DESK,
        STRAIGHT_DESK
    }
    
    // Getters and setters
    public DeskType getDeskType() {
        return deskType;
    }
    
    public void setDeskType(DeskType deskType) {
        this.deskType = deskType;
    }
    
    public Boolean getHeightAdjustable() {
        return heightAdjustable;
    }
    
    public void setHeightAdjustable(Boolean heightAdjustable) {
        this.heightAdjustable = heightAdjustable;
    }
    
    public Double getMaximumHeight() {
        return maximumHeight;
    }
    
    public void setMaximumHeight(Double maximumHeight) {
        this.maximumHeight = maximumHeight;
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
} 