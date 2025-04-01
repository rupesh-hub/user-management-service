package com.alfarays.role.repository;

import com.alfarays.role.entity.Permission;
import com.alfarays.role.enums.PermissionCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {

    Optional<Permission> findByName(String name);
    boolean existsByName(String name);
    List<Permission> findByCategory(PermissionCategory category);

    List<Permission> findByNameIn(List<String> permissionNames);
}
