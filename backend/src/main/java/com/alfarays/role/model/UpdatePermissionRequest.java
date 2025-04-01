package com.alfarays.role.model;


import com.alfarays.role.enums.PermissionCategory;
import jakarta.validation.constraints.NotBlank;

public record UpdatePermissionRequest(
        @NotBlank String name,
        PermissionCategory category,
        String description
) {}