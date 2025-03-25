package com.alfarays.user.model;


import com.alfarays.image.model.ImageResponse;
import com.alfarays.role.entity.Role;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class UserResponse {

    private String userId;
    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private List<Role> roles;
    private boolean enabled;
    private ImageResponse profile;

}