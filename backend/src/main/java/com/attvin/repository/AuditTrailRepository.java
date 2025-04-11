package com.attvin.repository;

import com.attvin.model.AuditTrail;
import com.attvin.model.MaterialRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditTrailRepository extends JpaRepository<AuditTrail, Long> {
    List<AuditTrail> findByMaterial(MaterialRecord material);
    List<AuditTrail> findByMaterialId(Long materialId);
    List<AuditTrail> findByUserIdOrderByTimestampDesc(Long userId);
    List<AuditTrail> findAllByOrderByTimestampDesc();
} 