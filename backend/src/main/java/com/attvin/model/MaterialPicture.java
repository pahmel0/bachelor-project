package com.attvin.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "material_pictures")
public class MaterialPicture {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_id", nullable = false)
    private MaterialRecord material;
    
    @Lob
    @Column(name = "picture_data", nullable = false)
    private byte[] pictureData;
    
    @Column(name = "upload_date", nullable = false)
    private LocalDateTime uploadDate;
    
    @Column(name = "is_primary", nullable = false)
    private Boolean isPrimary;
    
    @Column(name = "file_name", nullable = false)
    private String fileName;
    
    @Column(name = "file_size", nullable = false)
    private Long fileSize;
    
    @Column(name = "content_type", nullable = false)
    private String contentType;
    
    @Column(name = "description")
    private String description;
    
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
    
    public byte[] getPictureData() {
        return pictureData;
    }
    
    public void setPictureData(byte[] pictureData) {
        this.pictureData = pictureData;
    }
    
    public LocalDateTime getUploadDate() {
        return uploadDate;
    }
    
    public void setUploadDate(LocalDateTime uploadDate) {
        this.uploadDate = uploadDate;
    }
    
    public Boolean getIsPrimary() {
        return isPrimary;
    }
    
    public void setIsPrimary(Boolean isPrimary) {
        this.isPrimary = isPrimary;
    }
    
    public String getFileName() {
        return fileName;
    }
    
    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
    
    public Long getFileSize() {
        return fileSize;
    }
    
    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }
    
    public String getContentType() {
        return contentType;
    }
    
    public void setContentType(String contentType) {
        this.contentType = contentType;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }

    // No-args constructor
    public MaterialPicture() {
        // Required by JPA
    }

    // All-args constructor
    public MaterialPicture(MaterialRecord material, byte[] pictureData, 
                         LocalDateTime uploadDate, Boolean isPrimary, String fileName, 
                         Long fileSize, String contentType, String description) {
        this.material = material;
        this.pictureData = pictureData;
        this.uploadDate = uploadDate;
        this.isPrimary = isPrimary;
        this.fileName = fileName;
        this.fileSize = fileSize;
        this.contentType = contentType;
        this.description = description;
    }
}
 
