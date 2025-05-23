package com.alfarays.role.repository;

import com.alfarays.role.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    @Query(value = "SELECT * FROM _roles WHERE LOWER(name) = LOWER(:name) LIMIT 1", nativeQuery = true)
    Optional<Role> findByName(@Param("name") String name);

    boolean existsByPermissionsId(Long id);
}