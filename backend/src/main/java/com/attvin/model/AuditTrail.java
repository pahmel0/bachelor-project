package com.attvin.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_trails")
public class AuditTrail {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "material_id", nullable = false)
    private MaterialRecord material;
    
    @Column(name = "action", nullable = false)
    @Enumerated(EnumType.STRING)
    private ActionType action;
    
    @Column(name = "details", nullable = false)
    private String details;
    
    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "user_name", nullable = false)
    private String userName;
    
    // Enum
    public enum ActionType {
        CREATED,
        UPDATED,
        DELETED
    }
    
    // Getters and setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public MaterialRecord getMaterial() {
        return material;
    }
    
    public void setMaterial(MaterialRecord material) {
        this.material = material;
    }
    
    public ActionType getAction() {
        return action;
    }
    
    public void setAction(ActionType action) {
        this.action = action;
    }
    
    public String getDetails() {
        return details;
    }
    
    public void setDetails(String details) {
        this.details = details;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getUserName() {
        return userName;
    }
    
    public void setUserName(String userName) {
        this.userName = userName;
    }

    // No-args constructor
    public AuditTrail() {
        // Required by JPA
    }

    // All-args constructor
    public AuditTrail(MaterialRecord material, ActionType action, String details, 
                      LocalDateTime timestamp, Long userId, String userName) {
        this.material = material;
        this.action = action;
        this.details = details;
        this.timestamp = timestamp;
        this.userId = userId;
        this.userName = userName;
    }
}

