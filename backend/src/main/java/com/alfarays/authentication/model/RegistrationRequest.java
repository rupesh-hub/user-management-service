package com.alfarays.authentication.model;

import static com.alfarays.shared.CustomValidations.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@PasswordMatch(
        password = "password",
        confirmPassword = "confirmPassword",
        message = "Passwords must match."
)
public record RegistrationRequest(
        @ValidUsername(message = "Invalid username.")
        @NotBlank(message = "First name is mandatory.")
        String firstName,

        @NotBlank(message = "Last name is mandatory")
        String lastName,

        @NotBlank(message = "Username is mandatory.")
        @Size(min = 4, max = 20, message = "Username must be between 4 and 20 characters.")
        String username,

        @NotBlank(message = "Email is mandatory.")
        @Email(message = "Email should be valid.")
        String email,

        @NotBlank(message = "Password is mandatory.")
        @StrongPassword(message = "Password is too weak.")
        String password,

        @NotBlank(message = "Confirm password is mandatory.")
        String confirmPassword
) {
}

