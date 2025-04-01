package com.alfarays.role.model;

import java.util.List;

public record PermissionCategoryResponse(String categoryName, List<PermissionResponse> permissions) {
}
