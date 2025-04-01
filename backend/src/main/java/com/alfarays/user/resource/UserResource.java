package com.alfarays.user.resource;

import com.alfarays.authentication.model.RegistrationRequest;
import com.alfarays.user.model.ChangePassword;
import com.alfarays.user.model.UserFilterDTO;
import com.alfarays.user.model.UserResponse;
import com.alfarays.user.service.IUserService;
import com.alfarays.util.GlobalResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Tag(name = "users")
public class UserResource {

    private final IUserService userService;

    @GetMapping("/by.id/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<GlobalResponse<UserResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    @GetMapping("/by.username/{username}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<GlobalResponse<UserResponse>> getByUsername(@PathVariable String username) {
        return ResponseEntity.ok(userService.findByUsername(username));
    }

    @GetMapping("/by.email/{email}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<GlobalResponse<UserResponse>> getByEmail(@PathVariable String email) {
        return ResponseEntity.ok(userService.findByEmail(email));
    }

    @PutMapping("/{username}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<GlobalResponse<Boolean>> update(
            @RequestBody final RegistrationRequest request,
            @PathVariable(name="username") String username,
            @RequestParam(required = false) MultipartFile profile

    ) throws IOException {
        return ResponseEntity.ok(userService.update(request, username, profile));
    }

    @DeleteMapping("/{username}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<GlobalResponse<Boolean>> delete(
            @PathVariable("username") String username
    ) throws IOException {
        return ResponseEntity.ok(userService.delete(username));
    }

    @PutMapping("/assign.roles")
    public ResponseEntity<GlobalResponse<Boolean>> assignRole(
            @RequestParam(name = "username") String username,
            @RequestParam(name = "names") String[] names
    ) {
        return ResponseEntity.ok(userService.assignRole(username, names));
    }

    @PutMapping("/remove.roles")
    public ResponseEntity<GlobalResponse<Boolean>> unAssignRole(
            @RequestParam(name = "username") String username,
            @RequestParam(name = "names") String[] names
    ) {
        return ResponseEntity.ok(userService.removeRole(username, names));
    }

    @GetMapping("/reset-password")
    public ResponseEntity<GlobalResponse<Void>> passwordReset(@RequestParam("username") String username) {
        userService.resetPasswordRequest(username);
        return ResponseEntity.ok(GlobalResponse.success());
    }

    @PostMapping("/reset-password")
    public ResponseEntity<GlobalResponse<Void>> passwordReset(
            @RequestBody @Valid ChangePassword request,
            Authentication authentication
    ) {
        userService.changePassword(request, authentication);
        return ResponseEntity.ok(GlobalResponse.success());
    }

    @GetMapping
    public GlobalResponse<List<UserResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String firstName,
            @RequestParam(required = false) String lastName,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate createdAfter,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate createdBefore,
            @RequestParam(defaultValue = "createdOn") String sortBy,
            @RequestParam(defaultValue = "DESC") Sort.Direction sortDirection
    ) {
        UserFilterDTO filter = new UserFilterDTO();
        filter.setSearchTerm(search);
        filter.setFirstName(firstName);
        filter.setLastName(lastName);
        filter.setEmail(email);
        filter.setUsername(username);
        filter.setActive(active);
        filter.setCreatedAfter(createdAfter);
        filter.setCreatedBefore(createdBefore);
        filter.setSortBy(sortBy);
        filter.setSortDirection(sortDirection);

        Pageable pageable = PageRequest.of(page, size);
        return userService.getFilteredUsers(filter, pageable);
    }

}