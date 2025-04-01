package com.alfarays.role.service;

import com.alfarays.exception.AuthorizationException;
import com.alfarays.role.entity.Role;
import com.alfarays.role.model.RoleRequest;
import com.alfarays.role.model.RoleResponse;
import com.alfarays.role.repository.RoleRepository;
import com.alfarays.util.GlobalResponse;
import com.alfarays.util.Paging;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleService implements IRoleService {

    private final RoleRepository repository;

    @Override
    public GlobalResponse<RoleResponse> save(RoleRequest request) {

        var role = repository.save(Role.builder()
                .name(request.name())
                .description(request.description())
                .isSystemRole(request.isSystemRole())
                .build());

        return GlobalResponse.success(
                new RoleResponse(
                        role.getId(),
                        role.getName(),
                        role.getDescription(),
                        3,
                        role.isSystemRole(),
                        role.getCreatedOn().toString(),
                        role.getModifiedOn().toString()
                )
        );
    }

    @Override
    public GlobalResponse<List<RoleResponse>> getAll(int page, int size) {
        Page<Role> rolePage = repository.findAll(PageRequest.of(page, size));

        return GlobalResponse.success(
                rolePage.getContent()
                        .stream()
                        .map(role -> new RoleResponse(
                                        role.getId(),
                                        role.getName(),
                                        role.getDescription(),
                                        3,
                                        role.isSystemRole(),
                                        role.getCreatedOn().toString(),
                                        role.getModifiedOn().toString()
                                )
                        ).collect(Collectors.toList())
                ,
                Paging.builder()
                        .page(page)
                        .size(size)
                        .totalElements(rolePage.getTotalElements())
                        .totalPages(rolePage.getTotalPages())
                        .first(rolePage.isFirst())
                        .last(rolePage.isLast())
                        .build()
        );
    }

    @Override
    public GlobalResponse<RoleResponse> getByName(String name) {
        var role = repository
                .findByName(name)
                .orElseThrow(() -> new AuthorizationException("Role by " + name + " not found."));

        return GlobalResponse.success(
                new RoleResponse(
                        role.getId(),
                        role.getName(),
                        role.getDescription(),
                        3,
                        role.isSystemRole(),
                        role.getCreatedOn().toString(),
                        role.getModifiedOn().toString()
                )
        );
    }

    @Override
    public GlobalResponse<RoleResponse> update(Long id, RoleRequest request) {
        var role = repository.findById(id)
                .orElseThrow(() -> new AuthorizationException("Role by " + id + " not found."));
        if (Objects.nonNull(request.name()) && !request.name().isEmpty()) {
            role.setName(request.name());
        }

        if (Objects.nonNull(request.description()) && !request.description().isEmpty()) {
            role.setDescription(request.description());
        }

        role.setSystemRole(request.isSystemRole());
        role.setModifiedOn(LocalDateTime.now());
        repository.save(role);
        return GlobalResponse.success(
                new RoleResponse(
                        role.getId(),
                        role.getName(),
                        role.getDescription(),
                        0,
                        role.isSystemRole(),
                        role.getCreatedOn().toString(),
                        role.getModifiedOn().toString()
                )
        );
    }

    @Override
    public GlobalResponse<Void> delete(long id) {
        var role = repository.findById(id)
                .orElseThrow(() -> new AuthorizationException("Role by " + id + " not found."));
        repository.delete(role);
        return GlobalResponse.success();
    }


}