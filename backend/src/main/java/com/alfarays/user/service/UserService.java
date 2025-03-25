package com.alfarays.user.service;

import com.alfarays.exception.AuthorizationException;
import com.alfarays.image.entity.Image;
import com.alfarays.image.repository.ImageRepository;
import com.alfarays.image.service.ImageService;
import com.alfarays.mail.service.IMailService;
import com.alfarays.mail.model.MailRequest;
import com.alfarays.mail.enums.MailTemplate;
import com.alfarays.role.entity.Role;
import com.alfarays.role.repository.RoleRepository;
import com.alfarays.token.enums.DurationUnit;
import com.alfarays.token.service.ITokenService;
import com.alfarays.user.entity.User;
import com.alfarays.user.mapper.UserMapper;
import com.alfarays.authentication.model.RegistrationRequest;
import com.alfarays.user.model.ChangePassword;
import com.alfarays.user.model.UserResponse;
import com.alfarays.user.repository.UserRepository;
import com.alfarays.util.GlobalResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import io.micrometer.common.util.StringUtils;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import static com.alfarays.mail.enums.MailSubject.PASSWORD_RESET_REQUEST;
import static com.alfarays.token.enums.DurationUnit.MINUTE;
import static com.alfarays.token.enums.TokenType.RESET_PASSWORD;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService implements IUserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ImageRepository profileRepository;
    private final ImageService imageService;
    private final ITokenService confirmationToken;
    private final IMailService mailService;
    private final PasswordEncoder passwordEncoder;

    @Value("${application.email.reset-password-url}")
    private String resetPasswordUrl;
    private static final DurationUnit DURATION_UNIT = MINUTE;
    private static final int TOKEN_DURATION = 15;

    @Override
    public GlobalResponse<UserResponse> findByUsername(String username) {
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found by username: " + username));
        var profile = getProfile(user.getId());
        user.setProfile(profile);

        return GlobalResponse.success(UserMapper.toResponse(user));
    }

    @Override
    public GlobalResponse<UserResponse> findByEmail(String email) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found by email: " + email));
        var profile = getProfile(user.getId());
        user.setProfile(profile);

        return GlobalResponse.success(UserMapper.toResponse(user));
    }

    @Override
    public GlobalResponse<UserResponse> findById(Long id) {
        var user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found by id: " + id));
        var profile = getProfile(user.getId());
        user.setProfile(profile);

        return GlobalResponse.success(UserMapper.toResponse(user));
    }

    @Override
    public GlobalResponse<Boolean> update(RegistrationRequest request, String username, MultipartFile profile) throws IOException {

        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found by username: " + username));

        var image = getProfile(user.getId());

        if (StringUtils.isNotBlank(request.lastName()) || StringUtils.isNotEmpty(request.lastName())) {
            user.setFirstName(request.lastName());
        }

        if (StringUtils.isNotBlank(request.firstName()) || StringUtils.isNotEmpty(request.firstName())) {
            user.setLastName(request.firstName());
        }

        if (Objects.nonNull(profile)) {
            Image updatedProfile = imageService.updateProfile(profile, image);
            user.setProfile(updatedProfile);
        }

        userRepository.save(user);
        return GlobalResponse.success(Boolean.TRUE);
    }

    @Override
    public GlobalResponse<Void> changeProfile(MultipartFile profile, Authentication authentication) {
        final String username = authentication.getName();
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User does not exist!"));
        try {
            imageService.updateProfile(profile, getProfile(user.getId()));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return GlobalResponse.success("Profile updated successfully!");
    }

    @Override
    public GlobalResponse<Boolean> delete(String username) throws IOException {
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found by username: " + username));

        var image = getProfile(user.getId());

        //delete user profile image
        imageService.deleteProfile(image);

        userRepository.delete(user);
        return GlobalResponse.success(Boolean.TRUE);
    }

    @Override
    public GlobalResponse<Boolean> assignRole(String username, String[] names) {
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found by username: " + username));

        List<Role> roles = new ArrayList<>();
        for (String name : names) {
            var role = roleRepository.findByName(name)
                    .orElseThrow(() -> new AuthorizationException("Role not found by name: " + name));
            roles.add(role);
        }

        user.setRoles(roles);
        userRepository.save(user);

        return GlobalResponse.success(Boolean.TRUE);
    }

    @Override
    public GlobalResponse<Boolean> removeRole(String username, String[] names) {
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found by username: " + username));

        List<Role> roles = new ArrayList<>();
        for (String name : names) {
            var role = roleRepository.findByName(name)
                    .orElse(null);
            roles.add(role);
        }

        user.getRoles().removeAll(roles);
        userRepository.save(user);

        return GlobalResponse.success(Boolean.TRUE);
    }

    @Override
    public GlobalResponse<Void> resetPasswordRequest(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User does not exists."));
        String token = confirmationToken.create(username, RESET_PASSWORD, TOKEN_DURATION, DURATION_UNIT);

        sendMail(user, token, PASSWORD_RESET_REQUEST.content(), MailTemplate.RESET_PASSWORD);

        return GlobalResponse.success("A confirmation email has been sent to your registered email address.");
    }

    @Override
    public GlobalResponse<Void> changePassword(ChangePassword request, Authentication authentication) {
        final String username = authentication.getName();
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AuthorizationException("User not found by username: " + username));

        confirmationToken.validate(username, request.token(), request.type());

        if (!request.newPassword().equals(request.confirmNewPassword())) {
            throw new AuthorizationException("Password and new password do not match!");
        }

        if (!passwordEncoder.matches(request.oldPassword(), user.getPassword())) {
            throw new AuthorizationException("Your old password is incorrect!");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        return GlobalResponse.success("Password reset successfully!");
    }

    private Image getProfile(Long userId) {
        return profileRepository.findByUserId(userId)
                .orElse(null);
    }

    private void sendMail(User user, String token, String subject, MailTemplate template) {
        mailService.send(
                MailRequest
                        .builder()
                        .from("rupeshdulal672@gmail.com")
                        .to(user.getEmail())
                        .name(user.getFirstName() + " " + user.getLastName())
                        .username(user.getUsername())
                        .subject(subject)
                        .activationCode(token)
                        .confirmationUrl(resetPasswordUrl)
                        .template(template)
                        .build()
        );
    }

}
