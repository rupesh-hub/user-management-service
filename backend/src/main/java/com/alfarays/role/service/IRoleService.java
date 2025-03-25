package com.alfarays.role.service;

import com.alfarays.util.GlobalResponse;

import java.util.Set;

public interface IRoleService {

    GlobalResponse<Void> save(Set<String> request);
    GlobalResponse<Set<String>> getAll(int page, int size);
    GlobalResponse<Set<String>> getByName(String name);

}