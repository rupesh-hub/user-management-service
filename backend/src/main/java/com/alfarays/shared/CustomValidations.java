package com.alfarays.shared;


import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;
import org.passay.*;

import java.lang.annotation.*;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

public class CustomValidations {

    // Password Match Annotation
    @Target({ElementType.TYPE})
    @Retention(RetentionPolicy.RUNTIME)
    @Constraint(validatedBy = PasswordMatchValidator.class)
    public @interface PasswordMatch {
        String message() default "Password and confirm password do not match.";

        String password();

        String confirmPassword();

        Class<?>[] groups() default {};

        Class<? extends Payload>[] payload() default {};
    }

    // Password Match Validator
    public static class PasswordMatchValidator implements ConstraintValidator<PasswordMatch, Object> {
        private String passwordField;
        private String confirmPasswordField;

        @Override
        public void initialize(PasswordMatch constraintAnnotation) {
            this.passwordField = constraintAnnotation.password();
            this.confirmPasswordField = constraintAnnotation.confirmPassword();
        }

        @Override
        public boolean isValid(Object object, ConstraintValidatorContext context) {
            try {
                Object passwordValue = org.springframework.beans.BeanUtils
                        .getPropertyDescriptor(object.getClass(), passwordField)
                        .getReadMethod()
                        .invoke(object);

                Object confirmPasswordValue = org.springframework.beans.BeanUtils
                        .getPropertyDescriptor(object.getClass(), confirmPasswordField)
                        .getReadMethod()
                        .invoke(object);

                return passwordValue != null && passwordValue.equals(confirmPasswordValue);
            } catch (Exception e) {
                return false;
            }
        }
    }

    // Strong Password Annotation
    @Target({ElementType.FIELD, ElementType.METHOD, ElementType.PARAMETER})
    @Retention(RetentionPolicy.RUNTIME)
    @Constraint(validatedBy = StrongPasswordValidator.class)
    public @interface StrongPassword {
        String message() default "Password is too weak";

        Class<?>[] groups() default {};

        Class<? extends Payload>[] payload() default {};

        // Additional customization options
        int minLength() default 8;

        int maxLength() default 64;
    }

    // Strong Password Validator
    public static class StrongPasswordValidator implements ConstraintValidator<StrongPassword, String> {
        private int minLength;
        private int maxLength;

        @Override
        public void initialize(StrongPassword constraintAnnotation) {
            this.minLength = constraintAnnotation.minLength();
            this.maxLength = constraintAnnotation.maxLength();
        }

        @Override
        public boolean isValid(String password, ConstraintValidatorContext context) {
            if (password == null) return false;

            // Passay password validation rules
            PasswordValidator validator = new PasswordValidator(Arrays.asList(
                    // Length rule
                    new LengthRule(minLength, maxLength),

                    // At least one upper case letter
                    new CharacterRule(EnglishCharacterData.UpperCase, 1),

                    // At least one lower case letter
                    new CharacterRule(EnglishCharacterData.LowerCase, 1),

                    // At least one digit
                    new CharacterRule(EnglishCharacterData.Digit, 1),

                    // At least one special character
                    new CharacterRule(EnglishCharacterData.Special, 1),

                    // No whitespace
                    new WhitespaceRule()
            ));

            RuleResult result = validator.validate(new PasswordData(password));
            return result.isValid();
        }
    }

    // Username Validation Annotation
    @Target({ElementType.FIELD, ElementType.METHOD, ElementType.PARAMETER})
    @Retention(RetentionPolicy.RUNTIME)
    @Constraint(validatedBy = UsernameValidator.class)
    public @interface ValidUsername {
        String message() default "Invalid username";

        Class<?>[] groups() default {};

        Class<? extends Payload>[] payload() default {};

        // Customization options
        int minLength() default 4;

        int maxLength() default 20;
    }

    // Username Validator
    public static class UsernameValidator implements ConstraintValidator<ValidUsername, String> {
        // Forbidden usernames (case-insensitive)
        private static final List<String> FORBIDDEN_USERNAMES = Arrays.asList(
                "admin", "administrator", "root",
                "system", "username", "password",
                "user", "test", "guest"
        );

        // Regex for allowed characters
        private static final Pattern USERNAME_PATTERN = Pattern.compile(
                "^[a-zA-Z0-9._@#&-]+$"
        );

        private int minLength;
        private int maxLength;

        @Override
        public void initialize(ValidUsername constraintAnnotation) {
            this.minLength = constraintAnnotation.minLength();
            this.maxLength = constraintAnnotation.maxLength();
        }

        @Override
        public boolean isValid(String username, ConstraintValidatorContext context) {
            if (username == null) return false;

            // Check length
            if (username.length() < minLength || username.length() > maxLength) {
                return false;
            }

            // Check against forbidden usernames
            if (FORBIDDEN_USERNAMES.stream()
                    .anyMatch(forbidden -> username.toLowerCase().contains(forbidden))) {
                return false;
            }

            // Check allowed characters
            return USERNAME_PATTERN.matcher(username).matches();
        }
    }
}