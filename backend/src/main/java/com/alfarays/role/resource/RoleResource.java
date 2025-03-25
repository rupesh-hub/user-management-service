package com.alfarays.role.resource;

import com.alfarays.role.service.IRoleService;
import com.alfarays.util.GlobalResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/roles")
@RequiredArgsConstructor
@Tag(name = "user_roles")
public class RoleResource {

    private final IRoleService roleService;

    @PostMapping
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<GlobalResponse<Void>> save(@RequestBody @Valid Set<String> request) {
        return ResponseEntity.ok(roleService.save(request));
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<GlobalResponse<Set<String>>> getAll(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(roleService.getAll(page, size));
    }

    @GetMapping("/by.name/{name}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<GlobalResponse<Set<String>>> getByName(@PathVariable String name) {
        return ResponseEntity.ok(roleService.getByName(name));
    }

}