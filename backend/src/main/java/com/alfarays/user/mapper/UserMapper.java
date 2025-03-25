package com.alfarays.user.mapper;

import com.alfarays.image.entity.Image;
import com.alfarays.image.model.ImageResponse;
import com.alfarays.user.entity.User;
import com.alfarays.authentication.model.RegistrationRequest;
import com.alfarays.user.model.UserResponse;

import java.util.Optional;
import java.util.UUID;

public final class UserMapper {

    private UserMapper() {
    }

    public static User toEntity(RegistrationRequest request) {
        return User
                .builder()
                .username(request.username())
                .email(request.email())
                .firstName(request.firstName())
                .lastName(request.lastName())
                .password(request.password())
                .build();
    }

    public static UserResponse toResponse(User user) {
        return UserResponse
                .builder()
                .userId(UUID.randomUUID().toString())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .username(user.getUsername())
                .enabled(user.isEnabled())
                .roles(user.getRoles())
                .profile(
                        Optional.ofNullable(user.getProfile())
                                .map(UserMapper::imageResponse)
                                .orElse(null)
                )
                .build();
    }

    private static String randomString() {
        return UUID.randomUUID().toString();
    }

    public static ImageResponse imageResponse(Image image) {
        return ImageResponse
                .builder()
                .id(image.getId())
                .filename(image.getFilename())
                .contentType(image.getContentType())
                .size(image.getSize())
                .createdOn(image.getCreatedOn().toString())
                .modifiedOn(image.getModifiedOn().toString())
                .modifiedBy(image.getModifiedBy())
                .path(image.getPath())
                .build();
    }
}
