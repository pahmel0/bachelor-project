package com.attvin.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "material_records")
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "material_type")
public abstract class MaterialRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    @Column(name = "date_added", nullable = false)
    private LocalDateTime dateAdded;

    @Column(nullable = false)
    private String condition;

    private String notes;

    @Column(nullable = false)
    private String color;

    @OneToMany(mappedBy = "material", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MaterialPicture> pictures = new ArrayList<>();

    // Helper methods for managing the pictures relationship
    public void addPicture(MaterialPicture picture) {
        pictures.add(picture);
        picture.setMaterial(this);
    }

    public void removePicture(MaterialPicture picture) {
        pictures.remove(picture);
        picture.setMaterial(null);
    }

    // Getter for primary picture
    public MaterialPicture getPrimaryPicture() {
        return pictures.stream()
                .filter(MaterialPicture::getIsPrimary)
                .findFirst()
                .orElse(null);
    }

    // Common getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public LocalDateTime getDateAdded() {
        return dateAdded;
    }

    public void setDateAdded(LocalDateTime dateAdded) {
        this.dateAdded = dateAdded;
    }

    public String getCondition() {
        return condition;
    }

    public void setCondition(String condition) {
        this.condition = condition;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public List<MaterialPicture> getPictures() {
        return pictures;
    }

    public void setPictures(List<MaterialPicture> pictures) {
        this.pictures = pictures;
    }
} 