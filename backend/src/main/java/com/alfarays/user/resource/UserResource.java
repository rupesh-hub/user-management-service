package com.alfarays.user.resource;

import com.alfarays.authentication.model.RegistrationRequest;
import com.alfarays.user.model.ChangePassword;
import com.alfarays.user.model.UserResponse;
import com.alfarays.user.service.IUserService;
import com.alfarays.util.GlobalResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

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

}