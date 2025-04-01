package com.alfarays.role.resource;

import com.alfarays.role.entity.Permission;
import com.alfarays.role.enums.PermissionCategory;
import com.alfarays.role.model.CreatePermissionRequest;
import com.alfarays.role.model.PermissionCategoryResponse;
import com.alfarays.role.model.PermissionResponse;
import com.alfarays.role.model.UpdatePermissionRequest;
import com.alfarays.role.service.PermissionService;
import com.alfarays.util.GlobalResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/permissions")
@RequiredArgsConstructor
public class PermissionResource {

    private final PermissionService permissionService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GlobalResponse<PermissionResponse> createPermission(@Valid @RequestBody CreatePermissionRequest request) {
        return permissionService.createPermission(request);
    }

    @PostMapping("/bulk")
    @ResponseStatus(HttpStatus.CREATED)
    public GlobalResponse<List<PermissionResponse>> createPermissions(
            @Valid @RequestBody List<CreatePermissionRequest> requests
    ) {
        return permissionService.createPermissions(requests);
    }


    @GetMapping("/{id}")
    public GlobalResponse<PermissionResponse> getPermission(@PathVariable Long id) {
        return permissionService.getPermissionById(id);
    }

    @GetMapping
    public GlobalResponse<List<PermissionResponse>> getAllPermissions(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size
    ) {
        return permissionService.getPermissions(page, size);
    }

    @PutMapping("/{id}")
    public GlobalResponse<PermissionResponse> updatePermission(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePermissionRequest request
    ) {
        return permissionService.updatePermission(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePermission(@PathVariable Long id) {
        permissionService.deletePermission(id);
    }

    @GetMapping("/category/{category}")
    public List<PermissionResponse> getPermissionsByCategory(@PathVariable PermissionCategory category) {
        return permissionService.getPermissionsByCategory(category);
    }

    @GetMapping("/role/{roleId}")
    public List<PermissionResponse> getPermissionsByRole(@PathVariable Long roleId) {
        return permissionService.getPermissionsByRole(roleId);
    }

    @GetMapping("/categories")
    public GlobalResponse<List<PermissionCategoryResponse>> getPermissionsByCategory() {
        return permissionService.permissionByCategories();
    }

}
