package com.alfarays.role.model;

import com.alfarays.role.entity.Permission;
import com.alfarays.role.entity.Role;

import java.util.Set;
import java.util.stream.Collectors;

public record PermissionResponse(
        Long id,
        String name,
        String category,
        String description,
        Set<String> assignedToRoles
) {
    public static PermissionResponse fromEntity(Permission permission) {
        return new PermissionResponse(
                permission.getId(),
                permission.getName().toLowerCase(),
                permission.getCategory().getCategory().toLowerCase(),
                permission.getDescription(),
                permission.getRoles().stream()
                        .map(Role::getName)
                        .collect(Collectors.toSet())
        );
    }
}