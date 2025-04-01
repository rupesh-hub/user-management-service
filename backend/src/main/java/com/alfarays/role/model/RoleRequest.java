package com.alfarays.role.model;

import java.util.List;

public record RoleRequest(
        String name,
        String description,
        boolean isSystemRole
) {
}
