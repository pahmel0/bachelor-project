package com.attvin.repository;

import com.attvin.model.MaterialRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MaterialRepository extends JpaRepository<MaterialRecord, Long> {
    
    @Query("SELECT m FROM MaterialRecord m WHERE " +
           "(:category IS NULL OR m.category = :category) AND " +
           "(:type IS NULL OR TYPE(m) = :type) AND " +
           "(:condition IS NULL OR m.condition = :condition) AND " +
           "(:query IS NULL OR " +
           "LOWER(m.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(m.notes) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<MaterialRecord> searchMaterials(
            @Param("category") String category,
            @Param("type") String type,
            @Param("condition") String condition,
            @Param("query") String query,
            Pageable pageable);
} 