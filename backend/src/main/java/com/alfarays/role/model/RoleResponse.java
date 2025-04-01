package com.alfarays.role.model;

public record RoleResponse(
        Long id,
        String name,
        String description,
        int userCount,
        boolean isSystemRole,
        String createdOn,
        String modifiedOn
) {
}
