package com.alfarays.user.service;


import com.alfarays.authentication.model.RegistrationRequest;
import com.alfarays.user.model.ChangePassword;
import com.alfarays.user.model.UserResponse;
import com.alfarays.util.GlobalResponse;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface IUserService {

    GlobalResponse<UserResponse> findByUsername(String username);

    GlobalResponse<UserResponse> findByEmail(String email);

    GlobalResponse<UserResponse> findById(Long id);

    GlobalResponse<Boolean> update(RegistrationRequest request, String userId, MultipartFile profile) throws IOException;
    GlobalResponse<Void> changeProfile(MultipartFile profile, Authentication authentication);

    GlobalResponse<Boolean> delete(String userId) throws IOException;

    GlobalResponse<Boolean> assignRole(String userId, String[] names);

    GlobalResponse<Boolean> removeRole(String userId, String[] names);

    GlobalResponse<Void> resetPasswordRequest(String username);

    GlobalResponse<Void> changePassword(ChangePassword request,
                                        Authentication authentication);
}
