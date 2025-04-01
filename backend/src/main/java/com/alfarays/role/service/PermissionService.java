package com.alfarays.role.service;

import com.alfarays.exception.AuthorizationException;
import com.alfarays.role.entity.Permission;
import com.alfarays.role.entity.Role;
import com.alfarays.role.enums.PermissionCategory;
import com.alfarays.role.model.*;
import com.alfarays.role.repository.PermissionRepository;
import com.alfarays.role.repository.RoleRepository;
import com.alfarays.user.entity.User;
import com.alfarays.util.GlobalResponse;
import com.alfarays.util.Paging;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PermissionService {

    private final PermissionRepository permissionRepository;
    private final RoleRepository roleRepository;

    public GlobalResponse<PermissionResponse> createPermission(CreatePermissionRequest request) {
        if (permissionRepository.existsByName(request.name())) {
            throw new AuthorizationException("Permission with name " + request.name() + " already exists");
        }

        Permission permission = Permission.builder()
                .name(request.name().toLowerCase())
                .category(request.category())
                .description(request.description())
                .build();

        permission = permissionRepository.save(permission);
        log.info("Created new permission with ID: {}", permission.getId());
        return GlobalResponse.success(PermissionResponse.fromEntity(permission));
    }

    public GlobalResponse<List<PermissionResponse>> createPermissions(List<CreatePermissionRequest> requests) {
        // Validate all names first
        List<String> permissionNames = requests.stream()
                .map(CreatePermissionRequest::name)
                .map(String::toLowerCase)
                .toList();

        List<String> existingPermissions = permissionRepository.findByNameIn(permissionNames)
                .stream()
                .map(Permission::getName)
                .toList();

        if (!existingPermissions.isEmpty()) {
            throw new AuthorizationException(
                    "Some permissions already exist: " + String.join(", ", existingPermissions)
            );
        }

        // Create all permissions
        List<Permission> createdPermissions = requests.stream()
                .map(request -> Permission.builder()
                        .name(request.name().toLowerCase())
                        .category(request.category())
                        .description(request.description())
                        .build())
                .toList();

        List<Permission> savedPermissions = permissionRepository.saveAll(createdPermissions);
        log.info("Created {} new permissions", savedPermissions.size());

        List<PermissionResponse> responses = savedPermissions.stream()
                .map(PermissionResponse::fromEntity)
                .toList();

        return GlobalResponse.success(responses);
    }

    public GlobalResponse<PermissionResponse> getPermissionById(Long id) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new AuthorizationException("Permission not found with ID: " + id));
        return GlobalResponse.success(PermissionResponse.fromEntity(permission));
    }

    public GlobalResponse<List<PermissionResponse>> getPermissions(int page, int limit) {
        Page<Permission> permissionPage = permissionRepository.findAll(PageRequest.of(page, limit));
        return GlobalResponse.success(
                permissionPage.getContent()
                        .stream()
                        .map(PermissionResponse::fromEntity).collect(Collectors.toList())
                ,
                Paging.builder()
                        .page(page)
                        .size(limit)
                        .totalElements(permissionPage.getTotalElements())
                        .totalPages(permissionPage.getTotalPages())
                        .first(permissionPage.isFirst())
                        .last(permissionPage.isLast())
                        .build()
        );
    }

    public GlobalResponse<PermissionResponse> updatePermission(Long id, UpdatePermissionRequest request) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new AuthorizationException("Permission not found with ID: " + id));

        if (!permission.getName().equals(request.name()) && permissionRepository.existsByName(request.name())) {
            throw new AuthorizationException("Permission with name " + request.name() + " already exists");
        }

        permission.setName(request.name());
        permission.setCategory(request.category());
        permission.setDescription(request.description());

        permission = permissionRepository.save(permission);
        log.info("Updated permission with ID: {}", permission.getId());
        return GlobalResponse.success(PermissionResponse.fromEntity(permission));
    }

    public void deletePermission(Long id) {
        if (!permissionRepository.existsById(id)) {
            throw new AuthorizationException("Permission not found with ID: " + id);
        }

        // Check if any roles are using this permission
        if (roleRepository.existsByPermissionsId(id)) {
            throw new AuthorizationException("Cannot delete permission as it's assigned to one or more roles");
        }

        permissionRepository.deleteById(id);
        log.info("Deleted permission with ID: {}", id);
    }

    public List<PermissionResponse> getPermissionsByCategory(PermissionCategory category) {
        return permissionRepository.findByCategory(category).stream()
                .map(PermissionResponse::fromEntity)
                .toList();
    }

    public List<PermissionResponse> getPermissionsByRole(Long roleId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new AuthorizationException("Role not found with ID: " + roleId));

        return role.getPermissions().stream()
                .map(PermissionResponse::fromEntity)
                .toList();
    }

    public GlobalResponse<List<PermissionCategoryResponse>> permissionByCategories() {

        Map<String, List<PermissionResponse>> grouped = permissionRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(
                        p -> p.getCategory().getCategory(),
                        Collectors.mapping(PermissionResponse::fromEntity, Collectors.toList())
                ));

        List<PermissionCategoryResponse> result = grouped.entrySet().stream()
                .map(e -> new PermissionCategoryResponse(e.getKey(), e.getValue()))
                .collect(Collectors.toList());

        return GlobalResponse.success(result);
    }
}