package com.attvin.repository;

import com.attvin.model.MaterialPicture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MaterialPictureRepository extends JpaRepository<MaterialPicture, Long> {
    
    List<MaterialPicture> findByMaterialId(Long materialId);
    
    Optional<MaterialPicture> findByMaterialIdAndIsPrimaryTrue(Long materialId);
    
    @Modifying
    @Query("UPDATE MaterialPicture p SET p.isPrimary = false WHERE p.material.id = :materialId")
    void clearPrimaryFlagForMaterial(@Param("materialId") Long materialId);
    
    @Modifying
    @Query("UPDATE MaterialPicture p SET p.isPrimary = true WHERE p.id = :pictureId")
    void setPrimaryFlag(@Param("pictureId") Long pictureId);
} 