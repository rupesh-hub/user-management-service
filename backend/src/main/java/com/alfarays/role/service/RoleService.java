package com.alfarays.role.service;

import com.alfarays.exception.AuthorizationException;
import com.alfarays.role.entity.Role;
import com.alfarays.role.repository.RoleRepository;
import com.alfarays.util.GlobalResponse;
import com.alfarays.util.Paging;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleService implements IRoleService {

    private final RoleRepository repository;

    @Override
    public GlobalResponse<Void> save(Set<String> request) {

        repository.saveAll(
                request.stream()
                        .map(roleName -> {
                            Role role = new Role();
                            role.setName(roleName);
                            return role;
                        })
                        .collect(Collectors.toSet())
        );

        return GlobalResponse.success();
    }

    @Override
    public GlobalResponse<Set<String>> getAll(int page, int size) {
        Page<Role> rolePage = repository.findAll(PageRequest.of(page, size));

        return GlobalResponse.success(
                rolePage.getContent()
                        .stream()
                        .map(Role::getName)
                        .collect(Collectors.toSet())
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
    public GlobalResponse<Set<String>> getByName(String name) {
        var role = repository
                .findByName(name)
                .orElseThrow(() -> new AuthorizationException("Role by " + name + " not found."));

        return GlobalResponse.success(Set.of(role.getName()));
    }


}